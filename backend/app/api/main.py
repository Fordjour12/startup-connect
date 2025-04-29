from fastapi import APIRouter,status
from app.api.endpoints import users

api_router = APIRouter()

api_router.get("/healthcheck", status_code=status.HTTP_200_OK, tags=["healthcheck"])(lambda: {"status": "ok"})
api_router.include_router(users.router)
