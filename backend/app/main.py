# libraries
from fastapi import FastAPI
from fastapi.routing import APIRoute
from fastapi.middleware.cors import CORSMiddleware

# endpoints
from app.api.main import api_router

# models
# from models.user import Base

# from core.database import engine
from app.core.config import settings

# Create database tables
# Base.metadata.create_all(bind=engine)

def custom_generate_unique_id(route:APIRoute) -> str:
    return f"{route.tags} - {route.name}"

app = FastAPI(
     title=settings.API_V1_STR,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Welcome to StartupConnect API"}


# Include routers
app.include_router(api_router, prefix=settings.API_V1_STR)
