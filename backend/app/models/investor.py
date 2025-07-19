import uuid
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import JSON, Column
from sqlmodel import Field, Relationship, SQLModel

from app.models.startup import FundingStage, Industry, startup_investor_association


class InvestorProfileBase(SQLModel):
    firm_name: str = Field(index=True)
    bio: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    investment_focus: Optional[List[Industry]] = Field(
        default=None, sa_column=Column(JSON)
    )
    preferred_stages: Optional[List[FundingStage]] = Field(
        default=None, sa_column=Column(JSON)
    )


class InvestorProfile(InvestorProfileBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", unique=True)

    # Relationship to User
    user: "User" = Relationship(back_populates="investor_profile")  # type: ignore # noqa: F821
    startups: List["Startup"] = Relationship(
        back_populates="investors", link_model=startup_investor_association
    )


class InvestorProfileCreate(InvestorProfileBase):
    pass


class InvestorProfileRead(InvestorProfileBase):
    id: uuid.UUID
    user_id: uuid.UUID


class InvestorProfileUpdate(SQLModel):
    firm_name: Optional[str] = None
    bio: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    investment_focus: Optional[List[Industry]] = None
    preferred_stages: Optional[List[FundingStage]] = None


class InvestorWithUserRead(SQLModel):
    """Extended investor profile that includes user information for frontend compatibility."""

    id: uuid.UUID
    user_id: uuid.UUID
    name: str  # from user.full_name
    email: str  # from user.email
    company: Optional[str] = None  # from firm_name
    firm_name: str
    bio: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    investment_focus: Optional[List[Industry]] = None
    preferred_stages: Optional[List[FundingStage]] = None
    profile_picture: Optional[str] = None
    min_investment: Optional[int] = None
    max_investment: Optional[int] = None


if TYPE_CHECKING:
    from .startup import Startup
