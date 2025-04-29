from typing import Annotated, Any
from datetime import timedelta

from fastapi import APIRouter, HTTPException, status,Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import SessionDep,CurrentUser
from app.crud.user import create_user, get_user_by_email,authenticate_user
from app.models.user import UserCreate, UserRegister,UserPublic,Token
from app.core.config import settings
from app.core.security import create_access_token



router = APIRouter(prefix="/users", tags=["users"])


@router.post("/signup",
    response_model=UserPublic,
    status_code=status.HTTP_201_CREATED)
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


@router.post("/login/access-token", )
async def login_access_token(
    session: SessionDep,
    form_data:Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    """Login for a user access token.

    Args:
        session (SessionDep): The database session.
        form_data (OAuth2PasswordRequestForm): The user data.

    Returns:
        Token: The access token.
    """

    user  = authenticate_user(
        db=session,
        email=form_data.username,
        password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect email or password"
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Token(
        access_token=create_access_token(
            user.id,
            expires_delta=access_token_expires
        )
    )


@router.get("/me", response_model=UserPublic)
async def get_current_user(
    current_user: CurrentUser
) -> Any:
    """Get the current user.

    Args:
        session (SessionDep): The database session.
        current_user (UserDep): The current user.

    Returns:
        User: The current user.
    """

    return current_user
