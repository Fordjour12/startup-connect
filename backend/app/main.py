# libraries
# from contextlib import asynccontextmanager

from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.routing import APIRoute

# endpoints
# from app.api.main import api_router
# from app.backend_pre_start import main as backend_pre_start
# from app.core.config import settings


# def custom_generate_unique_id(route: APIRoute) -> str:
#     """Generate unique IDs for API routes."""
#     return f"{route.tags[0] if route.tags else 'default'}-{route.name}"


# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     """Application lifespan manager."""
#     # Startup
#     await backend_pre_start()
#     yield
#     # Shutdown (add cleanup code here if needed)


# Create FastAPI application
app = FastAPI(
    # title=settings.PROJECT_NAME,
    # version=settings.VERSION,
    # openapi_url=f"{settings.API_V1_STR}/openapi.json",
    # generate_unique_id_function=custom_generate_unique_id,
    # lifespan=lifespan,
    #
)


# Configure CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=settings.BACKEND_CORS_ORIGINS,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to StartupConnect API",
        # "version": settings.VERSION,
        # "docs": f"{settings.API_V1_STR}/docs",
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "service": "StartupConnect API"}


# Include API routers
# app.include_router(api_router, prefix=settings.API_V1_STR)
