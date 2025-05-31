from fastapi import APIRouter

from app.api.endpoints import auth, startups, upload, user

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
api_router.include_router(upload.router, prefix="/upload", tags=["uploads"])
