# Skills & Ideas API

A RESTful API built with Express.js for managing skills data and project ideas with persistent database storage. This project demonstrates fundamental backend development concepts including REST architecture, HTTP methods, middleware implementation, database integration, and CRUD operations.

## 🎯 Project Overview

This API serves as a backend service that exposes both skills data (from JSON files) and project ideas (from SQLite database) through well-structured endpoints. It's part of a 5-week backend learning journey, extending Week 2's skills API with Week 3's database integration and CRUD operations.

## 🚀 Features

- **RESTful API Design**: Follows REST principles for predictable and scalable endpoints
- **Express.js Framework**: Built using the popular Node.js web framework
- **Database Integration**: SQLite database for persistent storage of project ideas
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality for ideas
- **CORS Support**: Enables cross-origin requests for frontend integration
- **Request Logging**: Middleware for tracking API requests
- **Error Handling**: Comprehensive error responses with appropriate HTTP status codes
- **Query Parameters**: Support for filtering and sorting skills data
- **Dual Data Sources**: JSON files for skills, SQLite database for ideas

## 🛠 Technologies Used

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **SQLite3**: Lightweight, file-based SQL database
- **CORS**: Cross-Origin Resource Sharing middleware
- **File System (fs)**: For reading JSON data files
- **Nodemon**: Development tool for auto-restarting the server

## 📋 Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

## ⚡ Installation & Setup

1. **Clone or download the project**
   ```bash
   cd skills-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize the database**
   ```bash
   npm run init-db
   ```
   This creates the SQLite database and populates it with sample project ideas.

4. **Start the server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Verify the API is running**
   - Open your browser and navigate to `http://localhost:3001`
   - You should see the API welcome message with all available endpoints

## 📚 API Endpoints

### Base URL: `http://localhost:3001`

#### Skills Endpoints (JSON-based)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information and available endpoints |
| GET | `/api/skills` | Get all skills (with optional filtering) |
| GET | `/api/skills/:id` | Get a specific skill by ID |
| GET | `/api/skills/category/:category` | Get skills by category |

#### Ideas Endpoints (Database-based)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ideas` | Get all project ideas |
| GET | `/api/ideas/:id` | Get a specific idea by ID |
| POST | `/api/ideas` | Create a new project idea |
| PUT | `/api/ideas/:id` | Update an existing idea |
| DELETE | `/api/ideas/:id` | Delete an idea |

### Query Parameters for `/api/skills`

- `proficiency`: Filter by proficiency level (Expert, Advanced, Intermediate, Beginner)
- `category`: Filter by category (partial match, case-insensitive)
- `sort`: Sort results (`name` for alphabetical sorting)

## 🔍 Example Requests

### Skills API Examples
```bash
# Get all skills
curl http://localhost:3001/api/skills

# Get skill with ID 1
curl http://localhost:3001/api/skills/1

# Filter by proficiency level
curl "http://localhost:3001/api/skills?proficiency=expert"

# Filter by category
curl "http://localhost:3001/api/skills?category=programming"

# Sort skills alphabetically
curl "http://localhost:3001/api/skills?sort=name"
```

### Ideas API Examples
```bash
# Get all ideas
curl http://localhost:3001/api/ideas

# Get idea with ID 1
curl http://localhost:3001/api/ideas/1

# Create a new idea
curl -X POST http://localhost:3001/api/ideas \
  -H "Content-Type: application/json" \
  -d '{"title": "Smart Garden Monitor", "description": "IoT sensors to monitor plant health", "status": "Planning"}'

# Update an existing idea
curl -X PUT http://localhost:3001/api/ideas/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Idea Title", "description": "Updated description", "status": "In Progress"}'

# Delete an idea
curl -X DELETE http://localhost:3001/api/ideas/1
```

## 📊 Sample Responses

### Skills Response
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "id": 1,
      "name": "JavaScript",
      "category": "Programming Language",
      "proficiency": "Expert",
      "description": "Modern JavaScript including ES6+ features"
    }
  ]
}
```

### Ideas Response
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "title": "Eco-Friendly Water Bottle",
      "description": "A smart water bottle that tracks hydration and suggests refill stations.",
      "status": "Concept"
    }
  ]
}
```

## 📁 Project Structure

```
skills-api/
├── data/
│   └── skills.json          # Skills data file
├── user-data-manager/       # Week 1 project files
│   ├── addUser.js
│   ├── generateData.js
│   ├── readData.js
│   └── users.json
├── tests/
│   └── postman/             # Postman test screenshots
├── server.js                # Main server file
├── init-db.js               # Database initialization script
├── database.sqlite          # SQLite database file (created after init)
├── package.json             # Project dependencies and scripts
├── README.md                # Project documentation
└── API.md                   # API endpoint documentation
```

## 🧪 Testing

You can test the API using various tools:

1. **Browser**: Navigate to GET endpoints directly
2. **Postman**: Import the endpoints for comprehensive testing
3. **curl**: Use command-line requests (examples provided above)
4. **Thunder Client**: VS Code extension for API testing

### Testing CRUD Operations

1. **Create**: POST new ideas with JSON body containing `title`, `description`, and `status`
2. **Read**: GET all ideas or specific ideas by ID
3. **Update**: PUT requests to modify existing ideas
4. **Delete**: DELETE requests to remove ideas

## 🚦 Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid request data or database errors
- **404 Not Found**: For non-existent routes or resources
- **500 Internal Server Error**: For server-side errors
- All errors return JSON responses with `success: false` and descriptive messages

## 🔧 Development Scripts

```bash
npm start       # Start the server in production mode
npm run dev     # Start the server in development mode with nodemon
npm run init-db # Initialize the SQLite database with sample data
```

## 💾 Database Schema

### Ideas Table
```sql
CREATE TABLE ideas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Concept'
);
```

## 🎓 Learning Objectives Achieved

**Week 2 (Skills API):**
- ✅ Express.js framework setup and configuration
- ✅ RESTful API design principles
- ✅ HTTP methods implementation (GET)
- ✅ Express.js routing and middleware
- ✅ JSON response handling
- ✅ CORS configuration
- ✅ Error handling and status codes
- ✅ Query parameter processing
- ✅ File-based data operations with async/await

**Week 3 (Database Integration):**
- ✅ SQLite database setup and connection
- ✅ Database initialization and table creation
- ✅ CRUD operations implementation
- ✅ Asynchronous database operations with callbacks
- ✅ SQL query execution (SELECT, INSERT, UPDATE, DELETE)
- ✅ Database error handling
- ✅ Data persistence and management
- ✅ Graceful database connection handling

## 🔮 Next Steps (Week 4 Preview)

In the upcoming week, this API will be enhanced with:
- Advanced database operations and relationships
- Authentication and authorization mechanisms
- JWT token-based security
- User management and protected routes
- Input validation and sanitization

## 📝 Notes

- Skills data uses file-based JSON storage (Week 2 implementation)
- Ideas data uses SQLite database for persistence (Week 3 implementation)
- Database file is created automatically when running `npm run init-db`
- All endpoints return JSON responses with consistent structure
- Request logging is enabled for development monitoring
- CORS is configured to allow all origins (suitable for development)
- Graceful shutdown handling ensures database connections are properly closed

## 🤝 Contributing

This is a learning project. Feel free to experiment with:
- Adding new endpoints for skills CRUD operations
- Implementing additional query parameters for ideas
- Adding data validation middleware
- Enhancing error handling and logging
- Creating database relationships

---

**Week 3 Backend Development Assessment - Database Integration & CRUD Operations**