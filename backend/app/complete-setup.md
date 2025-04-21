# complete the setup

#### 1. **Test the FastAPI Setup**
Create a minimal FastAPI app to confirm everything works.

- **Create `backend/app/main.py`:**
  ```python
  from fastapi import FastAPI

  app = FastAPI()

  @app.get("/")
  async def root():
      return {"message": "FastAPI is running with uv!"}
  ```

- **Run the app with Uvicorn:**
  ```bash
  cd backend/app
  uv run uvicorn app.main:app --reload
  ```
  - `uv run` ensures the command runs in the project’s virtual environment.
  - Visit `http://127.0.0.1:8000` to see the message. Check the API docs at `http://127.0.0.1:8000/docs`.

#### 2. **Set Up Alembic for Database Migrations**
Initialize Alembic for database schema management.

- **Initialize Alembic:**
  ```bash
  cd backend
  uv run alembic init migrations
  ```

- **Edit `alembic.ini`:**
  Update the `sqlalchemy.url` line:
  ```
  sqlalchemy.url = postgresql://postgres:yourpassword@localhost:5432/startupconnect
  ```

- **Update `migrations/env.py`:**
  Ensure it uses the `DATABASE_URL` from the `.env` file:
  ```python
  from dotenv import load_dotenv
  import os
  load_dotenv()
  connectable = create_engine(os.getenv("DATABASE_URL"))
  ```

#### 3. **Optional: Docker Setup (if using Docker Compose)**
If you prefer running PostgreSQL via Docker:

- **Create `docker-compose.yml` in the project root:**
  ```yaml
  version: '3.8'
  services:
    db:
      image: postgres:latest
      environment:
        POSTGRES_USER: postgres
        POSTGRES_PASSWORD: yourpassword
        POSTGRES_DB: startupconnect
      ports:
        - "5432:5432"
      volumes:
        - db_data:/var/lib/postgresql/data
  volumes:
    db_data:
  ```

- **Run the database:**
  ```bash
  docker-compose up -d
  ```

---

### Summary of Installed Components
- **uv**: Package manager and virtual environment tool.
- **FastAPI**: API framework.
- **Uvicorn**: ASGI server.
- **PostgreSQL**: Database.
- **psycopg2-binary**: PostgreSQL driver.
- **SQLAlchemy**: ORM.
- **Alembic**: Database migrations.
- **python-jose[cryptography]**: JWT for authentication.
- **passlib[bcrypt]**: Password hashing.
- **python-dotenv**: Environment variable management.
- **Docker (optional)**: For PostgreSQL.

### Next Steps
- Build your FastAPI app by creating models, schemas, and endpoints as per the project structure.
- Use `uv run alembic revision --autogenerate` after defining models to create database tables.
- Run your app with `uv run uvicorn app.main:app --reload` during development.
