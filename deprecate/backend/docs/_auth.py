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
)
from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_password_reset_token,
    verify_password_reset_token,
    generate_verification_token,
)
from app.core.email import (
    send_reset_password_email,
    send_email_verification_email,
)


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register",
    response_model=UserRegistrationResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_new_user(session: SessionDep, user_in: UserRegister) -> Any:
    """Create a new user and automatically log them in.

    Args:
        session (SessionDep): The database session.
        user_in (UserRegister): The user registration data.

    Returns:
        UserRegistrationResponse: The created user with access token for immediate login.
    """

    # Check if user already exists
    existing_user = get_user_by_email(db=session, email=user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # Create the user
    user_create = UserCreate.model_validate(user_in)
    user = create_user(db=session, user_create=user_create)

    # Generate access token for immediate login
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )

    # Send email verification (optional - user is already logged in)
    if settings.ENVIRONMENT == "production":
        verification_token = create_email_verification_token(
            user_id=str(user.id), email=user.email
        )
        update_user_verification_token(db=session, user=user, token=verification_token)
        send_email_verification_email(
            email_to=user.email, verification_token=verification_token
        )

    # Return user data with access token
    return UserRegistrationResponse(
        user=UserPublic.model_validate(user),
        access_token=access_token,
        token_type="bearer",
        message="Account created successfully. You are now logged in!"
        + (
            " Please check your email to verify your account."
            if settings.ENVIRONMENT == "production"
            else ""
        ),
    )


@router.post(
    "/register-with-verification",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
)
async def register_with_email_verification(
    session: SessionDep, user_in: UserRegister
) -> Any:
    """Create a new user and send email verification (login after verification).

    Args:
        session (SessionDep): The database session.
        user_in (UserRegister): The user registration data.

    Returns:
        dict: Success message with instructions to verify email.
    """

    # Check if user already exists
    existing_user = get_user_by_email(db=session, email=user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # Create the user (unverified)
    user_create = UserCreate.model_validate(user_in)
    user = create_user(db=session, user_create=user_create)

    # Generate and send email verification
    verification_token = generate_verification_token()
    send_email_verification_email(
        email_to=user.email, verification_token=verification_token
    )

    return {
        "message": "Account created successfully. Please check your email to verify your account before logging in.",
        "email": user.email,
        "verification_required": True,
    }


@router.post("/verify-email", response_model=UserRegistrationResponse)
async def verify_email_and_login(
    session: SessionDep, request: EmailVerificationRequest
) -> Any:
    """Verify email and automatically log in the user.

    Args:
        session (SessionDep): The database session.
        request (EmailVerificationRequest): The verification token.

    Returns:
        UserRegistrationResponse: The verified user with access token.
    """
    # Get user by verification token
    user = get_user_by_verification_token(db=session, token=request.verification_token)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token",
        )

    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already verified"
        )

    # Verify the user's email
    verified_user = verify_user_email(db=session, user=user)

    # Generate access token for login
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=verified_user.id, expires_delta=access_token_expires
    )

    # Send welcome email
    send_welcome_email(email_to=verified_user.email, user_name=verified_user.full_name)

    return UserRegistrationResponse(
        user=UserPublic.model_validate(verified_user),
        access_token=access_token,
        token_type="bearer",
        message="Email verified successfully! Welcome to StartupConnect!",
    )


@router.post(
    "/login/access-token",
)
async def login_access_token(
    session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    """Login for a user access token.

    Args:
        session (SessionDep): The database session.
        form_data (OAuth2PasswordRequestForm): The user data.

    Returns:
        Token: The access token.
    """

    user = authenticate_user(
        db=session, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Token(
        access_token=create_access_token(user.id, expires_delta=access_token_expires)
    )


@router.post("/forgot-password", response_model=PasswordResetResponse)
async def forgot_password(
    session: SessionDep, forgot_password_request: ForgotPasswordRequest
) -> PasswordResetResponse:
    """Request password reset.

    Args:
        session (SessionDep): The database session.
        forgot_password_request (ForgotPasswordRequest): The email for password reset.

    Returns:
        PasswordResetResponse: Confirmation message.
    """
    user = get_user_by_email(db=session, email=forgot_password_request.email)

    if not user:
        # For security reasons, don't reveal if email exists or not
        return PasswordResetResponse(
            message="If an account with this email exists, a password reset link has been sent."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )

    # Generate password reset token
    reset_token = create_password_reset_token(user.email)

    # Update user with reset token
    update_user_password_reset_token(db=session, user=user, token=reset_token)

    # Send password reset email
    send_reset_password_email(email_to=user.email, reset_token=reset_token)

    return PasswordResetResponse(
        message="If an account with this email exists, a password reset link has been sent."
    )


@router.post("/reset-password", response_model=PasswordResetResponse)
async def reset_password(
    session: SessionDep, reset_password_request: ResetPasswordRequest
) -> PasswordResetResponse:
    """Reset password using reset token.

    Args:
        session (SessionDep): The database session.
        reset_password_request (ResetPasswordRequest): The reset token and new password.

    Returns:
        PasswordResetResponse: Confirmation message.
    """
    # Verify the reset token
    email = verify_password_reset_token(reset_password_request.token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )

    # Get user by email
    user = get_user_by_email(db=session, email=email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )

    # Reset the password
    reset_user_password(
        db=session, user=user, new_password=reset_password_request.new_password
    )

    return PasswordResetResponse(message="Password has been reset successfully")
