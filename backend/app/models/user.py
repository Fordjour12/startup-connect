import enum
import uuid
from typing import List, Optional

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


class UserRole(str, enum.Enum):
    STARTUP = "startup"
    SUPPORTER = "supporter"
    INVESTOR = "investor"


class UserBase(SQLModel):
    full_name: str = Field(default=None, max_length=255)
    email: EmailStr = Field(unique=True, index=True)
    role: UserRole
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)


class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str

    # Relationships
    startups: List["Startup"] = Relationship(back_populates="founder")  # type: ignore # noqa: F821


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

# Json access token payload
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"

class TokenPayload(SQLModel):
    exp: int
    sub: str | None = None
