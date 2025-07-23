"""
Test endpoints to demonstrate async database usage.
"""

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import text

from app.api.deps import AsyncSessionDep

router = APIRouter(prefix="/test-async", tags=["Test Async"])


@router.get("/db-connection")
async def test_async_db_connection(session: AsyncSessionDep) -> dict:
    """
    Test async database connection and return a simple query result.
    """
    try:
        # Execute a simple query
        result = await session.execute(
            text("SELECT 'Hello from async database!' as message")
        )
        row = result.fetchone()

        return {
            "status": "success",
            "message": row[0] if row else "Database connected but no result",
            "database_type": "async",
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection failed: {str(e)}",
        )


@router.get("/db-info")
async def get_database_info(session: AsyncSessionDep) -> dict:
    """
    Get database information and connection details.
    """
    try:
        # Get PostgreSQL version
        version_result = await session.execute(text("SELECT version()"))
        version_row = version_result.fetchone()

        # Get current database name
        db_result = await session.execute(text("SELECT current_database()"))
        db_row = db_result.fetchone()

        # Get current user
        user_result = await session.execute(text("SELECT current_user"))
        user_row = user_result.fetchone()

        return {
            "status": "success",
            "database_info": {
                "version": version_row[0] if version_row else "Unknown",
                "database_name": db_row[0] if db_row else "Unknown",
                "current_user": user_row[0] if user_row else "Unknown",
                "connection_type": "async",
            },
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get database info: {str(e)}",
        )
