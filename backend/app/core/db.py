from app.core.config import settings
from sqlmodel import create_engine
from sqlalchemy import Engine
from typing import Optional

# Create engine only if database URL is configured
engine: Optional[Engine] = None

if settings.SQLALCHEMY_DATABASE_URL:
    engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URL))
else:
    print("⚠️  Database not configured - running without database connection")
