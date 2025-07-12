import enum
import uuid
from typing import Any, Dict, List, Optional

from sqlalchemy import JSON, Column
from sqlmodel import Field, Relationship, SQLModel


class Industry(str, enum.Enum):
    TECHNOLOGY = "technology"
    HEALTHCARE = "healthcare"
    FINANCE = "finance"
    EDUCATION = "education"
    RETAIL = "retail"
    MANUFACTURING = "manufacturing"
    REAL_ESTATE = "real_estate"
    ENERGY = "energy"
    TRANSPORTATION = "transportation"
    MEDIA = "media"
    ENTERTAINMENT = "entertainment"
    FOOD_BEVERAGE = "food_beverage"
    AGRICULTURE = "agriculture"
    HOSPITALITY = "hospitality"
    CONSTRUCTION = "construction"
    TELECOMMUNICATIONS = "telecommunications"
    BIOTECHNOLOGY = "biotechnology"
    AEROSPACE = "aerospace"
    AUTOMOTIVE = "automotive"
    ECOMMERCE = "ecommerce"
    GAMING = "gaming"
    CYBERSECURITY = "cybersecurity"
    FINTECH = "fintech"
    HEALTH_TECH = "health_tech"
    ED_TECH = "ed_tech"
    OTHER = "other"


class FundingStage(str, enum.Enum):
    IDEA = "idea"
    MVP = "mvp"
    EARLY_STAGE = "early_stage"
    PRE_SEED = "pre_seed"
    SEED = "seed"
    SERIES_A = "series_a"
    SERIES_B = "series_b"
    SERIES_C = "series_c"
    IPO = "ipo"
    MERGER_ACQUISITION = "merger_acquisition"
    OTHER = "other"


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

    # Relationships
    founder: "User" = Relationship(back_populates="startups")  # type: ignore  # noqa: F821


class StartupCreate(StartupBase):
    is_published: bool = Field(default=False)
    team_members: Optional[Dict[str, Any]] = None
    funding: Optional[Dict[str, Any]] = None
    metrics: Optional[Dict[str, Any]] = None
    social_media: Optional[Dict[str, Any]] = None
    contact: Optional[Dict[str, Any]] = None
    traction: Optional[Dict[str, Any]] = None
    use_of_funds: Optional[Dict[str, Any]] = None
    timeline: Optional[Dict[str, Any]] = None


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
    team_members: Optional[Dict[str, Any]] = None
    funding: Optional[Dict[str, Any]] = None
    metrics: Optional[Dict[str, Any]] = None
    social_media: Optional[Dict[str, Any]] = None
    contact: Optional[Dict[str, Any]] = None
    traction: Optional[Dict[str, Any]] = None
    use_of_funds: Optional[Dict[str, Any]] = None
    timeline: Optional[Dict[str, Any]] = None
