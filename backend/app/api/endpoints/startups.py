from fastapi import APIRouter, HTTPException, status
from typing import Any, List

from app.api.deps import SessionDep # type: ignore
from app.crud.startup import get_startups, create_startup # type: ignore
from app.models.startup import Startup, StartupCreate # type: ignore

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


@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_new_startup(session: SessionDep, startup: StartupCreate) -> Any:
    try:
        """Create a startup"""
        startup_new_startup_process = create_startup(db=session, startup=startup)
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


@router.get("/:details")
async def get_startup_details():
    return {"message": "Startup details"}
