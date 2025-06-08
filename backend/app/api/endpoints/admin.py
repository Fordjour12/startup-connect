import csv
import io
import uuid
from typing import List

from fastapi import APIRouter, File, HTTPException, UploadFile, status
from fastapi.responses import StreamingResponse
from sqlmodel import select

from app.api.deps import CurrentUser, SessionDep
from app.crud.investor import create_investor_profile
from app.models.investor import InvestorProfile, InvestorProfileCreate
from app.models.startup import FundingStage, Industry
from app.models.user import User, UserCreate, UserRole

router = APIRouter(prefix="/admin", tags=["Admin"])


def require_admin(current_user: CurrentUser) -> None:
    """Ensure the current user has admin privileges."""
    # For now, we'll check if the user is a founder (you can expand this later)
    # In a real system, you'd have specific admin roles
    if current_user.role not in [UserRole.FOUNDER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required"
        )


@router.post("/investors", response_model=dict)
async def create_investor_admin(
    session: SessionDep,
    current_user: CurrentUser,
    investor_data: dict,
):
    """
    Admin endpoint to create a new investor profile.
    """
    require_admin(current_user)

    try:
        # Extract user data
        user_data = {
            "full_name": investor_data.get("name", investor_data.get("full_name", "")),
            "email": investor_data["email"],
            "role": UserRole.INVESTOR,
            "is_active": True,
            "is_verified": True,
        }

        # Check if user already exists
        existing_user = session.exec(
            select(User).where(User.email == user_data["email"])
        ).first()

        if existing_user:
            if existing_user.role != UserRole.INVESTOR:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"User with email {user_data['email']} exists but is not an investor",
                )
            investor_user = existing_user
        else:
            # Create new user
            from app.crud.user import create_user

            user_create = UserCreate(
                **user_data,
                password="temp_password_123!",  # Temporary password
            )
            investor_user = create_user(db=session, user_create=user_create)

        # Check if investor profile already exists
        existing_profile = session.exec(
            select(InvestorProfile).where(InvestorProfile.user_id == investor_user.id)
        ).first()

        if existing_profile:
            return {
                "message": "Investor profile already exists",
                "investor_id": str(existing_profile.id),
                "user_id": str(investor_user.id),
                "skipped": True,
            }

        # Create investor profile
        profile_data = InvestorProfileCreate(
            firm_name=investor_data.get("firm_name", investor_data.get("company", "")),
            bio=investor_data.get("bio"),
            website=investor_data.get("website"),
            location=investor_data.get("location"),
            linkedin_url=investor_data.get(
                "linkedin_url", investor_data.get("linkedin")
            ),
            twitter_url=investor_data.get("twitter_url", investor_data.get("twitter")),
            investment_focus=_parse_investment_focus(
                investor_data.get("investment_focus", [])
            ),
            preferred_stages=_parse_funding_stages(
                investor_data.get("preferred_stages", [])
            ),
        )

        investor_profile = create_investor_profile(
            db=session, investor_profile_in=profile_data, user_id=investor_user.id
        )

        return {
            "message": "Investor profile created successfully",
            "investor_id": str(investor_profile.id),
            "user_id": str(investor_user.id),
            "created": True,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create investor: {str(e)}",
        )


@router.post("/investors/bulk-import")
async def bulk_import_investors(
    session: SessionDep,
    current_user: CurrentUser,
    file: UploadFile = File(...),
):
    """
    Admin endpoint to bulk import investors from CSV file.

    Expected CSV columns:
    - name (or full_name): Full name of the investor
    - email: Email address (required, unique)
    - firm_name (or company): Name of the investment firm
    - bio: Biography/description
    - website: Website URL
    - location: Geographic location
    - linkedin_url (or linkedin): LinkedIn profile URL
    - twitter_url (or twitter): Twitter profile URL
    - investment_focus: Comma-separated list of industries
    - preferred_stages: Comma-separated list of funding stages
    """
    require_admin(current_user)

    if not file.filename or not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="File must be a CSV file"
        )

    try:
        # Read CSV content
        content = await file.read()
        csv_content = content.decode("utf-8")
        csv_reader = csv.DictReader(io.StringIO(csv_content))

        results = {"total_rows": 0, "created": 0, "skipped": 0, "errors": []}

        for row_num, row in enumerate(csv_reader, 1):
            results["total_rows"] += 1

            try:
                # Validate required fields
                email = row.get("email", "").strip()
                if not email:
                    results["errors"].append(f"Row {row_num}: Email is required")
                    continue

                # Prepare investor data
                investor_data = {
                    "name": row.get("name", row.get("full_name", "")).strip(),
                    "email": email,
                    "firm_name": row.get("firm_name", row.get("company", "")).strip(),
                    "bio": row.get("bio", "").strip() or None,
                    "website": row.get("website", "").strip() or None,
                    "location": row.get("location", "").strip() or None,
                    "linkedin_url": row.get(
                        "linkedin_url", row.get("linkedin", "")
                    ).strip()
                    or None,
                    "twitter_url": row.get(
                        "twitter_url", row.get("twitter", "")
                    ).strip()
                    or None,
                    "investment_focus": _parse_csv_list(
                        row.get("investment_focus", "")
                    ),
                    "preferred_stages": _parse_csv_list(
                        row.get("preferred_stages", "")
                    ),
                }

                # Create investor using the existing endpoint logic
                result = await create_investor_admin(
                    session, current_user, investor_data
                )

                if result.get("created"):
                    results["created"] += 1
                elif result.get("skipped"):
                    results["skipped"] += 1

            except Exception as e:
                results["errors"].append(f"Row {row_num}: {str(e)}")
                continue

        return {
            "message": f"Bulk import completed. {results['created']} created, {results['skipped']} skipped, {len(results['errors'])} errors.",
            "results": results,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process CSV file: {str(e)}",
        )


@router.get("/investors/export")
async def export_investors(
    session: SessionDep,
    current_user: CurrentUser,
):
    """
    Admin endpoint to export all investors to CSV.
    """
    require_admin(current_user)

    try:
        # Get all investor profiles with user data
        statement = select(InvestorProfile, User).join(User)
        results = session.exec(statement).all()

        # Prepare CSV data
        output = io.StringIO()
        fieldnames = [
            "name",
            "email",
            "firm_name",
            "bio",
            "website",
            "location",
            "linkedin_url",
            "twitter_url",
            "investment_focus",
            "preferred_stages",
        ]
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()

        for investor_profile, user in results:
            writer.writerow(
                {
                    "name": user.full_name,
                    "email": user.email,
                    "firm_name": investor_profile.firm_name,
                    "bio": investor_profile.bio or "",
                    "website": investor_profile.website or "",
                    "location": investor_profile.location or "",
                    "linkedin_url": investor_profile.linkedin_url or "",
                    "twitter_url": investor_profile.twitter_url or "",
                    "investment_focus": ",".join(
                        investor_profile.investment_focus or []
                    ),
                    "preferred_stages": ",".join(
                        investor_profile.preferred_stages or []
                    ),
                }
            )

        output.seek(0)

        return StreamingResponse(
            io.BytesIO(output.getvalue().encode()),
            media_type="text/csv",
            headers={
                "Content-Disposition": "attachment; filename=investors_export.csv"
            },
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to export investors: {str(e)}",
        )


@router.get("/investors", response_model=List[dict])
async def list_all_investors_admin(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
):
    """
    Admin endpoint to list all investors with user details.
    """
    require_admin(current_user)

    try:
        # Get investor profiles with user data
        statement = select(InvestorProfile, User).join(User).offset(skip).limit(limit)
        results = session.exec(statement).all()

        investors = []
        for investor_profile, user in results:
            investors.append(
                {
                    "id": str(investor_profile.id),
                    "user_id": str(user.id),
                    "name": user.full_name,
                    "email": user.email,
                    "firm_name": investor_profile.firm_name,
                    "bio": investor_profile.bio,
                    "website": investor_profile.website,
                    "location": investor_profile.location,
                    "linkedin_url": investor_profile.linkedin_url,
                    "twitter_url": investor_profile.twitter_url,
                    "investment_focus": investor_profile.investment_focus,
                    "preferred_stages": investor_profile.preferred_stages,
                    "is_active": user.is_active,
                    "is_verified": user.is_verified,
                }
            )

        return investors

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list investors: {str(e)}",
        )


@router.delete("/investors/{investor_id}")
async def delete_investor_admin(
    investor_id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
):
    """
    Admin endpoint to delete an investor profile.
    """
    require_admin(current_user)

    try:
        # Get investor profile
        investor_profile = session.get(InvestorProfile, investor_id)
        if not investor_profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Investor profile not found",
            )

        # Get associated user
        user = session.get(User, investor_profile.user_id)

        # Delete investor profile
        session.delete(investor_profile)

        # Optionally delete the user as well (be careful with this)
        # For now, we'll just deactivate the user
        if user:
            user.is_active = False
            session.add(user)

        session.commit()

        return {"message": "Investor profile deleted successfully"}

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete investor: {str(e)}",
        )


# Helper functions


def _parse_investment_focus(focus_list) -> List[Industry]:
    """Parse investment focus from various input formats."""
    if isinstance(focus_list, str):
        focus_list = _parse_csv_list(focus_list)

    if not focus_list:
        return []

    valid_industries = []
    for item in focus_list:
        try:
            # Try to match with Industry enum
            industry = Industry(item.strip())
            valid_industries.append(industry)
        except ValueError:
            # If not a valid industry, skip it
            continue

    return valid_industries


def _parse_funding_stages(stages_list) -> List[FundingStage]:
    """Parse funding stages from various input formats."""
    if isinstance(stages_list, str):
        stages_list = _parse_csv_list(stages_list)

    if not stages_list:
        return []

    valid_stages = []
    for item in stages_list:
        try:
            # Try to match with FundingStage enum
            stage = FundingStage(item.strip())
            valid_stages.append(stage)
        except ValueError:
            # If not a valid stage, skip it
            continue

    return valid_stages


def _parse_csv_list(csv_string: str) -> List[str]:
    """Parse a comma-separated string into a list."""
    if not csv_string:
        return []

    return [item.strip() for item in csv_string.split(",") if item.strip()]
