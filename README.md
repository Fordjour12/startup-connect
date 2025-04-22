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

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
