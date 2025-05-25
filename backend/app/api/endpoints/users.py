from typing import Annotated, Any
from datetime import timedelta

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import SessionDep, CurrentUser  # type: ignore
from app.crud.user import ( # type: ignore
    create_user,
    get_user_by_email,
    authenticate_user,
    update_user_password_reset_token,
    reset_user_password,
)  # type: ignore
from app.models.user import ( # type: ignore
    UserCreate,
    UserRegister,
    UserPublic,
    Token,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    PasswordResetResponse,
)  # type: ignore
from app.core.config import settings  # type: ignore
from app.core.security import ( # type: ignore
    create_access_token,
    create_password_reset_token,
    verify_password_reset_token,
)  # type: ignore
from app.core.email import send_reset_password_email  # type: ignore


router = APIRouter(prefix="/users", tags=["users"])


@router.post(
    "/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED
)
async def create_new_user(session: SessionDep, user_in: UserRegister) -> Any:
    """Create a new user.

    Args:
        session (SessionDep): The database session.
        user_in (UserRegistration): The user data.

    Returns:
        User: The created user.
    """

    user = get_user_by_email(db=session, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )
    user_create = UserCreate.model_validate(user_in)
    user = create_user(db=session, user_create=user_create)

    return user


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


@router.get("/me", response_model=UserPublic)
async def get_current_user(current_user: CurrentUser) -> Any:
    """Get the current user.

    Args:
        session (SessionDep): The database session.
        current_user (UserDep): The current user.

    Returns:
        User: The current user.
    """

    return current_user


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
