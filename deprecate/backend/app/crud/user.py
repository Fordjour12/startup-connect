import uuid
from typing import List, Optional
from datetime import datetime, timedelta

from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password
from app.models.user import User, UserCreate, UserUpdate


def get_user(*, db: Session, user_id: uuid.UUID) -> Optional[User]:
    """Get user by ID."""
    return db.get(User, user_id)


def get_user_by_email(*, db: Session, email: str) -> User | None:
    """Get user by email address."""
    statement = select(User).where(User.email == email)
    return db.exec(statement).first()


def get_users(*, db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Get all users with pagination."""
    statement = select(User).offset(skip).limit(limit)
    return db.exec(statement).all()  # type: ignore


def create_user(*, db: Session, user_create: UserCreate) -> User:
    """Create a new user."""
    db_usr_obj = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(user_create.password)}
    )
    db.add(db_usr_obj)
    db.commit()
    db.refresh(db_usr_obj)
    return db_usr_obj


def authenticate_user(*, db: Session, email: str, password: str) -> User | None:
    """Authenticate user with email and password."""
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
    # First get user by token, then check expiry in Python
    statement = select(User).where(User.reset_token == token)
    user = db.exec(statement).first()

    if (
        user
        and user.reset_token_expires
        and user.reset_token_expires > datetime.utcnow()
    ):
        return user
    return None


def update_user(
    *, db: Session, user_id: uuid.UUID, user_update: UserUpdate
) -> Optional[User]:
    """Update user with provided data."""
    db_user = get_user(db=db, user_id=user_id)
    if not db_user:
        return None

    update_data = user_update.model_dump(exclude_unset=True)

    # Handle password update separately
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

    # Update user fields
    for field, value in update_data.items():
        if hasattr(db_user, field):
            setattr(db_user, field, value)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user_verification_status(
    *, db: Session, user: User, is_verified: bool = True
) -> User:
    """Update user email verification status."""
    user.is_verified = is_verified
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def deactivate_user(*, db: Session, user_id: uuid.UUID) -> Optional[User]:
    """Deactivate user instead of deleting (soft delete)."""
    db_user = get_user(db=db, user_id=user_id)
    if not db_user:
        return None

    db_user.is_active = False
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def reactivate_user(*, db: Session, user_id: uuid.UUID) -> Optional[User]:
    """Reactivate a deactivated user."""
    db_user = get_user(db=db, user_id=user_id)
    if not db_user:
        return None

    db_user.is_active = True
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(*, db: Session, user_id: uuid.UUID) -> bool:
    """Permanently delete user from database."""
    db_user = get_user(db=db, user_id=user_id)
    if not db_user:
        return False

    db.delete(db_user)
    db.commit()
    return True


def get_active_users(*, db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Get only active users."""
    statement = select(User).where(User.is_active == True).offset(skip).limit(limit)
    return db.exec(statement).all()  # type: ignore


def get_verified_users(*, db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Get only verified users."""
    statement = select(User).where(User.is_verified == True).offset(skip).limit(limit)
    return db.exec(statement).all()  # type: ignore


def get_users_by_role(
    *, db: Session, role: str, skip: int = 0, limit: int = 100
) -> List[User]:
    """Get users by role."""
    statement = select(User).where(User.role == role).offset(skip).limit(limit)
    return db.exec(statement).all()  # type: ignore


def count_users(*, db: Session) -> int:
    """Get total count of users."""
    statement = select(User)
    return len(db.exec(statement).all())


def count_active_users(*, db: Session) -> int:
    """Get count of active users."""
    statement = select(User).where(User.is_active == True)
    return len(db.exec(statement).all())


def count_verified_users(*, db: Session) -> int:
    """Get count of verified users."""
    statement = select(User).where(User.is_verified == True)
    return len(db.exec(statement).all())


def user_exists(*, db: Session, email: str) -> bool:
    """Check if user exists by email."""
    user = get_user_by_email(db=db, email=email)
    return user is not None


def clear_expired_reset_tokens(*, db: Session) -> int:
    """Clear all expired password reset tokens and return count of cleared tokens."""
    current_time = datetime.utcnow()
    # Get all users with reset tokens
    statement = select(User).where(User.reset_token != None)
    users_with_tokens = db.exec(statement).all()

    count = 0
    for user in users_with_tokens:
        # Check if token is expired
        if user.reset_token_expires and user.reset_token_expires <= current_time:
            user.reset_token = None
            user.reset_token_expires = None
            db.add(user)
            count += 1

    if count > 0:
        db.commit()

    return count


# Email verification functions
def update_user_verification_token(*, db: Session, user: User, token: str) -> User:
    """Update user with email verification token and expiry time."""
    user.verification_token = token
    user.verification_token_expires = datetime.utcnow() + timedelta(
        hours=24
    )  # 24 hour expiry
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_verification_token(*, db: Session, token: str) -> User | None:
    """Get user by verification token if token is valid and not expired."""
    # First get user by token, then check expiry in Python
    statement = select(User).where(User.verification_token == token)
    user = db.exec(statement).first()

    if (
        user
        and user.verification_token_expires
        and user.verification_token_expires > datetime.utcnow()
    ):
        return user
    return None


def verify_user_email(*, db: Session, user: User) -> User:
    """Verify user email and clear verification token."""
    user.is_verified = True
    user.verification_token = None
    user.verification_token_expires = None
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def clear_expired_verification_tokens(*, db: Session) -> int:
    """Clear all expired email verification tokens and return count of cleared tokens."""
    current_time = datetime.utcnow()
    # Get all users with verification tokens
    statement = select(User).where(User.verification_token != None)
    users_with_tokens = db.exec(statement).all()

    count = 0
    for user in users_with_tokens:
        # Check if token is expired
        if (
            user.verification_token_expires
            and user.verification_token_expires <= current_time
        ):
            user.verification_token = None
            user.verification_token_expires = None
            db.add(user)
            count += 1

    if count > 0:
        db.commit()

    return count


def resend_verification_email(*, db: Session, user: User, new_token: str) -> User:
    """Resend verification email with new token (rate limited)."""
    # Check if user already has a recent verification token (rate limiting)
    if (
        user.verification_token_expires
        and user.verification_token_expires
        > datetime.utcnow() + timedelta(hours=23)  # Less than 1 hour old
    ):
        raise ValueError(
            "Verification email already sent recently. Please wait before requesting another."
        )

    return update_user_verification_token(db=db, user=user, token=new_token)


def cleanup_expired_tokens(*, db: Session) -> dict:
    """Cleanup all expired tokens (both reset and verification) and return counts."""
    reset_count = clear_expired_reset_tokens(db=db)
    verification_count = clear_expired_verification_tokens(db=db)

    return {
        "reset_tokens_cleared": reset_count,
        "verification_tokens_cleared": verification_count,
        "total_cleared": reset_count + verification_count,
    }
