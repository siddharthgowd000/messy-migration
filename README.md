# User Management System - MVC Architecture

## 🏗️ Project Structure

```
src/
├── config/
│   └── database.js          # Database configuration and connection
├── controllers/
│   └── userController.js    # Business logic and request handling
├── middleware/
│   ├── validation.js        # Input validation rules
│   └── errorHandler.js      # Global error handling
├── models/
│   └── User.js             # Data access layer and user operations
├── routes/
│   └── userRoutes.js       # Route definitions
├── utils/
│   └── responseHandler.js   # Consistent API response utilities
├── scripts/
│   └── initDb.js           # Database initialization script
└── app.js                   # Main application entry point
```

## 🎯 MVC Architecture Benefits

### **Separation of Concerns**
- **Models**: Handle data access and business logic
- **Views**: API responses (JSON)
- **Controllers**: Handle HTTP requests and coordinate between models and views

### **Code Reusability**
- Database operations are centralized in models
- Validation rules are reusable across endpoints
- Response formatting is consistent through utilities

### **Maintainability**
- Each component has a single responsibility
- Easy to add new features without affecting existing code
- Clear file organization makes debugging easier

## 📁 Detailed Structure

### **Config Layer** (`src/config/`)
- **database.js**: Centralized database connection management
- Handles connection, disconnection, and query methods
- Provides promise-based database operations

### **Models Layer** (`src/models/`)
- **User.js**: Contains all user-related database operations
- Static methods for CRUD operations
- Password hashing and authentication logic
- Data validation at the model level

### **Controllers Layer** (`src/controllers/`)
- **userController.js**: Handles HTTP requests and responses
- Contains business logic for user operations
- Uses models for data access
- Returns consistent API responses

### **Routes Layer** (`src/routes/`)
- **userRoutes.js**: Defines all API endpoints
- Applies middleware (validation, authentication)
- Maps HTTP methods to controller methods
- Clean and organized route definitions

### **Middleware Layer** (`src/middleware/`)
- **validation.js**: Input validation rules using express-validator
- **errorHandler.js**: Global error handling and 404 responses
- Reusable across different routes

### **Utils Layer** (`src/utils/`)
- **responseHandler.js**: Consistent API response formatting
- Standardized success and error responses
- Reduces code duplication

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Database Setup
```bash
npm run init-db
```

### Start Development Server
```bash
npm run dev
```

### Start Production Server
```bash
npm start
```

## 🔧 Key Features

### **1. Database Abstraction**
```javascript
// In models/User.js
static async findAll() {
    return await db.query('SELECT id, name, email, created_at FROM users');
}
```

### **2. Consistent Responses**
```javascript
// In controllers/userController.js
return ApiResponse.success(res, { data: users });
return ApiResponse.error(res, 'Failed to fetch users');
```

### **3. Input Validation**
```javascript
// In middleware/validation.js
const userValidation = [
    body('name').trim().isLength({ min: 1 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
];
```

### **4. Error Handling**
```javascript
// Global error handler
app.use(globalErrorHandler);
```

## 📊 API Endpoints

| Method | Endpoint | Description | Validation |
|--------|----------|-------------|------------|
| GET | `/` | Health check | None |
| GET | `/users` | Get all users | None |
| GET | `/user/:id` | Get user by ID | ID validation |
| POST | `/users` | Create user | User validation |
| PUT | `/user/:id` | Update user | Update validation |
| DELETE | `/user/:id` | Delete user | ID validation |
| GET | `/search?name=term` | Search users | Search validation |
| POST | `/login` | User login | Login validation |

## 🔒 Security Features

### **1. SQL Injection Prevention**
- All queries use parameterized statements
- No string concatenation in SQL

### **2. Password Security**
- Bcrypt hashing with salt rounds
- Secure password comparison

### **3. Input Validation**
- Email format validation
- Password strength requirements
- Required field validation

### **4. Error Handling**
- No sensitive data in error messages
- Consistent error responses

## 🧪 Testing Examples

### **Create User**
```bash
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### **Login**
```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### **Get All Users**
```bash
curl http://localhost:5000/users
```

## 🔄 Code Reuse Examples

### **1. Database Operations**
```javascript
// Reusable in any model
const users = await db.query('SELECT * FROM users');
const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
```

### **2. Validation Rules**
```javascript
// Reusable across endpoints
app.post('/users', userValidation, handleValidationErrors, controller);
app.put('/users/:id', updateUserValidation, handleValidationErrors, controller);
```

### **3. Response Formatting**
```javascript
// Consistent responses across all endpoints
ApiResponse.success(res, { data: result });
ApiResponse.error(res, 'Error message');
```

## 📈 Scalability Benefits

### **1. Easy to Add New Features**
- Add new models without affecting existing code
- New controllers can reuse existing utilities
- Validation rules can be shared

### **2. Easy to Test**
- Each layer can be tested independently
- Models can be unit tested
- Controllers can be integration tested

### **3. Easy to Maintain**
- Clear separation of concerns
- Single responsibility principle
- Easy to locate and fix issues

## 🎨 Best Practices Implemented

### **1. Single Responsibility Principle**
- Each file has one clear purpose
- Models handle data, controllers handle requests

### **2. DRY (Don't Repeat Yourself)**
- Common database operations in config
- Reusable validation rules
- Consistent response formatting

### **3. Separation of Concerns**
- Business logic in controllers
- Data access in models
- Route definitions separate from logic

### **4. Error Handling**
- Global error handler
- Consistent error responses
- Proper HTTP status codes

## 🔮 Future Enhancements

### **1. Additional Models**
```javascript
// Easy to add new models
// models/Product.js
// models/Order.js
// models/Category.js
```

### **2. Authentication Middleware**
```javascript
// middleware/auth.js
const authenticateToken = (req, res, next) => {
    // JWT token validation
};
```

### **3. Database Migrations**
```javascript
// scripts/migrations/
// 001_create_users_table.js
// 002_add_user_roles.js
```

### **4. Testing Structure**
```javascript
// tests/
// ├── unit/
// ├── integration/
// └── e2e/
```

This MVC architecture provides excellent code reuse, maintainability, and scalability while following Node.js and Express.js best practices! 