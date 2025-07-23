"""
Recommendation models for the investor-startup matching system.
"""

import uuid
from typing import List, Optional

from sqlmodel import SQLModel

from app.models.investor import InvestorWithUserRead
from app.models.startup import FundingStage, Industry


class RecommendationReason(SQLModel):
    """Explanation for why an investor was recommended."""

    type: str  # e.g., "industry_match", "stage_match", "location_match"
    description: str
    weight: float  # Impact on overall score (0.0 to 1.0)


class InvestorRecommendation(SQLModel):
    """A single investor recommendation with scoring and explanation."""

    investor: InvestorWithUserRead
    score: float  # Overall recommendation score (0.0 to 100.0)
    confidence: str  # "high", "medium", "low"
    reasons: List[RecommendationReason]
    match_percentage: int  # Percentage match (0-100)


class RecommendationRequest(SQLModel):
    """Optional filters for customizing recommendations."""

    max_results: Optional[int] = 10
    min_score: Optional[float] = 30.0
    preferred_locations: Optional[List[str]] = None
    funding_urgency: Optional[str] = None  # "immediate", "soon", "exploring"


class RecommendationResponse(SQLModel):
    """Full recommendation response with metadata."""

    recommendations: List[InvestorRecommendation]
    total_investors_analyzed: int
    startup_profile_completeness: float  # 0.0 to 1.0
    generated_at: str  # ISO timestamp
    algorithm_version: str = "1.0"


class StartupProfile(SQLModel):
    """Simplified startup profile for recommendation algorithm."""

    id: uuid.UUID
    founder_id: uuid.UUID
    name: str
    industry: Industry
    funding_stage: FundingStage
    location: str
    funding_goal: Optional[float] = None
    description: str
    business_model: Optional[str] = None
    target_market: Optional[str] = None
