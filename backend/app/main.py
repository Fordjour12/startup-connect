from api.endpoints import auth
from core.database import engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.user import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="StartupConnect API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["authentication"])


@app.get("/")
async def root():
    return {"message": "Welcome to StartupConnect API"}


@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str | None = None):
    if q:
        return {"item_id": item_id, "q": q}
    return {"item_id": item_id}


@app.get("/users/{user_id}/items/{item_id}")
async def read_user_item(user_id: int, item_id: str):
    return {"user_id": user_id, "item_id": item_id}
