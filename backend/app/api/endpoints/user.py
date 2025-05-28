from typing import Any, List
import uuid

from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, SessionDep
from app.crud import user as user_crud
from app.models.user import UserPublic, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserPublic)
async def get_current_user(current_user: CurrentUser) -> Any:
    """Get the current user.

    Args:
        current_user (CurrentUser): The current authenticated user.

    Returns:
        UserPublic: The current user's public information.
    """
    return current_user


@router.put("/me", response_model=UserPublic)
async def update_current_user(
    *, session: SessionDep, current_user: CurrentUser, user_update: UserUpdate
) -> Any:
    """Update the current user.

    Args:
        session (SessionDep): The database session.
        current_user (CurrentUser): The current authenticated user.
        user_update (UserUpdate): The user update data.

    Returns:
        UserPublic: The updated user information.
    """
    updated_user = user_crud.update_user(
        db=session, user_id=current_user.id, user_update=user_update
    )
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return updated_user


@router.get("/{user_id}", response_model=UserPublic)
async def get_user_by_id(
    *, session: SessionDep, current_user: CurrentUser, user_id: uuid.UUID
) -> Any:
    """Get a user by ID.

    Args:
        session (SessionDep): The database session.
        current_user (CurrentUser): The current authenticated user.
        user_id (uuid.UUID): The user ID to retrieve.

    Returns:
        UserPublic: The user information.
    """
    user = user_crud.get_user(db=session, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user


@router.get("/", response_model=List[UserPublic])
async def get_users(
    *, session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """Get all users with pagination.

    Args:
        session (SessionDep): The database session.
        current_user (CurrentUser): The current authenticated user.
        skip (int): Number of users to skip.
        limit (int): Maximum number of users to return.

    Returns:
        List[UserPublic]: List of users.
    """
    users = user_crud.get_users(db=session, skip=skip, limit=limit)
    return users


@router.delete("/me")
async def deactivate_current_user(
    *, session: SessionDep, current_user: CurrentUser
) -> Any:
    """Deactivate the current user (soft delete).

    Args:
        session (SessionDep): The database session.
        current_user (CurrentUser): The current authenticated user.

    Returns:
        dict: Success message.
    """
    deactivated_user = user_crud.deactivate_user(db=session, user_id=current_user.id)
    if not deactivated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return {"message": "User account deactivated successfully"}
