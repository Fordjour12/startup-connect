# Startup Connect

A web platform to discover startups in your country, enabling users to support them and investors to fund them.

## Tech Stack

- **Backend**: Python (FastAPI) with PostgreSQL database
- **Frontend**: Vue.js with Nuxt.js

## Features

- Startup profiles (description, industry, funding needs)
- User authentication (startups, supporters, investors)
- Search and filter startups by industry, location, or funding stage
- Investor-startup messaging system
- Admin dashboard for managing listings

## Getting Started

### Prerequisites

- Python 3.8+
- PostgreSQL
- Node.js (for frontend development)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Fordjour12/startupconnect.git
   cd startupconnect
   cd backend/app
   ```

2. Create and activate a virtual environment:

   ```bash
   # Create virtual environment
   uv venv

   # Activate virtual environment (Linux/macOS)
   source .venv/bin/activate
   ```

3. Install dependencies:

   ```bash
   # Install main dependencies
   uv pip install .

   # Install development dependencies (optional)
   uv pip install .[dev]
   ```

4. Verify installation:

   ```bash
   uv pip list
   ```

5. Alemblic migrations:

   ```bash
    alembic init "folder-name"
      # Create new migration file
   ```

   ```bash
    alembic revision --autogenerate -m "message"
     # create a migration commit message
   ```

   ```bash
    alembic upgrade head
      #Apply migrations
   ```

   ```bash
    alembic downgrade {base/migration-hash}
    # downgrading a committed migration
   ```

## Running the Application

### Backend

```bash
   fastapi dev main.py
```

### Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Testing

Run the test suite:

```bash
pytest

```

### Important commands

``` bash
   # List buckets
   docker exec -it startup_connect_mc mc ls local
   
   # List objects in a bucket
   docker exec -it startup_connect_mc mc ls local/startup-connect-files
   
   # Upload a file
   docker exec -it startup_connect_mc mc cp /path/to/file local/startup-connect-files/
   
   # Download a file
   docker exec -it startup_connect_mc mc cp local/startup-connect-files/file.txt /path/to/destination/
```

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
