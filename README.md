# Hotel Management System

A full-stack hotel management application with a FastAPI backend and React frontend.

## Project Structure

```
app/
├── backend/          # FastAPI backend
│   ├── api/          # API endpoints
│   ├── models/       # Database models
│   ├── schemas/      # Pydantic schemas
│   └── utils/        # Utility functions
└── frontend/         # React + Vite frontend
    └── src/
        ├── components/
        ├── pages/
        └── services/
```

## Prerequisites

- Python 3.13+
- Node.js 18+ and npm
- Supabase account (for database)

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the `app/backend/` directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SECRET_KEY=your_secret_key_for_jwt
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd app/backend
```

Install Python dependencies using uv (recommended) or pip:

```bash
# Using uv
uv sync
```

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd app/frontend
```

Install Node.js dependencies:

```bash
npm install
```

### 4. Database Setup (Optional)

If you need to seed initial data:

```bash
cd app/backend
python seed_data.py
```

## Running the Application

### Start the Backend

From the `app` directory:

```bash
uvicorn backend.main:app --reload --port 8888
```

The backend will be available at:
- API: http://localhost:8888
- API Documentation: http://localhost:8888/docs
- Alternative Docs: http://localhost:8888/redoc

### Start the Frontend

From the `app/frontend` directory:

```bash
npm run dev
```

The frontend will be available at http://localhost:5173 (default Vite port)

## Quick Start (Development)

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd app
uvicorn backend.main:app --reload --port 8888
```

**Terminal 2 - Frontend:**
```bash
cd app/frontend
npm run dev
```

## API Endpoints

The API includes the following endpoints:

- **Authentication**: `/api/v1/auth/*`
- **Users**: `/api/v1/users/*`
- **Rooms**: `/api/v1/rooms/*`
- **Bookings**: `/api/v1/bookings/*`
- **Payments**: `/api/v1/payments/*`
- **Feedback**: `/api/v1/feedback/*`
- **Statistics**: `/api/v1/stats/*`

Visit http://localhost:8888/docs for interactive API documentation.

## Features

- User authentication and authorization
- Room browsing and search
- Booking management
- Payment processing
- Review and feedback system
- Admin dashboard with statistics
- User profile management

## Technology Stack

### Backend
- FastAPI
- Supabase (PostgreSQL)
- Python-JOSE (JWT authentication)
- Pydantic
- Uvicorn

### Frontend
- React 19
- Vite
- React Router
- Axios
- Recharts (for statistics visualization)

## Development

### Backend Development
- The backend uses FastAPI with hot-reload enabled
- CORS is configured to allow all origins (update for production)
- Database operations use Supabase client

### Frontend Development
- Vite provides fast hot module replacement (HMR)
- ESLint is configured for code quality
- API calls are centralized in the `services/api.js` file


## Troubleshooting

**Backend won't start:**
- Check if port 8888 is already in use
- Verify `.env` file has correct Supabase credentials
- Ensure Python dependencies are installed

**Frontend won't start:**
- Delete `node_modules` and run `npm install` again
- Clear npm cache: `npm cache clean --force`
- Check Node.js version compatibility

**Database connection issues:**
- Verify Supabase URL and API key
- Check network connection
- Ensure Supabase project is active

## License

All rights reserved.
