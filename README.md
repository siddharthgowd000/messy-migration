# User Management System - Express.js Version

## Overview
This is a refactored version of the original Flask user management API, migrated to Express.js with significant security and code quality improvements.

## Getting Started

### Prerequisites
- Node.js 14+ installed
- npm or yarn package manager

### Setup (Should take < 5 minutes)
```bash
# Install dependencies
npm install

# Initialize the database with sample data
npm run init-db

# Start the application
npm start

# For development with auto-restart
npm run dev

# The API will be available at http://localhost:5000
```

## API Endpoints

### Health Check
- `GET /` - Health check endpoint

### User Management
- `GET /users` - Get all users
- `GET /user/:id` - Get specific user by ID
- `POST /users` - Create new user
- `PUT /user/:id` - Update user
- `DELETE /user/:id` - Delete user

### Search and Authentication
- `GET /search?name=<name>` - Search users by name
- `POST /login` - User login

## Sample Data
The database is initialized with these sample users:
- Email: `john@example.com`, Password: `password123`
- Email: `jane@example.com`, Password: `secret456`
- Email: `bob@example.com`, Password: `qwerty789`

## Security Improvements

### 1. SQL Injection Prevention
- All database queries use parameterized statements
- Input validation and sanitization
- No direct string concatenation in SQL

### 2. Password Security
- Passwords are hashed using bcrypt (salt rounds: 10)
- Secure password comparison
- Password strength validation (minimum 6 characters)

### 3. Input Validation
- Email format validation
- Required field validation
- User ID type checking
- Search term validation

### 4. Error Handling
- Comprehensive error handling with try-catch blocks
- Proper HTTP status codes
- Consistent error response format
- Global error handler

## Response Format

All API responses follow a consistent JSON format:

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Testing the API

### Using curl

1. **Get all users:**
```bash
curl http://localhost:5000/users
```

2. **Create a new user:**
```bash
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

3. **Login:**
```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

4. **Search users:**
```bash
curl "http://localhost:5000/search?name=John"
```

5. **Update user:**
```bash
curl -X PUT http://localhost:5000/user/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "email": "updated@example.com"
  }'
```

6. **Delete user:**
```bash
curl -X DELETE http://localhost:5000/user/1
```

## Key Features

- **Security First:** All critical security vulnerabilities have been addressed
- **Input Validation:** Comprehensive validation using express-validator
- **Error Handling:** Proper error handling with meaningful messages
- **Password Security:** Secure password hashing and comparison
- **Database Safety:** Parameterized queries prevent SQL injection
- **Consistent API:** Standardized response format across all endpoints
- **Production Ready:** Proper error handling and graceful shutdown

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## Dependencies

- **express** - Web framework
- **sqlite3** - Database driver
- **bcrypt** - Password hashing
- **express-validator** - Input validation
- **nodemon** - Development dependency for auto-restart

## Architecture

The application follows these architectural principles:

1. **Middleware-First:** Validation and error handling through middleware
2. **Promise-Based:** All database operations use promises
3. **Security-First:** Multiple layers of security validation
4. **Consistent API:** Standardized response format and error handling

## Migration from Flask

This Express.js version addresses all the issues found in the original Flask application:

- Fixed SQL injection vulnerabilities
- Implemented proper password hashing
- Added comprehensive input validation
- Improved error handling and response format
- Enhanced security measures
- Better code organization and maintainability

For detailed information about all changes made, see `CHANGES.md`. 