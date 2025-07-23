import os
from typing import AsyncGenerator, Optional

from sqlalchemy import text
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import settings

# Global async engine and session maker
async_engine: Optional[AsyncEngine] = None
async_session_maker: Optional[async_sessionmaker[AsyncSession]] = None


def get_async_database_url() -> Optional[str]:
    """
    Convert database URL to async format for both Neon and standard PostgreSQL.
    Handles both DATABASE_URL and SQLALCHEMY_DATABASE_URL configurations.
    """
    # First try DATABASE_URL (commonly used by Neon)
    database_url = os.getenv("DATABASE_URL")

    if database_url:
        # Convert to async format if it's a standard postgresql URL
        if database_url.startswith("postgresql://"):
            return database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
        # If it's already in async format (postgresql+asyncpg://), return as is
        return database_url

    # Fall back to SQLALCHEMY_DATABASE_URL from settings
    if settings.SQLALCHEMY_DATABASE_URL:
        db_url = str(settings.SQLALCHEMY_DATABASE_URL)
        # Convert to async format
        if db_url.startswith("postgresql://"):
            return db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
        elif db_url.startswith("postgresql+psycopg2://"):
            return db_url.replace("postgresql+psycopg2://", "postgresql+asyncpg://", 1)
        return db_url

    return None


def init_async_database() -> None:
    """
    Initialize the async database engine and session maker.
    This should be called during application startup.
    """
    global async_engine, async_session_maker

    database_url = get_async_database_url()

    if not database_url:
        print("⚠️  Database not configured - running without database connection")
        return

    try:
        # Create async engine
        async_engine = create_async_engine(
            database_url,
            echo=settings.ENVIRONMENT == "development",
            pool_pre_ping=True,
            pool_recycle=300,
        )

        # Create async session maker
        async_session_maker = async_sessionmaker(
            async_engine,
            class_=AsyncSession,
            expire_on_commit=False,
        )

        print("✅ Async database engine initialized successfully")

    except Exception as e:
        print(f"❌ Failed to initialize async database: {e}")
        async_engine = None
        async_session_maker = None


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Get an async database session.
    Raises an exception if database is not configured.
    """
    if not async_session_maker:
        raise RuntimeError(
            "Database not initialized. Call init_async_database() first."
        )

    async with async_session_maker() as session:
        yield session


async def test_database_connection() -> None:
    """
    Test the database connection to ensure it's working properly.
    """
    if not async_engine:
        print("⚠️  No database engine available")
        return

    try:
        async with async_engine.connect() as conn:
            result = await conn.execute(text("SELECT 'hello world' as test"))
            row = result.fetchone()
            if row:
                print(f"✅ Database connection test successful: {row[0]}")
            else:
                print("✅ Database connection test successful")
    except Exception as e:
        print(f"❌ Database connection test failed: {e}")


async def close_async_database() -> None:
    """
    Close the async database engine.
    This should be called during application shutdown.
    """
    global async_engine

    if async_engine:
        await async_engine.dispose()
        print("✅ Async database engine closed")


# Legacy synchronous engine (deprecated - kept for backward compatibility)
from sqlalchemy import Engine
from sqlmodel import create_engine

engine: Optional[Engine] = None

if settings.SQLALCHEMY_DATABASE_URL:
    engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URL))
else:
    print("⚠️  Database not configured - running without database connection")
