from fastapi import APIRouter,status

api_router = APIRouter()

api_router.get("/healthcheck", status_code=status.HTTP_200_OK, tags=["healthcheck"])(lambda: {"status": "ok"})
