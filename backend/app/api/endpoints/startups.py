import uuid
from typing import Any, List

from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, SessionDep
from app.crud.startup import (
    create_startup,
    get_startup,
    get_startups,
    get_startups_by_founder,
)
from app.models.startup import Startup, StartupCreate, StartupRead

router = APIRouter(prefix="/startups", tags=["startups"])


@router.get("/", response_model=List[Startup])
async def get_all_startups(session: SessionDep):
    """Get all startups"""
    startups = get_startups(db=session)
    if not startups:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No startups found"
        )
    return startups


@router.get("/founder/{founder_id}", response_model=List[StartupRead])
async def get_founder_startups(session: SessionDep, founder_id: uuid.UUID):
    """Get all startups created by a specific founder"""
    startups = get_startups_by_founder(db=session, founder_id=founder_id)
    if not startups:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No startups found for founder {founder_id}",
        )
    return startups


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


@router.put("/update")
async def update_startup():
    return {"message": "Startup updated"}


@router.delete("/delete")
async def delete_startup():
    return {"message": "Startup deleted"}


@router.get("/{startup_id}", response_model=StartupRead)
async def get_startup_details(session: SessionDep, startup_id: uuid.UUID):
    """Get startup details by ID"""
    startup = get_startup(db=session, startup_id=startup_id)
    if not startup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Startup not found"
        )
    return startup
