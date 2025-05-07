from fastapi import APIRouter

router = APIRouter(prefix="/investor", tags=["Investor"])

@router.get("/")
async def create_investor():
    return {"message": "Investor created"}

@router.put("/update")
async def update_investor():
    return {"message": "Investor updated"}

@router.delete("/delete")
async def delete_investor():
    return {"message": "Investor deleted"}

@router.get("/:details")
async def get_investor_details_by_id():
    return {"message": "Investor details by ID"}
