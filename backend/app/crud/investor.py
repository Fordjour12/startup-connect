import uuid
from typing import List, Optional

from sqlmodel import Session, and_, col, or_, select

from app.models.investor import InvestorProfile, InvestorProfileCreate
from app.models.startup import FundingStage, Industry
from app.models.user import User


def create_investor_profile(
    db: Session, investor_profile_in: InvestorProfileCreate, user_id: uuid.UUID
) -> InvestorProfile:
    """
    Create a new InvestorProfile record in the database.
    """
    investor_profile = InvestorProfile.model_validate(
        investor_profile_in, update={"user_id": user_id}
    )
    db.add(investor_profile)
    db.commit()
    db.refresh(investor_profile)
    return investor_profile


def get_all_investor_profiles(
    db: Session, skip: int = 0, limit: int = 100
) -> List[InvestorProfile]:
    """
    Retrieve all investor profiles from the database.
    """
    statement = select(InvestorProfile).offset(skip).limit(limit)
    investors = db.exec(statement).all()
    return list(investors)


def get_investor_profile_by_id(
    db: Session, profile_id: uuid.UUID
) -> InvestorProfile | None:
    """
    Retrieve a single investor profile by its ID.
    """
    return db.get(InvestorProfile, profile_id)


def update_investor_profile(
    db: Session, profile_id: uuid.UUID, investor_update: dict
) -> InvestorProfile | None:
    """
    Update an existing investor profile.
    """
    investor_profile = db.get(InvestorProfile, profile_id)
    if not investor_profile:
        return None

    for field, value in investor_update.items():
        if hasattr(investor_profile, field):
            setattr(investor_profile, field, value)

    db.add(investor_profile)
    db.commit()
    db.refresh(investor_profile)
    return investor_profile


def delete_investor_profile(db: Session, profile_id: uuid.UUID) -> bool:
    """
    Delete an investor profile by ID.
    """
    investor_profile = db.get(InvestorProfile, profile_id)
    if not investor_profile:
        return False

    db.delete(investor_profile)
    db.commit()
    return True


def get_all_investor_profiles_with_users(
    db: Session, skip: int = 0, limit: int = 100
) -> List[tuple[InvestorProfile, User]]:
    """
    Retrieve all investor profiles with user data from the database.
    """
    statement = (
        select(InvestorProfile, User)
        .join(User)
        .where(InvestorProfile.user_id == User.id)
        .offset(skip)
        .limit(limit)
    )
    results = db.exec(statement).all()
    return list(results)


def get_filtered_investor_profiles_with_users(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    industries: Optional[List[Industry]] = None,
    funding_stages: Optional[List[FundingStage]] = None,
    location: Optional[str] = None,
) -> tuple[List[tuple[InvestorProfile, User]], int]:
    """
    Retrieve investor profiles with advanced filtering and search capabilities.
    Returns both the filtered results and total count for pagination.
    """
    # Build the base query
    base_query = (
        select(InvestorProfile, User)
        .join(User)
        .where(InvestorProfile.user_id == User.id)
    )

    # Build count query for total results
    count_query = (
        select(InvestorProfile).join(User).where(InvestorProfile.user_id == User.id)
    )

    # Apply filters
    filters = []

    # Search by investor name or firm name
    if search:
        search_lower = search.lower()
        search_filter = or_(
            col(User.full_name).ilike(f"%{search_lower}%"),
            col(InvestorProfile.firm_name).ilike(f"%{search_lower}%"),
        )
        filters.append(search_filter)

    # Filter by location
    if location:
        location_filter = col(InvestorProfile.location).ilike(f"%{location.lower()}%")
        filters.append(location_filter)

    # Apply all filters
    if filters:
        filter_condition = and_(*filters)
        base_query = base_query.where(filter_condition)
        count_query = count_query.where(filter_condition)

    # Get total count
    count_results = db.exec(count_query).all()
    total_count = len(count_results)

    # Apply pagination and ordering
    final_query = (
        base_query.order_by(InvestorProfile.firm_name).offset(skip).limit(limit)
    )

    # Execute the query
    results = db.exec(final_query).all()

    return list(results), total_count


def search_investors_by_name_or_firm(
    db: Session, search_term: str, skip: int = 0, limit: int = 100
) -> List[tuple[InvestorProfile, User]]:
    """
    Search investors by name or firm name with case-insensitive matching.
    """
    search_lower = search_term.lower()
    statement = (
        select(InvestorProfile, User)
        .join(User)
        .where(
            InvestorProfile.user_id == User.id,
            or_(
                col(User.full_name).ilike(f"%{search_lower}%"),
                col(InvestorProfile.firm_name).ilike(f"%{search_lower}%"),
            ),
        )
        .order_by(InvestorProfile.firm_name)
        .offset(skip)
        .limit(limit)
    )
    results = db.exec(statement).all()
    return list(results)


def get_investors_by_industry_focus(
    db: Session, industry: Industry, skip: int = 0, limit: int = 100
) -> List[tuple[InvestorProfile, User]]:
    """
    Get investors who have the specified industry in their investment focus.
    This is a simplified version that works without complex JSON queries.
    """
    # Get all investors and filter in Python for now
    # In production, you'd want to optimize this with proper JSON queries
    all_investors = get_all_investor_profiles_with_users(
        db, 0, 1000
    )  # Get a larger set

    filtered_investors = []
    for investor_profile, user in all_investors:
        if (
            investor_profile.investment_focus
            and industry in investor_profile.investment_focus
        ):
            filtered_investors.append((investor_profile, user))

    # Apply pagination manually
    start_idx = skip
    end_idx = skip + limit
    return filtered_investors[start_idx:end_idx]


def get_investors_by_funding_stage(
    db: Session, funding_stage: FundingStage, skip: int = 0, limit: int = 100
) -> List[tuple[InvestorProfile, User]]:
    """
    Get investors who prefer the specified funding stage.
    This is a simplified version that works without complex JSON queries.
    """
    # Get all investors and filter in Python for now
    all_investors = get_all_investor_profiles_with_users(
        db, 0, 1000
    )  # Get a larger set

    filtered_investors = []
    for investor_profile, user in all_investors:
        if (
            investor_profile.preferred_stages
            and funding_stage in investor_profile.preferred_stages
        ):
            filtered_investors.append((investor_profile, user))

    # Apply pagination manually
    start_idx = skip
    end_idx = skip + limit
    return filtered_investors[start_idx:end_idx]
