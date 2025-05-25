import uuid
from typing import List, Optional
from datetime import datetime, timedelta

from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password  # type: ignore
from app.models.user import User, UserCreate  # type: ignore


def get_user(*, db: Session, user_id: uuid.UUID) -> Optional[User]:
    return db.get(User, user_id)


def get_user_by_email(*, db: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    return db.exec(statement).first()


def get_users(*, db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    statement = select(User).offset(skip).limit(limit)
    return db.exec(statement).all()  # type: ignore


def create_user(*, db: Session, user_create: UserCreate) -> User:
    db_usr_obj = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(user_create.password)}
    )
    db.add(db_usr_obj)
    db.commit()
    db.refresh(db_usr_obj)
    return db_usr_obj


def authenticate_user(*, db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db=db, email=email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def update_user_password_reset_token(*, db: Session, user: User, token: str) -> User:
    """Update user with password reset token and expiry time."""
    user.reset_token = token
    user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def reset_user_password(*, db: Session, user: User, new_password: str) -> User:
    """Reset user password and clear reset token."""
    user.hashed_password = get_password_hash(new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_reset_token(*, db: Session, token: str) -> User | None:
    """Get user by reset token if token is valid and not expired."""
    statement = select(User).where(
        User.reset_token == token, User.reset_token_expires > datetime.utcnow()
    )
    return db.exec(statement).first()


# def update_user(*, db: Session, user_id: int, user: UserUpdate) -> Optional[User]:
#     db_user = get_user(db, user_id)
#     if not db_user:
#         return None

#     update_data = user.model_dump(exclude_unset=True)
#     if "password" in update_data:
#         update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

#     for field, value in update_data.items():
#         setattr(db_user, field, value)

#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user


# def delete_user(*, db: Session, user_id: int) -> bool:
#     db_user = get_user(db, user_id)
#     if not db_user:
#         return False

#     db.delete(db_user)
#     db.commit()
#     return True
