from datetime import datetime, timedelta, timezone
from typing import Any
import secrets

import jwt
from passlib.context import CryptContext

from app.core.config import settings


ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(subject: str | Any, expires_delta: timedelta) -> str:
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


def generate_password_reset_token() -> str:
    """Generate a secure random token for password reset."""
    return secrets.token_urlsafe(32)


def create_password_reset_token(email: str) -> str:
    """Create a JWT token for password reset with email as subject."""
    expire = datetime.now(timezone.utc) + timedelta(hours=1)  # 1 hour expiry
    to_encode = {"exp": expire, "sub": email, "type": "password_reset"}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_password_reset_token(token: str) -> str | None:
    """Verify password reset token and return email if valid."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        if email is None or token_type != "password_reset":
            return None
        return email
    except jwt.PyJWTError:
        return None


# Email verification token functions
def generate_verification_token() -> str:
    """Generate a secure random token for email verification."""
    return secrets.token_urlsafe(32)


def create_email_verification_token(user_id: str, email: str) -> str:
    """Create a JWT token for email verification with user ID and email."""
    expire = datetime.now(timezone.utc) + timedelta(hours=24)  # 24 hour expiry
    to_encode = {
        "exp": expire,
        "sub": user_id,
        "email": email,
        "type": "email_verification",
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_email_verification_token(token: str) -> dict | None:
    """Verify email verification token and return user data if valid."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        token_type: str = payload.get("type")

        if user_id is None or email is None or token_type != "email_verification":
            return None

        return {"user_id": user_id, "email": email}
    except jwt.PyJWTError:
        return None


def create_verification_url(token: str, base_url: str = "http://localhost:3000") -> str:
    """Create a complete verification URL with token."""
    return f"{base_url}/verify-email?token={token}"
