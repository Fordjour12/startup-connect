from typing import Any

from fastapi import APIRouter, HTTPException, status

from app.api.deps import SessionDep
from app.crud.user import create_user, get_user_by_email
from app.models.user import UserCreate, UserRegister,UserPublic


router = APIRouter(prefix="/users", tags=["users"])


@router.post("/signup", response_model=UserPublic)
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
