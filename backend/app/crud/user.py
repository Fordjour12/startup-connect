import uuid
from datetime import datetime, timedelta
from typing import List, Optional

from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password
from app.models.user import (
    EmailVerificationToken,
    PasswordResetToken,
    User,
    UserCreate,
    UserUpdate,
)


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


def create_password_reset_token_entry(
    *, db: Session, user: User, token: str, expires_in_hours: int = 1
) -> PasswordResetToken:
    expires_at = datetime.utcnow() + timedelta(hours=expires_in_hours)
    prt = PasswordResetToken(user_id=user.id, token=token, expires_at=expires_at)
    db.add(prt)
    db.commit()
    db.refresh(prt)
    return prt


def get_valid_password_reset_token(
    *, db: Session, token: str
) -> Optional[PasswordResetToken]:
    prt = db.exec(
        select(PasswordResetToken).where(
            PasswordResetToken.token == token,
            not PasswordResetToken.used,
            PasswordResetToken.expires_at > datetime.utcnow(),
        )
    ).first()
    return prt


def mark_password_reset_token_used(*, db: Session, prt: PasswordResetToken) -> None:
    prt.used = True
    db.add(prt)
    db.commit()


def reset_user_password(*, db: Session, user: User, new_password: str) -> User:
    user.hashed_password = get_password_hash(new_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


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
    statement = select(User).where(User.is_active).offset(skip).limit(limit)
    return db.exec(statement).all()  # type: ignore


def get_verified_users(*, db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Get only verified users."""
    statement = select(User).where(User.is_verified).offset(skip).limit(limit)
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
    statement = select(User).where(User.is_active)
    return len(db.exec(statement).all())


def count_verified_users(*, db: Session) -> int:
    """Get count of verified users."""
    statement = select(User).where(User.is_verified)
    return len(db.exec(statement).all())


def user_exists(*, db: Session, email: str) -> bool:
    """Check if user exists by email."""
    user = get_user_by_email(db=db, email=email)
    return user is not None


def create_email_verification_token_entry(
    *, db: Session, user: User, token: str, expires_in_hours: int = 24
) -> EmailVerificationToken:
    expires_at = datetime.utcnow() + timedelta(hours=expires_in_hours)
    evt = EmailVerificationToken(user_id=user.id, token=token, expires_at=expires_at)
    db.add(evt)
    db.commit()
    db.refresh(evt)
    return evt


def get_valid_email_verification_token(
    *, db: Session, token: str
) -> Optional[EmailVerificationToken]:
    evt = db.exec(
        select(EmailVerificationToken).where(
            EmailVerificationToken.token == token,
            not EmailVerificationToken.used,
            EmailVerificationToken.expires_at > datetime.utcnow(),
        )
    ).first()
    return evt


def mark_email_verification_token_used(
    *, db: Session, evt: EmailVerificationToken
) -> None:
    evt.used = True
    db.add(evt)
    db.commit()


def verify_user_email(*, db: Session, user: User) -> User:
    user.is_verified = True
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def cleanup_expired_password_reset_tokens(*, db: Session) -> int:
    """Delete all expired password reset tokens and return the count."""
    now = datetime.utcnow()
    statement = select(PasswordResetToken).where(
        PasswordResetToken.expires_at <= now, not PasswordResetToken.used
    )
    expired_tokens = db.exec(statement).all()
    count = 0
    for token in expired_tokens:
        db.delete(token)
        count += 1
    if count > 0:
        db.commit()
    return count


def cleanup_expired_email_verification_tokens(*, db: Session) -> int:
    """Delete all expired email verification tokens and return the count."""
    now = datetime.utcnow()
    statement = select(EmailVerificationToken).where(
        EmailVerificationToken.expires_at <= now, not EmailVerificationToken.used
    )
    expired_tokens = db.exec(statement).all()
    count = 0
    for token in expired_tokens:
        db.delete(token)
        count += 1
    if count > 0:
        db.commit()
    return count


def cleanup_expired_tokens(*, db: Session) -> dict:
    """Cleanup all expired tokens and return counts for each type."""
    reset_count = cleanup_expired_password_reset_tokens(db=db)
    verification_count = cleanup_expired_email_verification_tokens(db=db)
    return {
        "reset_tokens_deleted": reset_count,
        "verification_tokens_deleted": verification_count,
        "total_deleted": reset_count + verification_count,
    }
