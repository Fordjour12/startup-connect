from fastapi import APIRouter,status
from app.api.endpoints import users,startups,investor

api_router = APIRouter()

api_router.get("/healthcheck", status_code=status.HTTP_200_OK, tags=["healthcheck"])(lambda: {"status": "ok"})
api_router.include_router(users.router)
api_router.include_router(startups.router)
api_router.include_router(investor.router)
