import enum
from typing import Optional

from models.user import User
from sqlmodel import Field, Relationship, SQLModel


class Industry(str, enum.Enum):
    TECHNOLOGY = "technology"
    HEALTHCARE = "healthcare"
    FINANCE = "finance"
    EDUCATION = "education"
    RETAIL = "retail"
    MANUFACTURING = "manufacturing"
    OTHER = "other"


class FundingStage(str, enum.Enum):
    IDEA = "idea"
    MVP = "mvp"
    EARLY_STAGE = "early_stage"
    GROWTH = "growth"
    SCALE = "scale"


class StartupBase(SQLModel):
    name: str = Field(index=True)
    description: str
    industry: Industry
    location: str
    funding_goal: float
    funding_stage: FundingStage
    website: Optional[str] = None
    pitch_deck_url: Optional[str] = None


class Startup(StartupBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    founder_id: int = Field(foreign_key="user.id")

    # Relationships
    founder: User = Relationship(back_populates="startups")


class StartupCreate(StartupBase):
    pass


class StartupRead(StartupBase):
    id: int
    founder_id: int


class StartupUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[Industry] = None
    location: Optional[str] = None
    funding_goal: Optional[float] = None
    funding_stage: Optional[FundingStage] = None
    website: Optional[str] = None
    pitch_deck_url: Optional[str] = None
