import uuid
from typing import List, Optional

from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password
from app.models.user import User, UserCreate


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
