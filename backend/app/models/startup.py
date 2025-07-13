import enum
import json
import uuid
from typing import TYPE_CHECKING, Any, Dict, List, Optional, Union

from pydantic import field_validator
from sqlalchemy import JSON, Column, ForeignKey, Table
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .investor import InvestorProfile


class Industry(str, enum.Enum):
    TECHNOLOGY = "Technology"
    HEALTHCARE = "Healthcare"
    FINANCE = "Finance"
    EDUCATION = "Education"
    RETAIL = "Retail"
    MANUFACTURING = "Manufacturing"
    REAL_ESTATE = "Real Estate"
    ENERGY = "Energy"
    TRANSPORTATION = "Transportation"
    MEDIA = "Media"
    ENTERTAINMENT = "Entertainment"
    FOOD_BEVERAGE = "Food & Beverage"
    AGRICULTURE = "Agriculture"
    HOSPITALITY = "Hospitality"
    CONSTRUCTION = "Construction"
    TELECOMMUNICATIONS = "Telecommunications"
    BIOTECHNOLOGY = "Biotechnology"
    AEROSPACE = "Aerospace"
    AUTOMOTIVE = "Automotive"
    ECOMMERCE = "Ecommerce"
    GAMING = "Gaming"
    CYBERSECURITY = "Cybersecurity"
    FINTECH = "Fintech"
    HEALTH_TECH = "Health Tech"
    ED_TECH = "Ed Tech"
    OTHER = "Other"


class FundingStage(str, enum.Enum):
    IDEA = "Idea"
    MVP = "MVP"
    EARLY_STAGE = "Early Stage"
    PRE_SEED = "Pre-Seed"
    SEED = "Seed"
    SERIES_A = "Series A"
    SERIES_B = "Series B"
    SERIES_C = "Series C"
    IPO = "IPO"
    MERGER_ACQUISITION = "Merger & Acquisition"
    OTHER = "Other"


class TeamMember(SQLModel):
    name: str
    role: str
    bio: Optional[str] = None


class Funding(SQLModel):
    total: Optional[float] = None
    last_round: Optional[str] = None
    investors: Optional[str] = None


class Metrics(SQLModel):
    revenue: Optional[str] = None
    growth: Optional[str] = None
    customers: Optional[int] = None


class SocialMedia(SQLModel):
    twitter: Optional[str] = None
    linkedin: Optional[str] = None
    facebook: Optional[str] = None
    instagram: Optional[str] = None


class Contact(SQLModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class Traction(SQLModel):
    users: Optional[int] = None
    revenue: Optional[float] = None
    growth: Optional[float] = None
    partnerships: Optional[str] = None


class UseOfFunds(SQLModel):
    product: Optional[float] = None
    marketing: Optional[float] = None
    operations: Optional[float] = None
    team: Optional[float] = None
    other: Optional[float] = None


class TimelineEvent(SQLModel):
    date: str
    title: str
    description: Optional[str] = None


class Timeline(SQLModel):
    past: List[TimelineEvent] = []
    future: List[TimelineEvent] = []


class StartupBase(SQLModel):
    name: str = Field(index=True)
    description: str
    industry: Industry
    location: str
    funding_stage: FundingStage
    funding_goal: Optional[float] = None
    founded_year: Optional[str] = None
    team_size: Optional[int] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    pitch_deck_url: Optional[str] = None
    demo_video_url: Optional[str] = None
    business_model: Optional[str] = None
    target_market: Optional[str] = None
    competitors: Optional[str] = None


# Association table for many-to-many relationship between startups and investors
startup_investor_association = Table(
    "startup_investor_association",
    SQLModel.metadata,
    Column("startup_id", ForeignKey("startup.id"), primary_key=True),
    Column("investor_profile_id", ForeignKey("investorprofile.id"), primary_key=True),
)


class Startup(StartupBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    founder_id: uuid.UUID = Field(foreign_key="user.id")
    is_published: bool = Field(default=False, index=True)

    # JSON fields stored with SQLAlchemy JSON type
    team_members: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    funding: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    metrics: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    social_media: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    contact: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    traction: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    use_of_funds: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    timeline: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    investors: List["InvestorProfile"] = Relationship(
        back_populates="startups", link_model=startup_investor_association
    )

    # Relationships
    founder: "User" = Relationship(back_populates="startups")  # type: ignore  # noqa: F821


class StartupCreate(StartupBase):
    is_published: bool = Field(default=False)
    team_members: Optional[Union[List[Dict[str, Any]], Dict[str, Any]]] = None
    funding: Optional[Union[str, Dict[str, Any]]] = None
    metrics: Optional[Union[str, Dict[str, Any]]] = None
    social_media: Optional[Union[str, Dict[str, Any]]] = None
    contact: Optional[Union[str, Dict[str, Any]]] = None
    traction: Optional[Union[str, Dict[str, Any]]] = None
    use_of_funds: Optional[Union[str, Dict[str, Any]]] = None
    timeline: Optional[Union[str, Dict[str, Any]]] = None

    # Validators handle type conversion from flexible input types (int->str, List[str]->JSON string)
    @field_validator("founded_year")
    @classmethod
    def validate_founded_year(cls, v):
        if v is not None:
            return str(v)
        return v

    @field_validator("competitors")
    @classmethod
    def validate_competitors(cls, v):
        if v is not None:
            if isinstance(v, list):
                # Convert list to JSON string for storage
                return json.dumps(v)
            return v
        return v

    @field_validator("team_members")
    @classmethod
    def validate_team_members(cls, v):
        if v is not None:
            if isinstance(v, list):
                # Convert list to dict format for storage
                return {"members": v}
            return v
        return v

    @field_validator(
        "funding",
        "metrics",
        "social_media",
        "contact",
        "traction",
        "use_of_funds",
        "timeline",
    )
    @classmethod
    def validate_json_fields(cls, v):
        if v is not None:
            if isinstance(v, str):
                # If it's a JSON string, try to parse it
                try:
                    return json.loads(v)
                except json.JSONDecodeError:
                    # If parsing fails, store as-is in a wrapper dict
                    return {"value": v}
            return v
        return v


class StartupRead(StartupBase):
    id: uuid.UUID
    founder_id: uuid.UUID
    is_published: bool
    team_members: Optional[Dict[str, Any]] = None
    funding: Optional[Dict[str, Any]] = None
    metrics: Optional[Dict[str, Any]] = None
    social_media: Optional[Dict[str, Any]] = None
    contact: Optional[Dict[str, Any]] = None
    traction: Optional[Dict[str, Any]] = None
    use_of_funds: Optional[Dict[str, Any]] = None
    timeline: Optional[Dict[str, Any]] = None


class StartupUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[Industry] = None
    location: Optional[str] = None
    funding_goal: Optional[float] = None
    funding_stage: Optional[FundingStage] = None
    founded_year: Optional[str] = None
    team_size: Optional[int] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    pitch_deck_url: Optional[str] = None
    demo_video_url: Optional[str] = None
    business_model: Optional[str] = None
    target_market: Optional[str] = None
    competitors: Optional[str] = None
    is_published: Optional[bool] = None
    team_members: Optional[Union[List[Dict[str, Any]], Dict[str, Any]]] = None
    funding: Optional[Union[str, Dict[str, Any]]] = None
    metrics: Optional[Union[str, Dict[str, Any]]] = None
    social_media: Optional[Union[str, Dict[str, Any]]] = None
    contact: Optional[Union[str, Dict[str, Any]]] = None
    traction: Optional[Union[str, Dict[str, Any]]] = None
    use_of_funds: Optional[Union[str, Dict[str, Any]]] = None
    timeline: Optional[Union[str, Dict[str, Any]]] = None

    @field_validator("founded_year")
    @classmethod
    def validate_founded_year(cls, v):
        if v is not None:
            return str(v)
        return v

    @field_validator("competitors")
    @classmethod
    def validate_competitors(cls, v):
        if v is not None:
            if isinstance(v, list):
                return json.dumps(v)
            return v
        return v

    @field_validator("team_members")
    @classmethod
    def validate_team_members(cls, v):
        if v is not None:
            if isinstance(v, list):
                return {"members": v}
            return v
        return v

    @field_validator(
        "funding",
        "metrics",
        "social_media",
        "contact",
        "traction",
        "use_of_funds",
        "timeline",
    )
    @classmethod
    def validate_json_fields(cls, v):
        if v is not None:
            if isinstance(v, str):
                try:
                    return json.loads(v)
                except json.JSONDecodeError:
                    return {"value": v}
            return v
        return v
