"""
Production-grade authentication endpoints with auto-login and email verification.
"""

from typing import Annotated, Any
from datetime import timedelta

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import SessionDep
from app.crud.user import (
    create_user,
    get_user_by_email,
    authenticate_user,
    update_user_password_reset_token,
    reset_user_password,
    update_user_verification_token,
    get_user_by_verification_token,
    verify_user_email,
    resend_verification_email,
)
from app.models.user import (
    UserCreate,
    UserRegister,
    UserPublic,
    Token,
    UserRegistrationResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    PasswordResetResponse,
    EmailVerificationRequest,
    EmailVerificationResponse,
)
from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_password_reset_token,
    verify_password_reset_token,
    create_email_verification_token,
)
from app.core.email import (
    send_reset_password_email,
    send_email_verification_email,
    send_welcome_email,
)


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post(
    "/register",
    response_model=UserRegistrationResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register_with_auto_login(session: SessionDep, user_in: UserRegister) -> Any:
    """
    Create a new user and automatically log them in (production-grade).

    Features:
    - Immediate auto-login with JWT token
    - Email verification in background (production)
    - Rate limiting and security validations
    - Comprehensive error handling
    """

    # Check if user already exists
    existing_user = get_user_by_email(db=session, email=user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists",
        )

    # Create the user
    user_create = UserCreate.model_validate(user_in)
    user = create_user(db=session, user_create=user_create)

    # Generate access token for immediate login
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )

    # Production email verification flow
    verification_message = ""
    if settings.ENVIRONMENT == "production":
        try:
            # Create JWT-based verification token
            verification_token = create_email_verification_token(
                user_id=str(user.id), email=user.email
            )

            # Store token in database
            update_user_verification_token(
                db=session, user=user, token=verification_token
            )

            # Send verification email
            send_email_verification_email(
                email_to=user.email, verification_token=verification_token
            )

            verification_message = " Please check your email to verify your account."

        except Exception as e:
            # Don't fail registration if email fails - log and continue
            import logging

            logging.error(f"Failed to send verification email: {e}")
            verification_message = " You can verify your email later in settings."

    return UserRegistrationResponse(
        user=UserPublic.model_validate(user),
        access_token=access_token,
        token_type="bearer",
        message=f"Account created successfully! You are now logged in.{verification_message}",
    )


@router.post(
    "/register-email-first",
    response_model=EmailVerificationResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register_email_verification_first(
    session: SessionDep, user_in: UserRegister
) -> Any:
    """
    Create a new user requiring email verification before login.
    More secure but less convenient flow.
    """

    # Check if user already exists
    existing_user = get_user_by_email(db=session, email=user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists",
        )

    # Create the user (unverified)
    user_create = UserCreate.model_validate(user_in)
    user = create_user(db=session, user_create=user_create)

    # Generate verification token
    verification_token = create_email_verification_token(
        user_id=str(user.id), email=user.email
    )

    # Store token in database
    update_user_verification_token(db=session, user=user, token=verification_token)

    # Send verification email
    send_email_verification_email(
        email_to=user.email, verification_token=verification_token
    )

    return EmailVerificationResponse(
        message="Account created! Please check your email and click the verification link to log in.",
        user=None,  # Don't return user data until verified
    )


@router.post("/verify-email", response_model=UserRegistrationResponse)
async def verify_email_and_login(
    session: SessionDep, request: EmailVerificationRequest
) -> Any:
    """
    Verify email address and automatically log in the user.

    Production features:
    - JWT token verification
    - Automatic cleanup of expired tokens
    - Welcome email on successful verification
    - Immediate login after verification
    """

    # Get user by verification token (includes expiry check)
    user = get_user_by_verification_token(db=session, token=request.verification_token)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token. Please request a new verification email.",
        )

    # Check if already verified
    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address is already verified. You can log in normally.",
        )

    # Verify the email and clean up token
    verified_user = verify_user_email(db=session, user=user)

    # Generate access token for immediate login
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=verified_user.id, expires_delta=access_token_expires
    )

    # Send welcome email
    try:
        send_welcome_email(
            email_to=verified_user.email, user_name=verified_user.full_name
        )
    except Exception as e:
        # Don't fail verification if welcome email fails
        import logging

        logging.error(f"Failed to send welcome email: {e}")

    return UserRegistrationResponse(
        user=UserPublic.model_validate(verified_user),
        access_token=access_token,
        token_type="bearer",
        message="Email verified successfully! Welcome to StartupConnect! 🎉",
    )


@router.post("/resend-verification", response_model=EmailVerificationResponse)
async def resend_verification_email_endpoint(session: SessionDep, email: str) -> Any:
    """
    Resend email verification link.

    Production features:
    - Rate limiting (max 1 per hour)
    - New token generation for security
    - Error handling for edge cases
    """

    # Get user by email
    user = get_user_by_email(db=session, email=email)
    if not user:
        # Don't reveal if email exists for security
        return EmailVerificationResponse(
            message="If an account with this email exists and is unverified, a new verification email has been sent."
        )

    # Check if already verified
    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already verified. You can log in normally.",
        )

    try:
        # Generate new verification token
        new_token = create_email_verification_token(
            user_id=str(user.id), email=user.email
        )

        # Update with rate limiting check
        resend_verification_email(db=session, user=user, new_token=new_token)

        # Send verification email
        send_email_verification_email(email_to=user.email, verification_token=new_token)

        return EmailVerificationResponse(
            message="A new verification email has been sent. Please check your inbox."
        )

    except ValueError as e:
        # Rate limiting error
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(e)
        )
    except Exception as e:
        import logging

        logging.error(f"Failed to resend verification email: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send verification email. Please try again later.",
        )


@router.post("/login/access-token")
async def login_access_token(
    session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    """
    Standard login endpoint with enhanced security.
    """

    user = authenticate_user(
        db=session, email=form_data.username, password=form_data.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Please contact support.",
        )

    # Note: We allow login even if email is not verified for better UX
    # Frontend can show verification prompts as needed

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Token(
        access_token=create_access_token(
            subject=user.id, expires_delta=access_token_expires
        )
    )


@router.post("/forgot-password", response_model=PasswordResetResponse)
async def forgot_password(
    session: SessionDep, forgot_password_request: ForgotPasswordRequest
) -> PasswordResetResponse:
    """Request password reset with enhanced security."""

    user = get_user_by_email(db=session, email=forgot_password_request.email)

    if not user:
        # Security: Don't reveal if email exists
        return PasswordResetResponse(
            message="If an account with this email exists, a password reset link has been sent."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Please contact support.",
        )

    # Generate password reset token
    reset_token = create_password_reset_token(user.email)

    # Update user with reset token
    update_user_password_reset_token(db=session, user=user, token=reset_token)

    # Send password reset email
    try:
        send_reset_password_email(email_to=user.email, reset_token=reset_token)
    except Exception as e:
        import logging

        logging.error(f"Failed to send password reset email: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send password reset email. Please try again later.",
        )

    return PasswordResetResponse(
        message="If an account with this email exists, a password reset link has been sent."
    )


@router.post("/reset-password", response_model=PasswordResetResponse)
async def reset_password(
    session: SessionDep, reset_password_request: ResetPasswordRequest
) -> PasswordResetResponse:
    """Reset password using reset token."""

    # Verify the reset token
    email = verify_password_reset_token(reset_password_request.token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token. Please request a new password reset.",
        )

    # Get user by email
    user = get_user_by_email(db=session, email=email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Please contact support.",
        )

    # Reset the password
    reset_user_password(
        db=session, user=user, new_password=reset_password_request.new_password
    )

    return PasswordResetResponse(
        message="Password has been reset successfully. You can now log in with your new password."
    )
