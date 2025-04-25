import enum

from models.user import Base
from sqlalchemy import Column, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship


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


class Startup(Base):
    __tablename__ = "startups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=False)
    industry = Column(Enum(Industry), nullable=False)
    location = Column(String, nullable=False)
    funding_goal = Column(Float, nullable=False)
    funding_stage = Column(Enum(FundingStage), nullable=False)
    website = Column(String)
    pitch_deck_url = Column(String)

    # Foreign Keys
    founder_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    founder = relationship("User", back_populates="startups")
