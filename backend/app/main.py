# libraries
# from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute

# endpoints
from app.api.main import api_router # type: ignore

# models
# from models.user import Base
# from core.database import engine
from app.core.config import settings # type: ignore

# Create database tables
# Base.metadata.create_all(bind=engine)

def custom_generate_unique_id(route:APIRoute) -> str:
    return f"{route.tags} - {route.name}"

app = FastAPI(
    title=settings.API_V1_STR,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
)


# Initialize backend services
# backend_pre_start()
# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # Startup
#     backend_pre_start()
#     yield
#     # Shutdown (add cleanup code here if needed)


# def custom_generate_unique_id(route:APIRoute) -> str:
#         openapi_url=f"{settings.API_V1_STR}/openapi.json",
#     generate_unique_id_function=custom_generate_unique_id,
#     lifespan=lifespan,

#     return f"{route.tags} - {route.name}"
# )



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
