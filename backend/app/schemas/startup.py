from typing import Optional

from models.startup import FundingStage, Industry
from pydantic import BaseModel, HttpUrl
from schemas.user import User


class StartupBase(BaseModel):
    name: str
    description: str
    industry: Industry
    location: str
    funding_goal: float
    funding_stage: FundingStage
    website: Optional[HttpUrl] = None
    pitch_deck_url: Optional[HttpUrl] = None


class StartupCreate(StartupBase):
    pass


class StartupUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[Industry] = None
    location: Optional[str] = None
    funding_goal: Optional[float] = None
    funding_stage: Optional[FundingStage] = None
    website: Optional[HttpUrl] = None
    pitch_deck_url: Optional[HttpUrl] = None


class StartupInDB(StartupBase):
    id: int
    founder_id: int

    class Config:
        from_attributes = True


class Startup(StartupInDB):
    founder: User
