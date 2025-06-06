import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import SQLModel

from app.api.deps import SessionDep, get_current_user
from app.crud.investor import (
    get_filtered_investor_profiles_with_users,
    get_investor_profile_by_id,
    get_investors_by_funding_stage,
    get_investors_by_industry_focus,
    search_investors_by_name_or_firm,
)
from app.models.investor import InvestorProfileRead, InvestorWithUserRead
from app.models.startup import FundingStage, Industry

router = APIRouter(prefix="/investors", tags=["Investors"])


class InvestorListResponse(SQLModel):
    """Response model for paginated investor listings."""

    investors: List[InvestorWithUserRead]
    total: int
    page: int
    limit: int
    total_pages: int


@router.get("/", response_model=InvestorListResponse)
async def list_investors(
    session: SessionDep,
    skip: int = Query(0, ge=0, description="Number of investors to skip"),
    limit: int = Query(
        100, ge=1, le=500, description="Maximum number of investors to return"
    ),
    search: Optional[str] = Query(
        None, description="Search by investor name or firm name"
    ),
    industries: Optional[List[Industry]] = Query(
        None, description="Filter by investment focus industries"
    ),
    funding_stages: Optional[List[FundingStage]] = Query(
        None, description="Filter by preferred funding stages"
    ),
    location: Optional[str] = Query(None, description="Filter by investor location"),
    current_user: uuid.UUID = Depends(get_current_user),
):
    """
    List all investor profiles with filtering, search, and pagination.

    Features:
    - Pagination with skip/limit
    - Search by investor name or firm name
    - Filter by investment focus industries
    - Filter by preferred funding stages
    - Filter by location
    """
    # Use the enhanced filtering function
    investor_user_pairs, total_count = get_filtered_investor_profiles_with_users(
        db=session,
        skip=skip,
        limit=limit,
        search=search,
        industries=industries,
        funding_stages=funding_stages,
        location=location,
    )

    # Convert to response format
    investors_with_users = []
    for investor_profile, user in investor_user_pairs:
        investor_data = InvestorWithUserRead(
            id=investor_profile.id,
            user_id=investor_profile.user_id,
            name=user.full_name,
            email=user.email,
            company=investor_profile.firm_name,  # Map firm_name to company
            firm_name=investor_profile.firm_name,
            bio=investor_profile.bio,
            website=investor_profile.website,
            location=investor_profile.location,
            linkedin_url=investor_profile.linkedin_url,
            twitter_url=investor_profile.twitter_url,
            investment_focus=investor_profile.investment_focus,
            preferred_stages=investor_profile.preferred_stages,
            profile_picture=None,  # TODO: Add profile picture handling
            min_investment=None,  # TODO: Add investment range fields to model
            max_investment=None,  # TODO: Add investment range fields to model
        )
        investors_with_users.append(investor_data)

    # Calculate pagination info
    total_pages = (total_count + limit - 1) // limit
    current_page = (skip // limit) + 1

    return InvestorListResponse(
        investors=investors_with_users,
        total=total_count,
        page=current_page,
        limit=limit,
        total_pages=total_pages,
    )


@router.get("/search", response_model=List[InvestorWithUserRead])
async def search_investors(
    session: SessionDep,
    q: str = Query(
        ..., min_length=1, description="Search query for investor name or firm"
    ),
    skip: int = Query(0, ge=0, description="Number of results to skip"),
    limit: int = Query(
        50, ge=1, le=100, description="Maximum number of results to return"
    ),
    current_user: uuid.UUID = Depends(get_current_user),
):
    """
    Search investors by name or firm name.
    """
    investor_user_pairs = search_investors_by_name_or_firm(
        db=session, search_term=q, skip=skip, limit=limit
    )

    investors_with_users = []
    for investor_profile, user in investor_user_pairs:
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
        investors_with_users.append(investor_data)

    return investors_with_users


@router.get("/by-industry/{industry}", response_model=List[InvestorWithUserRead])
async def get_investors_by_industry(
    industry: Industry,
    session: SessionDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: uuid.UUID = Depends(get_current_user),
):
    """
    Get investors who focus on a specific industry.
    """
    investor_user_pairs = get_investors_by_industry_focus(
        db=session, industry=industry, skip=skip, limit=limit
    )

    investors_with_users = []
    for investor_profile, user in investor_user_pairs:
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
        investors_with_users.append(investor_data)

    return investors_with_users


@router.get("/by-stage/{funding_stage}", response_model=List[InvestorWithUserRead])
async def get_investors_by_stage(
    funding_stage: FundingStage,
    session: SessionDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: uuid.UUID = Depends(get_current_user),
):
    """
    Get investors who prefer a specific funding stage.
    """
    investor_user_pairs = get_investors_by_funding_stage(
        db=session, funding_stage=funding_stage, skip=skip, limit=limit
    )

    investors_with_users = []
    for investor_profile, user in investor_user_pairs:
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
        investors_with_users.append(investor_data)

    return investors_with_users


@router.get("/{investor_id}", response_model=InvestorProfileRead)
async def get_investor_details(
    investor_id: uuid.UUID,
    session: SessionDep,
    current_user: uuid.UUID = Depends(get_current_user),
):
    """
    Get detailed information for a specific investor.
    """
    investor = get_investor_profile_by_id(db=session, profile_id=investor_id)
    if not investor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Investor not found",
        )
    return investor
