import enum
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel


class UserRole(str, enum.Enum):
    STARTUP = "startup"
    SUPPORTER = "supporter"
    INVESTOR = "investor"


class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    role: UserRole
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str

    # Relationships
    startups: List["Startup"] = Relationship(back_populates="founder")  # type: ignore # noqa: F821


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int


class UserUpdate(SQLModel):
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None
