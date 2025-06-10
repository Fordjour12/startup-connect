import uuid
from typing import Any, List

from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, SessionDep
from app.crud.startup import (
    create_startup,
    get_draft_startups_by_founder,
    get_published_startups,
    get_startup,
    get_startups_by_founder,
    update_startup_publication_status,
)
from app.models.startup import Startup, StartupCreate, StartupRead

router = APIRouter(prefix="/startups", tags=["Startups"])


@router.get("/", response_model=List[Startup])
async def get_all_startups(session: SessionDep):
    """Get all published startups (public endpoint)"""
    startups = get_published_startups(db=session)
    if not startups:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No published startups found"
        )
    return startups


@router.get("/founder/{founder_id}", response_model=List[StartupRead])
async def get_founder_startups(session: SessionDep, founder_id: uuid.UUID):
    """Get all startups created by a specific founder (includes drafts)"""
    startups = get_startups_by_founder(
        db=session, founder_id=founder_id, include_drafts=True
    )
    if not startups:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No startups found for founder {founder_id}",
        )
    return startups


@router.get("/drafts", response_model=List[StartupRead])
async def get_my_draft_startups(session: SessionDep, current_user: CurrentUser):
    """Get current user's draft startups (requires authentication)"""
    startups = get_draft_startups_by_founder(db=session, founder_id=current_user.id)
    return startups  # Return empty list if no drafts found


@router.post("/create", response_model=StartupRead, status_code=status.HTTP_201_CREATED)
async def create_new_startup(
    session: SessionDep, current_user: CurrentUser, startup: StartupCreate
) -> Any:
    """Create a startup (requires authentication)"""
    try:
        # Create startup with the current user as founder
        startup_new_startup_process = create_startup(
            db=session, startup=startup, founder_id=current_user.id
        )
        return startup_new_startup_process
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        ) from e


@router.put("/{startup_id}/publish", response_model=StartupRead)
async def publish_startup(
    session: SessionDep, startup_id: uuid.UUID, current_user: CurrentUser
):
    """Publish a startup (requires authentication and ownership)"""
    # First check if startup exists and user owns it
    startup = get_startup(db=session, startup_id=startup_id)
    if not startup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Startup not found"
        )

    if startup.founder_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this startup",
        )

    # Update publication status
    updated_startup = update_startup_publication_status(
        db=session, startup_id=startup_id, is_published=True
    )
    if not updated_startup:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to publish startup"
        )

    return updated_startup


@router.put("/{startup_id}/unpublish", response_model=StartupRead)
async def unpublish_startup(
    session: SessionDep, startup_id: uuid.UUID, current_user: CurrentUser
):
    """Unpublish a startup (requires authentication and ownership)"""
    # First check if startup exists and user owns it
    startup = get_startup(db=session, startup_id=startup_id)
    if not startup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Startup not found"
        )

    if startup.founder_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this startup",
        )

    # Update publication status
    updated_startup = update_startup_publication_status(
        db=session, startup_id=startup_id, is_published=False
    )
    if not updated_startup:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to unpublish startup",
        )

    return updated_startup


@router.put("/update")
async def update_startup():
    return {"message": "Startup updated"}


@router.delete("/{startup_id}")
async def delete_startup(
    session: SessionDep, startup_id: uuid.UUID, current_user: CurrentUser
):
    """Delete a startup (requires authentication and ownership)"""
    # First check if startup exists and user owns it
    startup = get_startup(db=session, startup_id=startup_id)
    if not startup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Startup not found"
        )

    if startup.founder_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this startup",
        )

    # Import the delete function
    from app.crud.startup import delete_startup as delete_startup_crud

    # Delete the startup
    success = delete_startup_crud(db=session, startup_id=startup_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete startup",
        )

    return {"message": "Startup deleted successfully"}


@router.get("/{startup_id}", response_model=StartupRead)
async def get_startup_details(session: SessionDep, startup_id: uuid.UUID):
    """Get startup details by ID"""
    startup = get_startup(db=session, startup_id=startup_id)
    if not startup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Startup not found"
        )
    return startup
