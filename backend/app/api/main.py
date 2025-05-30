from fastapi import APIRouter

from app.api.endpoints import user
from app.api.endpoints import auth
from app.api.endpoints import startups


# Create the main API router
api_router = APIRouter()


# Health check endpoint
@api_router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "message": "StartupConnect API is running"}


# Production-grade endpoints
api_router.include_router(user.router)
api_router.include_router(auth.router)
api_router.include_router(startups.router)
