# LinkCart - Digital Presence Management Platform

A full-stack web application for managing your digital presence with custom links, profiles, and analytics.

## Features

- 🔐 User Authentication (Signup/Login with JWT)
- 👤 User Profile Management
- 📝 Profile Completion System
- 🎨 Modern UI with Tailwind CSS
- 🔒 Secure Password Hashing
- 📱 Responsive Design
- 🗄️ PostgreSQL Database (Neon)

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL (Neon Database)
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React.js
- React Router
- Tailwind CSS
- Vite

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Neon Database account

### Backend Setup

1. Navigate to backend directory:
```bash
cd LinkCart/Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```
PORT=5000
DATABASE_URL="your_neon_database_url"
JWT_SECRET="your_secret_key"
```

5. Start the server:
```bash
npm start
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd LinkCart/Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Database Schema

### users table
```sql
CREATE TABLE users (
    custom_id VARCHAR(20) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### user_profiles table
```sql
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(20) UNIQUE REFERENCES users(custom_id) ON DELETE CASCADE,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    profile_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Profile
- `GET /api/profile` - Get user profile (Protected)
- `POST /api/profile` - Create/Update profile (Protected)

## Environment Variables

### Backend
- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- SQL injection prevention
- Input validation
