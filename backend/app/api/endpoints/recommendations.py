"""
Recommendation API endpoints for startup-investor matching.
"""

from fastapi import APIRouter, HTTPException, Query, status

from app.api.deps import CurrentUser, SessionDep
from app.models.recommendation import RecommendationResponse
from app.models.user import UserRole
from app.services.recommendation_engine import recommendation_engine

router = APIRouter(prefix="/me", tags=["Recommendations"])


@router.get("/recommendations", response_model=RecommendationResponse)
async def get_my_recommendations(
    session: SessionDep,
    current_user: CurrentUser,
    max_results: int = Query(
        10, ge=1, le=50, description="Maximum number of recommendations"
    ),
    min_score: float = Query(
        30.0, ge=0.0, le=100.0, description="Minimum recommendation score"
    ),
):
    """
    Get personalized investor recommendations for the current founder.

    This endpoint analyzes the founder's startup profile and returns a ranked list
    of investors who are most likely to be interested in their startup, along with
    detailed explanations for each recommendation.

    Features:
    - Industry-based matching with scoring algorithm
    - Funding stage alignment analysis
    - Location proximity consideration
    - Detailed explanations for each recommendation
    - Configurable result limits and score thresholds
    """
    # Verify user is a founder (only founders can get investor recommendations)
    if current_user.role != UserRole.FOUNDER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only founders can access investor recommendations",
        )

    # Generate recommendations using the recommendation engine
    try:
        recommendations = recommendation_engine.get_recommendations_for_founder(
            db=session,
            founder_id=current_user.id,
            max_results=max_results,
            min_score=min_score,
        )

        return recommendations

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate recommendations: {str(e)}",
        )


@router.get("/recommendations/explain", response_model=dict)
async def explain_recommendation_algorithm(
    current_user: CurrentUser,
):
    """
    Explain how the recommendation algorithm works.

    Returns information about the scoring weights, criteria, and methodology
    used to generate investor recommendations.
    """
    return {
        "algorithm_version": recommendation_engine.algorithm_version,
        "scoring_weights": recommendation_engine.weights,
        "criteria": {
            "industry_match": {
                "weight": recommendation_engine.weights["industry_match"],
                "description": "How well the investor's industry focus aligns with your startup's industry",
                "scoring": {
                    "perfect_match": "100% - Investor explicitly focuses on your industry",
                    "related_match": "70% - Investor focuses on related industries",
                    "no_match": "0% - No industry alignment",
                },
            },
            "stage_match": {
                "weight": recommendation_engine.weights["stage_match"],
                "description": "How well the investor's preferred funding stages match your current stage",
                "scoring": {
                    "perfect_match": "100% - Investor explicitly invests in your stage",
                    "adjacent_match": "60% - Investor invests in nearby stages",
                    "no_preference": "50% - Investor hasn't specified stage preferences",
                    "no_match": "0% - No stage alignment",
                },
            },
            "location_proximity": {
                "weight": recommendation_engine.weights["location_proximity"],
                "description": "Geographic proximity between investor and startup",
                "scoring": {
                    "same_location": "100% - Same city/region",
                    "compatible_region": "70% - Compatible geographic region",
                    "different_region": "20% - Different regions (small penalty)",
                },
            },
            "funding_amount": {
                "weight": recommendation_engine.weights["funding_amount"],
                "description": "How well your funding goal fits typical investment ranges",
                "scoring": {
                    "typical_range": "100% - Funding goal fits typical range for your stage",
                    "outside_range": "60% - Funding goal outside typical ranges",
                },
            },
            "profile_completeness": {
                "weight": recommendation_engine.weights["profile_completeness"],
                "description": "Bonus points for having a complete startup profile",
                "scoring": {
                    "calculation": "80% weight for required fields + 20% weight for optional fields"
                },
            },
        },
        "tips_for_better_recommendations": [
            "Complete all sections of your startup profile",
            "Specify your funding goal and current stage accurately",
            "Provide detailed industry and business model information",
            "Include your location for better geographic matching",
            "Keep your profile updated as your startup evolves",
        ],
    }
