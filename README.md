# Full-Stack Todo Application

A complete full-stack todo application built with React, Node.js, Express, PostgreSQL, and Docker.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Password Security**: Bcrypt password hashing
- **CRUD Operations**: Create, read, update, and delete todos
- **User Isolation**: Each user can only see and manage their own todos
- **Responsive Design**: Mobile-friendly interface
- **Dockerized**: Complete Docker setup with docker-compose
- **Database Persistence**: PostgreSQL with volume mounting

## Technical Stack

- **Frontend**: React 18, React Router, Axios
- **Backend**: Node.js, Express, JWT, Bcrypt
- **Database**: PostgreSQL 15
- **Containerization**: Docker & Docker Compose

## Project Structure

```
/
├── frontend/              # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── backend/               # Node.js backend API
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Authentication middleware
│   │   ├── routes/        # API routes
│   │   └── server.js      # Entry point
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml     # Docker orchestration
├── .gitignore
└── README.md
```

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- Node.js 18+ (for local development)
- PostgreSQL 15+ (for local development)

## Quick Start with Docker

The easiest way to run the application is using Docker Compose:

### 1. Clone the repository

```bash
git clone <repository-url>
cd copilot-todo-app
```

### 2. Start the application

```bash
docker-compose up --build
```

This will:
- Build the frontend and backend images
- Start PostgreSQL database
- Initialize database tables
- Start the backend API on port 5000
- Start the frontend on port 3000

### 3. Access the application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### 4. Stop the application

```bash
docker-compose down
```

To remove volumes (will delete all data):
```bash
docker-compose down -v
```

## Local Development Setup

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Update `.env` with your local PostgreSQL credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=tododb
JWT_SECRET=your-secret-key
```

5. Create the database:
```bash
createdb tododb
```

6. Start the development server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm start
```

The frontend will run on http://localhost:3000

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "token": "jwt-token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "jwt-token",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### Todo Endpoints

All todo endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### Get All Todos
```http
GET /api/todos
```

Response:
```json
{
  "todos": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create Todo
```http
POST /api/todos
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false
}
```

#### Update Todo
```http
PUT /api/todos/:id
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, cheese",
  "completed": true
}
```

#### Delete Todo
```http
DELETE /api/todos/:id
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Todos Table
```sql
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Features

- **Password Hashing**: Passwords are hashed using bcrypt with 10 salt rounds
- **JWT Authentication**: Secure token-based authentication
- **SQL Injection Prevention**: Parameterized queries using pg library
- **CORS Configuration**: Configured to allow only specified origins
- **Protected Routes**: Frontend routes protected with authentication checks
- **User Isolation**: Users can only access their own todos

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DB_HOST=postgres
DB_PORT=5432
DB_USER=todouser
DB_PASSWORD=todopassword
DB_NAME=tododb
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Testing the Application

### Manual Testing Steps

1. **Register a new user**:
   - Go to http://localhost:3000
   - Click "Register here"
   - Enter email and password
   - Click "Register"

2. **Login**:
   - Enter your credentials
   - Click "Login"
   - You should be redirected to the dashboard

3. **Create a todo**:
   - Enter a title and description
   - Click "Add Todo"
   - The todo should appear in the list below

4. **Update a todo**:
   - Click "Edit" on any todo
   - Modify the title or description
   - Click "Update Todo"

5. **Mark as complete**:
   - Click "Mark Complete" on any todo
   - The todo should be marked with a checkmark

6. **Delete a todo**:
   - Click "Delete" on any todo
   - Confirm the deletion

## Troubleshooting

### Docker Issues

**Port already in use:**
```bash
# Stop any running containers
docker-compose down

# Check what's using the ports
lsof -i :3000
lsof -i :5000
lsof -i :5432
```

**Database connection issues:**
```bash
# Check if postgres container is running
docker ps

# Check postgres logs
docker logs todo-postgres

# Restart the containers
docker-compose restart
```

### Local Development Issues

**Cannot connect to database:**
- Ensure PostgreSQL is running
- Check your `.env` credentials
- Verify the database exists: `psql -l`

**CORS errors:**
- Check that `FRONTEND_URL` in backend `.env` matches your frontend URL
- Clear browser cache

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC