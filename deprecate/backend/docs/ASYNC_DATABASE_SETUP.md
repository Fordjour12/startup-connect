# Async Database Setup

This document explains the unified async database configuration that works for both Neon PostgreSQL and standard PostgreSQL providers.

## Overview

The new database setup provides:
- **Unified async interface** for both Neon and standard PostgreSQL
- **Automatic URL conversion** from `postgresql://` to `postgresql+asyncpg://`
- **Backward compatibility** with existing synchronous code
- **Proper connection pooling** and error handling

## Configuration

### Environment Variables

The system supports two ways to configure the database:

1. **DATABASE_URL** (recommended for Neon):
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

2. **Individual components** (for standard PostgreSQL):
   ```
   POSTGRES_USER=your_user
   POSTGRES_PASSWORD=your_password
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=your_database
   ```

### URL Conversion

The system automatically converts database URLs to async format:

- `postgresql://` → `postgresql+asyncpg://`
- `postgresql+psycopg2://` → `postgresql+asyncpg://`
- `postgresql+asyncpg://` → (unchanged)

## Usage

### In FastAPI Endpoints

#### Async Endpoints (Recommended)

```python
from fastapi import APIRouter
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import AsyncSessionDep

router = APIRouter()

@router.get("/example")
async def example_endpoint(session: AsyncSessionDep) -> dict:
    # Use async session
    result = await session.execute(text("SELECT * FROM users"))
    users = result.fetchall()
    return {"users": users}
```

#### Legacy Synchronous Endpoints

```python
from fastapi import APIRouter
from sqlmodel import Session
from app.api.deps import SessionDep

router = APIRouter()

@router.get("/legacy-example")
async def legacy_endpoint(session: SessionDep) -> dict:
    # Use synchronous session (legacy)
    users = session.query(User).all()
    return {"users": users}
```

### Authentication Dependencies

#### Async Authentication

```python
from app.api.deps import CurrentUserAsync

@router.get("/protected")
async def protected_endpoint(current_user: CurrentUserAsync) -> dict:
    return {"user": current_user}
```

#### Legacy Synchronous Authentication

```python
from app.api.deps import CurrentUser

@router.get("/protected-legacy")
async def protected_legacy_endpoint(current_user: CurrentUser) -> dict:
    return {"user": current_user}
```

## Database Operations

### Async CRUD Operations

```python
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

# Get user by ID
async def get_user_by_id(session: AsyncSession, user_id: int):
    result = await session.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()

# Create user
async def create_user(session: AsyncSession, user_data: dict):
    user = User(**user_data)
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user

# Update user
async def update_user(session: AsyncSession, user_id: int, user_data: dict):
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user:
        for key, value in user_data.items():
            setattr(user, key, value)
        await session.commit()
        await session.refresh(user)
    return user

# Delete user
async def delete_user(session: AsyncSession, user_id: int):
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user:
        await session.delete(user)
        await session.commit()
    return user
```

## Migration Strategy

### Phase 1: Setup (Current)
- ✅ Unified async database configuration
- ✅ Backward compatibility with sync code
- ✅ Test endpoints for validation

### Phase 2: Gradual Migration
- 🔄 Convert existing endpoints to async
- 🔄 Update CRUD operations to async
- 🔄 Migrate authentication to async

### Phase 3: Cleanup
- 🔄 Remove legacy sync dependencies
- 🔄 Update all endpoints to async
- 🔄 Remove sync engine

## Testing

### Test Endpoints

The system includes test endpoints to validate the async database setup:

- `GET /api/v1/test-async/db-connection` - Test basic connection
- `GET /api/v1/test-async/db-info` - Get database information

### Manual Testing

```bash
# Test database connection
curl http://localhost:8000/api/v1/test-async/db-connection

# Get database info
curl http://localhost:8000/api/v1/test-async/db-info
```

## Error Handling

The async database setup includes comprehensive error handling:

```python
try:
    result = await session.execute(query)
    data = result.fetchall()
except Exception as e:
    # Handle database errors
    logger.error(f"Database error: {e}")
    raise HTTPException(status_code=500, detail="Database error")
```

## Performance Benefits

- **Non-blocking I/O**: Async operations don't block the event loop
- **Connection pooling**: Efficient connection management
- **Scalability**: Better handling of concurrent requests
- **Resource efficiency**: Reduced memory usage per connection

## Troubleshooting

### Common Issues

1. **Database not initialized**
   - Ensure `init_async_database()` is called during startup
   - Check environment variables are set correctly

2. **Connection errors**
   - Verify database URL format
   - Check network connectivity
   - Ensure database is running

3. **Session errors**
   - Use `AsyncSessionDep` for async endpoints
   - Don't mix sync and async sessions in the same endpoint

### Debug Mode

Enable debug logging by setting:
```
ENVIRONMENT=development
```

This will show SQL queries and connection details in the logs. 