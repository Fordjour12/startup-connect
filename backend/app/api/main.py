from fastapi import APIRouter

api_router = APIRouter()

api_router.get("/healthcheck", status_code=200, tags=["healthcheck"])(lambda: {"status": "ok"})
