# Skills & Ideas API with JWT Authentication

A RESTful API built with Express.js for managing skills data and project ideas with persistent database storage and JWT-based authentication. This project demonstrates advanced backend development concepts including authentication, authorization, advanced database queries, and secure API design.

## 🎯 Project Overview

This API serves as a secure backend service that exposes both skills data (from JSON files) and project ideas (from SQLite database) through well-structured, authenticated endpoints. It's part of a 5-week backend learning journey, now enhanced with Week 4's authentication system and advanced querying capabilities.

## 🚀 Features

- **RESTful API Design**: Follows REST principles for predictable and scalable endpoints
- **JWT Authentication**: Secure token-based authentication system
- **User Management**: User registration and login functionality
- **Protected Routes**: Middleware-based route protection
- **Advanced Querying**: Filtering, sorting, and pagination for ideas
- **User-Specific Data**: Users can only access and modify their own ideas
- **Express.js Framework**: Built using the popular Node.js web framework
- **Database Integration**: SQLite database with user and ideas tables
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Password Security**: bcrypt hashing for secure password storage
- **Environment Variables**: Secure configuration management
- **CORS Support**: Enables cross-origin requests for frontend integration
- **Request Logging**: Middleware for tracking API requests
- **Error Handling**: Comprehensive error responses with appropriate HTTP status codes

## 🛠 Technologies Used

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **SQLite3**: Lightweight, file-based SQL database
- **bcryptjs**: Password hashing library
- **jsonwebtoken**: JWT token generation and verification
- **dotenv**: Environment variable management
- **CORS**: Cross-Origin Resource Sharing middleware
- **Nodemon**: Development tool for auto-restarting the server

## 📋 Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

## ⚡ Installation & Setup

1. **Clone or download the project**
   ```bash
   cd USAM_Node_Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and replace JWT_SECRET with a strong secret key
   # You can generate one using:
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

4. **Initialize the database**
   ```bash
   npm run init-db
   ```
   This creates the SQLite database with users and ideas tables, and populates it with sample data.

5. **Start the server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Verify the API is running**
   - Open your browser and navigate to `http://localhost:3001`
   - You should see the API welcome message with all available endpoints

## 📚 API Endpoints

### Base URL: `http://localhost:3001`

#### Authentication Endpoints
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/register` | Register a new user | None |
| POST | `/api/login` | Login user and get JWT token | None |

#### Skills Endpoints (JSON-based)
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/` | API information and available endpoints | None |
| GET | `/api/skills` | Get all skills (with optional filtering) | None |
| GET | `/api/skills/:id` | Get a specific skill by ID | None |
| GET | `/api/skills/category/:category` | Get skills by category | None |

#### Ideas Endpoints (Database-based)
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/ideas` | Get all ideas (with advanced querying) | None |
| GET | `/api/ideas/:id` | Get a specific idea by ID | None |
| POST | `/api/ideas` | Create a new project idea | **Required** |
| PUT | `/api/ideas/:id` | Update your own idea | **Required** |
| DELETE | `/api/ideas/:id` | Delete your own idea | **Required** |

### Authentication

Protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Advanced Querying for `/api/ideas`

The GET `/api/ideas` endpoint supports advanced querying options:

#### Filtering
- `status`: Filter by idea status (e.g., `?status=Concept`)
- `userId`: Filter by user ID (e.g., `?userId=1`)

#### Sorting
- `sort`: Sort field (`title`, `createdAt`, `status`)
- `order`: Sort order (`asc` or `desc`)

#### Pagination
- `_limit`: Number of results per page (e.g., `?_limit=10`)
- `_page`: Page number (e.g., `?_page=2`)

#### Examples
```bash
# Filter by status
GET /api/ideas?status=Concept

# Sort by title ascending
GET /api/ideas?sort=title&order=asc

# Paginate results (10 per page, page 2)
GET /api/ideas?_limit=10&_page=2

# Combine filters
GET /api/ideas?status=In Progress&sort=createdAt&order=desc&_limit=5
```

## 🔍 Example Requests

### Authentication Examples
```bash
# Register a new user
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "securepassword123"}'

# Login user
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "securepassword123"}'
```

### Protected Ideas API Examples
```bash
# Create a new idea (requires authentication)
curl -X POST http://localhost:3001/api/ideas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title": "Smart Garden Monitor", "description": "IoT sensors to monitor plant health", "status": "Planning"}'

# Update your own idea (requires authentication)
curl -X PUT http://localhost:3001/api/ideas/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title": "Updated Idea Title", "description": "Updated description", "status": "In Progress"}'

# Delete your own idea (requires authentication)
curl -X DELETE http://localhost:3001/api/ideas/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Advanced Querying Examples
```bash
# Get ideas with filtering and sorting
curl "http://localhost:3001/api/ideas?status=Concept&sort=title&order=asc"

# Get paginated results
curl "http://localhost:3001/api/ideas?_limit=5&_page=1"

# Get user-specific ideas (when authenticated)
curl "http://localhost:3001/api/ideas?userId=1"
```

## 📊 Sample Responses

### Authentication Response
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser"
  }
}
```

### Advanced Ideas Response (with pagination)
```json
{
  "success": true,
  "count": 5,
  "total": 12,
  "data": [
    {
      "id": 1,
      "title": "Eco-Friendly Water Bottle",
      "description": "A smart water bottle that tracks hydration and suggests refill stations.",
      "status": "Concept",
      "userId": 1,
      "createdAt": "2024-01-15 10:30:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 12,
    "pages": 3
  }
}
```

## 📁 Project Structure

```
USAM_Node_Backend/
├── data/
│   └── skills.json          # Skills data file
├── user-data-manager/       # Week 1 project files
│   ├── addUser.js
│   ├── generateData.js
│   ├── readData.js
│   └── users.json
├── tests/
│   └── postman/             # Postman test collections
├── Tasks/                   # Assessment documents
│   ├── backend_week1_assessment.pdf
│   ├── backend_week2_assessment.pdf
│   ├── backend_week3_assessment.pdf
│   └── backend_week4_assessment.pdf
├── docs/
│   ├── API.md               # API documentation
│   └── ChangesFromTask_2.md # Change log
├── server.js                # Main server file with authentication
├── authMiddleware.js        # JWT authentication middleware
├── init-db.js               # Database initialization script
├── database.sqlite          # SQLite database file (created after init)
├── package.json             # Project dependencies and scripts
├── .env.example             # Environment variables template
├── .env                     # Environment variables (create from .env.example)
└── README.md                # Project documentation
```

## 🧪 Testing Authentication Flow

### Step 1: Register a User
```bash
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

### Step 2: Login and Get Token
```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

### Step 3: Use Token for Protected Routes
```bash
# Replace YOUR_JWT_TOKEN with the token from step 2
curl -X POST http://localhost:3001/api/ideas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title": "My Secure Idea", "description": "This idea is protected!"}'
```

## 🚦 Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid request data, validation errors, or database errors
- **401 Unauthorized**: Missing or invalid JWT token
- **404 Not Found**: For non-existent routes or resources
- **500 Internal Server Error**: For server-side errors
- All errors return JSON responses with `success: false` and descriptive messages

### Authentication Error Examples
```json
{
  "success": false,
  "message": "No token, authorization denied"
}

{
  "success": false,
  "message": "Token is not valid"
}

{
  "success": false,
  "message": "User already exists"
}
```

## 🔧 Development Scripts

```bash
npm start       # Start the server in production mode
npm run dev     # Start the server in development mode with nodemon
npm run init-db # Initialize the SQLite database with sample data
```

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Ideas Table
```sql
CREATE TABLE ideas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Concept',
    userId INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users (id)
);
```

## 🔐 Security Features

- **Password Hashing**: Uses bcryptjs with salt rounds for secure password storage
- **JWT Tokens**: Stateless authentication with configurable expiration (24h default)
- **Environment Variables**: Sensitive data like JWT secrets stored in .env files
- **User Isolation**: Users can only access and modify their own ideas
- **Input Validation**: Server-side validation for all user inputs
- **CORS Configuration**: Controlled cross-origin access

## 🎓 Learning Objectives Achieved

**Week 4 (Authentication & Advanced Queries):**
- ✅ User registration and login system
- ✅ JWT token generation and verification
- ✅ Password hashing with bcryptjs
- ✅ Authentication middleware implementation
- ✅ Protected route implementation
- ✅ Advanced database querying (filtering, sorting, pagination)
- ✅ User-specific data access control
- ✅ Environment variable management
- ✅ Security best practices implementation

**Previous Weeks:**
- ✅ Express.js framework and RESTful API design (Week 2)
- ✅ SQLite database integration and CRUD operations (Week 3)
- ✅ File-based data operations and middleware (Week 2)

## 🔮 Next Steps (Week 5 Preview)

In the upcoming week, this API will be prepared for production with:
- Docker containerization
- CI/CD pipeline setup
- Production deployment strategies
- Monitoring and logging solutions
- Performance optimization
- Scaling considerations

## 📝 Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# JWT Secret Key - Use a strong, random secret
JWT_SECRET=your_super_secret_jwt_key_replace_this_with_a_strong_random_key

# Server Port (optional, defaults to 3001)
PORT=3001
```

## 🔗 API Testing

You can test the API using:

1. **Postman**: Import endpoints and test authentication flows
2. **curl**: Use command-line requests (examples provided above)
3. **Thunder Client**: VS Code extension for API testing
4. **Browser**: For GET endpoints (non-protected routes)

## 📚 Additional Resources

- [bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)
- [jsonwebtoken Documentation](https://github.com/auth0/node-jsonwebtoken)
- [dotenv Documentation](https://github.com/motdotla/dotenv)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Week 4 Backend Development Assessment - Authentication & Advanced Database Operations**
*Successfully implemented JWT authentication, user management, and advanced querying capabilities*