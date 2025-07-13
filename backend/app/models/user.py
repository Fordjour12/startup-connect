import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


class UserRole(str, enum.Enum):
    FOUNDER = "Founder"
    SUPPORTER = "Supporter"
    INVESTOR = "Investor"


class UserBase(SQLModel):
    full_name: str = Field(default=None, max_length=255)
    email: EmailStr = Field(unique=True, index=True)
    role: UserRole
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)


class PasswordResetToken(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    token: str = Field(index=True)
    expires_at: datetime
    used: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    user: "User" = Relationship(back_populates="password_reset_tokens")


class EmailVerificationToken(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    token: str = Field(index=True)
    expires_at: datetime
    used: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    user: "User" = Relationship(back_populates="email_verification_tokens")


class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str

    # Relationships
    files: List["FileMetadata"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    startups: List["Startup"] = Relationship(
        back_populates="founder",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )  # type: ignore # noqa: F821
    investor_profile: Optional["InvestorProfile"] = Relationship(back_populates="user")  # type: ignore # noqa: F821
    pitch_decks: List["PitchDeck"] = Relationship(
        back_populates="founder",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )  # type: ignore # noqa: F821
    sent_pitches: List["PitchMessage"] = Relationship(
        back_populates="sender",
        sa_relationship_kwargs={
            "foreign_keys": "PitchMessage.founder_id",
            "cascade": "all, delete-orphan",
        },
    )  # type: ignore # noqa: F821
    received_pitches: List["PitchMessage"] = Relationship(
        back_populates="recipient",
        sa_relationship_kwargs={
            "foreign_keys": "PitchMessage.investor_id",
            "cascade": "all, delete-orphan",
        },
    )  # type: ignore # noqa: F821
    password_reset_tokens: List["PasswordResetToken"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    email_verification_tokens: List["EmailVerificationToken"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    full_name: str = Field(default=None, max_length=255)
    email: EmailStr = Field(unique=True, index=True)
    password: str = Field(min_length=8, max_length=40)
    role: UserRole = Field(default=None)


# Public Response
class UserPublic(UserBase):
    id: uuid.UUID


class UserUpdate(SQLModel):
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None


# Password reset models
class ForgotPasswordRequest(SQLModel):
    email: EmailStr


class ResetPasswordRequest(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)


class PasswordResetResponse(SQLModel):
    message: str


# Email verification models
class EmailVerificationRequest(SQLModel):
    verification_token: str


class EmailVerificationResponse(SQLModel):
    message: str
    user: Optional[UserPublic] = None


# Json access token payload
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(SQLModel):
    exp: int
    sub: str | None = None


# Registration response with auto-login
class UserRegistrationResponse(SQLModel):
    user: UserPublic
    access_token: str
    token_type: str = "bearer"
    message: str = "Account created successfully"


if TYPE_CHECKING:
    from .investor import InvestorProfile
    from .pitch import PitchDeck, PitchMessage
    from .startup import Startup
    from .upload import FileMetadata
    from .user import EmailVerificationToken, PasswordResetToken
