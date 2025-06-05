"""
Investor recommendation engine for startup-investor matching.

This module implements the core recommendation algorithm that matches startups
with investors based on various factors including industry alignment, funding
stage preferences, location proximity, and other business criteria.
"""

import uuid
from datetime import datetime
from typing import List, Optional, Tuple

from app.crud.investor import get_all_investor_profiles_with_users
from app.crud.startup import get_startup_by_founder
from app.models.investor import InvestorProfile
from app.models.recommendation import (
    InvestorRecommendation,
    RecommendationReason,
    RecommendationResponse,
    StartupProfile,
)
from app.models.startup import FundingStage, Industry
from app.models.user import User
from sqlmodel import Session


class RecommendationEngine:
    """Core recommendation engine for matching startups with investors."""

    def __init__(self):
        self.algorithm_version = "1.0"

        # Scoring weights (should sum to 1.0)
        self.weights = {
            "industry_match": 0.4,  # 40% - Most important
            "stage_match": 0.3,  # 30% - Very important
            "location_proximity": 0.15,  # 15% - Moderately important
            "funding_amount": 0.10,  # 10% - Less important
            "profile_completeness": 0.05,  # 5% - Bonus factor
        }

    def get_recommendations_for_founder(
        self,
        db: Session,
        founder_id: uuid.UUID,
        max_results: int = 10,
        min_score: float = 30.0,
    ) -> RecommendationResponse:
        """
        Generate investor recommendations for a specific founder.

        Args:
            db: Database session
            founder_id: UUID of the founder requesting recommendations
            max_results: Maximum number of recommendations to return
            min_score: Minimum score threshold for recommendations

        Returns:
            RecommendationResponse with scored and explained recommendations
        """
        # Get the founder's startup profile
        startup = get_startup_by_founder(db, founder_id)
        if not startup:
            return RecommendationResponse(
                recommendations=[],
                total_investors_analyzed=0,
                startup_profile_completeness=0.0,
                generated_at=datetime.utcnow().isoformat(),
                algorithm_version=self.algorithm_version,
            )

        # Convert to simplified profile for algorithm
        startup_profile = StartupProfile(
            id=startup.id,
            founder_id=startup.founder_id,
            name=startup.name,
            industry=startup.industry,
            funding_stage=startup.funding_stage,
            location=startup.location,
            funding_goal=startup.funding_goal,
            description=startup.description,
            business_model=startup.business_model,
            target_market=startup.target_market,
        )

        # Get all investors
        investor_pairs = get_all_investor_profiles_with_users(db, skip=0, limit=1000)

        # Score each investor
        scored_recommendations = []
        for investor_profile, user in investor_pairs:
            score, reasons = self._calculate_investor_score(
                startup_profile, investor_profile
            )

            if score >= min_score:
                recommendation = self._create_recommendation(
                    investor_profile, user, score, reasons
                )
                scored_recommendations.append(recommendation)

        # Sort by score (descending) and limit results
        scored_recommendations.sort(key=lambda x: x.score, reverse=True)
        top_recommendations = scored_recommendations[:max_results]

        # Calculate startup profile completeness
        profile_completeness = self._calculate_profile_completeness(startup_profile)

        return RecommendationResponse(
            recommendations=top_recommendations,
            total_investors_analyzed=len(investor_pairs),
            startup_profile_completeness=profile_completeness,
            generated_at=datetime.utcnow().isoformat(),
            algorithm_version=self.algorithm_version,
        )

    def _calculate_investor_score(
        self, startup: StartupProfile, investor: InvestorProfile
    ) -> Tuple[float, List[RecommendationReason]]:
        """
        Calculate the recommendation score for a startup-investor pair.

        Returns:
            Tuple of (score, list of reasons)
        """
        reasons = []
        total_score = 0.0

        # 1. Industry Match (40% weight)
        industry_score, industry_reason = self._score_industry_match(startup, investor)
        total_score += industry_score * self.weights["industry_match"]
        if industry_reason:
            reasons.append(industry_reason)

        # 2. Funding Stage Match (30% weight)
        stage_score, stage_reason = self._score_stage_match(startup, investor)
        total_score += stage_score * self.weights["stage_match"]
        if stage_reason:
            reasons.append(stage_reason)

        # 3. Location Proximity (15% weight)
        location_score, location_reason = self._score_location_match(startup, investor)
        total_score += location_score * self.weights["location_proximity"]
        if location_reason:
            reasons.append(location_reason)

        # 4. Funding Amount Compatibility (10% weight)
        funding_score, funding_reason = self._score_funding_compatibility(
            startup, investor
        )
        total_score += funding_score * self.weights["funding_amount"]
        if funding_reason:
            reasons.append(funding_reason)

        # 5. Profile Completeness Bonus (5% weight)
        completeness_score = self._calculate_profile_completeness(startup)
        total_score += completeness_score * self.weights["profile_completeness"]

        # Convert to 0-100 scale
        final_score = total_score * 100

        return final_score, reasons

    def _score_industry_match(
        self, startup: StartupProfile, investor: InvestorProfile
    ) -> Tuple[float, Optional[RecommendationReason]]:
        """Score based on industry alignment."""
        if not investor.investment_focus:
            return 0.0, None

        if startup.industry in investor.investment_focus:
            return 1.0, RecommendationReason(
                type="industry_match",
                description=f"Perfect industry match: {startup.industry.value}",
                weight=self.weights["industry_match"],
            )

        # Check for related industries (simplified logic)
        related_matches = self._find_related_industries(
            startup.industry, investor.investment_focus
        )
        if related_matches:
            return 0.7, RecommendationReason(
                type="industry_match",
                description=f"Related industry match: {', '.join(related_matches)}",
                weight=self.weights["industry_match"] * 0.7,
            )

        return 0.0, None

    def _score_stage_match(
        self, startup: StartupProfile, investor: InvestorProfile
    ) -> Tuple[float, Optional[RecommendationReason]]:
        """Score based on funding stage alignment."""
        if not investor.preferred_stages:
            return 0.5, RecommendationReason(
                type="stage_match",
                description="Investor hasn't specified stage preferences",
                weight=self.weights["stage_match"] * 0.5,
            )

        if startup.funding_stage in investor.preferred_stages:
            return 1.0, RecommendationReason(
                type="stage_match",
                description=f"Perfect stage match: {startup.funding_stage.value}",
                weight=self.weights["stage_match"],
            )

        # Check for adjacent stages
        adjacent_score = self._check_adjacent_stages(
            startup.funding_stage, investor.preferred_stages
        )
        if adjacent_score > 0:
            return adjacent_score, RecommendationReason(
                type="stage_match",
                description="Compatible with nearby funding stages",
                weight=self.weights["stage_match"] * adjacent_score,
            )

        return 0.0, None

    def _score_location_match(
        self, startup: StartupProfile, investor: InvestorProfile
    ) -> Tuple[float, Optional[RecommendationReason]]:
        """Score based on location proximity."""
        if not investor.location or not startup.location:
            return 0.3, None  # Neutral score if location info missing

        startup_location = startup.location.lower()
        investor_location = investor.location.lower()

        # Exact match
        if startup_location == investor_location:
            return 1.0, RecommendationReason(
                type="location_match",
                description=f"Same location: {startup.location}",
                weight=self.weights["location_proximity"],
            )

        # City/state matching (simplified)
        if self._locations_compatible(startup_location, investor_location):
            return 0.7, RecommendationReason(
                type="location_match",
                description="Compatible geographic region",
                weight=self.weights["location_proximity"] * 0.7,
            )

        return 0.2, None  # Small penalty for distant locations

    def _score_funding_compatibility(
        self, startup: StartupProfile, investor: InvestorProfile
    ) -> Tuple[float, Optional[RecommendationReason]]:
        """Score based on funding amount compatibility."""
        if not startup.funding_goal:
            return 0.5, None  # Neutral if no funding goal specified

        # This is a simplified implementation
        # In reality, you'd need investment range data from investors
        funding_goal = startup.funding_goal

        # Heuristic scoring based on typical investment ranges per stage
        stage_ranges = {
            FundingStage.PRE_SEED: (50_000, 500_000),
            FundingStage.SEED: (250_000, 2_000_000),
            FundingStage.SERIES_A: (1_000_000, 15_000_000),
            FundingStage.SERIES_B: (5_000_000, 50_000_000),
        }

        if startup.funding_stage in stage_ranges:
            min_range, max_range = stage_ranges[startup.funding_stage]
            if min_range <= funding_goal <= max_range:
                return 1.0, RecommendationReason(
                    type="funding_amount",
                    description=f"Funding goal (${funding_goal:,.0f}) fits typical range",
                    weight=self.weights["funding_amount"],
                )

        return 0.6, None  # Neutral score if outside typical ranges

    def _calculate_profile_completeness(self, startup: StartupProfile) -> float:
        """Calculate how complete the startup profile is."""
        required_fields = [
            startup.name,
            startup.description,
            startup.industry,
            startup.funding_stage,
            startup.location,
        ]

        optional_fields = [
            startup.funding_goal,
            startup.business_model,
            startup.target_market,
        ]

        required_score = sum(1 for field in required_fields if field) / len(
            required_fields
        )
        optional_score = sum(1 for field in optional_fields if field) / len(
            optional_fields
        )

        # Weight required fields more heavily
        return (required_score * 0.8) + (optional_score * 0.2)

    def _find_related_industries(
        self, startup_industry: Industry, investor_industries: List[Industry]
    ) -> List[str]:
        """Find related industries for partial matching."""
        # Simplified related industry mapping
        related_map = {
            Industry.TECHNOLOGY: [
                Industry.FINTECH,
                Industry.HEALTH_TECH,
                Industry.ED_TECH,
            ],
            Industry.FINTECH: [Industry.TECHNOLOGY, Industry.FINANCE],
            Industry.HEALTH_TECH: [
                Industry.TECHNOLOGY,
                Industry.HEALTHCARE,
                Industry.BIOTECHNOLOGY,
            ],
            Industry.BIOTECHNOLOGY: [Industry.HEALTHCARE, Industry.HEALTH_TECH],
        }

        related = related_map.get(startup_industry, [])
        return [ind.value for ind in investor_industries if ind in related]

    def _check_adjacent_stages(
        self, startup_stage: FundingStage, investor_stages: List[FundingStage]
    ) -> float:
        """Check if investor is interested in stages adjacent to startup's stage."""
        # Define stage adjacency
        stage_order = [
            FundingStage.IDEA,
            FundingStage.MVP,
            FundingStage.PRE_SEED,
            FundingStage.SEED,
            FundingStage.SERIES_A,
            FundingStage.SERIES_B,
            FundingStage.SERIES_C,
        ]

        try:
            startup_idx = stage_order.index(startup_stage)
            for inv_stage in investor_stages:
                if inv_stage in stage_order:
                    inv_idx = stage_order.index(inv_stage)
                    if abs(startup_idx - inv_idx) == 1:  # Adjacent stage
                        return 0.6
        except ValueError:
            pass

        return 0.0

    def _locations_compatible(self, loc1: str, loc2: str) -> bool:
        """Check if two locations are in compatible regions."""
        # Simplified location matching
        # In production, you'd use proper geocoding and distance calculation

        # Extract common city/state patterns
        for location in [loc1, loc2]:
            if any(term in location for term in ["san francisco", "sf", "bay area"]):
                if any(
                    term in (loc1 + loc2)
                    for term in ["san francisco", "sf", "bay area", "california", "ca"]
                ):
                    return True
            if any(term in location for term in ["new york", "ny", "nyc"]):
                if any(term in (loc1 + loc2) for term in ["new york", "ny", "nyc"]):
                    return True

        return False

    def _create_recommendation(
        self,
        investor_profile: InvestorProfile,
        user: User,
        score: float,
        reasons: List[RecommendationReason],
    ) -> InvestorRecommendation:
        """Create a recommendation object from scoring results."""
        from app.models.investor import InvestorWithUserRead

        # Create investor object for response
        investor_data = InvestorWithUserRead(
            id=investor_profile.id,
            user_id=investor_profile.user_id,
            name=user.full_name,
            email=user.email,
            company=investor_profile.firm_name,
            firm_name=investor_profile.firm_name,
            bio=investor_profile.bio,
            website=investor_profile.website,
            location=investor_profile.location,
            linkedin_url=investor_profile.linkedin_url,
            twitter_url=investor_profile.twitter_url,
            investment_focus=investor_profile.investment_focus,
            preferred_stages=investor_profile.preferred_stages,
            profile_picture=None,
            min_investment=None,
            max_investment=None,
        )

        # Determine confidence level
        if score >= 80:
            confidence = "high"
        elif score >= 60:
            confidence = "medium"
        else:
            confidence = "low"

        return InvestorRecommendation(
            investor=investor_data,
            score=round(score, 2),
            confidence=confidence,
            reasons=reasons,
            match_percentage=int(score),
        )


# Global instance
recommendation_engine = RecommendationEngine()
