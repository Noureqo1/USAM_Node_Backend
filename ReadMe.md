# Skills API

A RESTful API built with Express.js for managing and serving skills data. This project demonstrates fundamental backend development concepts including REST architecture, HTTP methods, middleware implementation, and JSON data handling.

## 🎯 Project Overview

This API serves as a backend service that exposes skills data through well-structured endpoints, allowing frontend applications or other services to consume the data. It's part of a 5-week backend learning journey, specifically designed for Week 2 to introduce RESTful API development.

## 🚀 Features

- **RESTful API Design**: Follows REST principles for predictable and scalable endpoints
- **Express.js Framework**: Built using the popular Node.js web framework
- **CORS Support**: Enables cross-origin requests for frontend integration
- **Request Logging**: Middleware for tracking API requests
- **Error Handling**: Comprehensive error responses with appropriate HTTP status codes
- **Query Parameters**: Support for filtering and sorting data
- **JSON Data Storage**: File-based data storage using JSON

## 🛠 Technologies Used

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
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

3. **Install development dependencies**
   ```bash
   npm install --save-dev nodemon
   ```

4. **Start the server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Verify the API is running**
   - Open your browser and navigate to `http://localhost:3001`
   - You should see the API welcome message

## 📚 API Endpoints

### Base URL: `http://localhost:3001`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information and available endpoints |
| GET | `/api/skills` | Get all skills (with optional filtering) |
| GET | `/api/skills/:id` | Get a specific skill by ID |
| GET | `/api/skills/category/:category` | Get skills by category |

### Query Parameters for `/api/skills`

- `proficiency`: Filter by proficiency level (Expert, Advanced, Intermediate, Beginner)
- `category`: Filter by category (partial match, case-insensitive)
- `sort`: Sort results (`name` for alphabetical sorting)

## 🔍 Example Requests

```bash
# Get all skills
curl http://localhost:3001/api/skills

# Get skill with ID 1
curl http://localhost:3001/api/skills/1

# Filter by proficiency level
curl "http://localhost:3001/api/skills?proficiency=expert"

# Filter by category
curl "http://localhost:3001/api/skills?category=programming"

# Get skills in specific category
curl http://localhost:3001/api/skills/category/programming%20language

# Sort skills alphabetically
curl "http://localhost:3001/api/skills?sort=name"

# Combine filters
curl "http://localhost:3001/api/skills?proficiency=expert&sort=name"
```

## 📊 Sample Response

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
    },
    {
      "id": 2,
      "name": "Node.js",
      "category": "Runtime Environment",
      "proficiency": "Intermediate",
      "description": "Server-side JavaScript development"
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
│   └── package.json
├── server.js                # Main server file
├── package.json             # Project dependencies and scripts
├── README.md                # Project documentation
└── API.md                   # API endpoint documentation
```

## 🧪 Testing

You can test the API using various tools:

1. **Browser**: Navigate to endpoints directly for GET requests
2. **Postman**: Import the endpoints for comprehensive testing
3. **curl**: Use command-line requests (examples provided above)
4. **Thunder Client**: VS Code extension for API testing

## 🚦 Error Handling

The API includes comprehensive error handling:

- **404 Not Found**: For non-existent routes or resources
- **500 Internal Server Error**: For server-side errors (e.g., file reading issues)
- All errors return JSON responses with `success: false` and descriptive messages

## 🔧 Development Scripts

```bash
npm start      # Start the server in production mode
npm run dev    # Start the server in development mode with nodemon
```

## 🎓 Learning Objectives Achieved

- ✅ Express.js framework setup and configuration
- ✅ RESTful API design principles
- ✅ HTTP methods implementation (GET)
- ✅ Express.js routing and middleware
- ✅ JSON response handling
- ✅ CORS configuration
- ✅ Error handling and status codes
- ✅ Query parameter processing
- ✅ File-based data operations with async/await

## 🔮 Next Steps (Week 3 Preview)

In the upcoming week, this API will be enhanced with:
- Database integration (replacing file-based storage)
- CRUD operations (POST, PUT, DELETE)
- Data validation and sanitization
- Advanced error handling

## 📝 Notes

- The API currently uses file-based JSON storage for simplicity
- All endpoints return JSON responses
- Request logging is enabled for development monitoring
- CORS is configured to allow all origins (suitable for development)

## 🤝 Contributing

This is a learning project. Feel free to experiment with:
- Adding new endpoints
- Implementing additional query parameters
- Enhancing error handling
- Adding data validation

---

**Week 2 Backend Development Assessment - RESTful API with Express.js**