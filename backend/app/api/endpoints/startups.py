from fastapi import APIRouter, HTTPException, status
from typing import List

from app.api.deps import SessionDep
from app.crud.startup import get_startups
from app.models.startup import Startup

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


@router.post("/create")
async def create_startup():
    return {"message": "Startup created"}


@router.put("/update")
async def update_startup():
    return {"message": "Startup updated"}


@router.delete("/delete")
async def delete_startup():
    return {"message": "Startup deleted"}


@router.get("/:details")
async def get_startup_details():
    return {"message": "Startup details"}
