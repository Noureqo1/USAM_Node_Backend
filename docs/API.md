# Skills API Documentation

## Base URL
```
http://localhost:3001
```

## Endpoints

### GET /
Returns basic API information and available endpoints.

**Response:**
```json
{
  "message": "Skills API is running!",
  "version": "1.0.0",
  "endpoints": [
    "GET /",
    "GET /api/skills",
    "GET /api/skills/:id",
    "GET /api/skills/category/:category"
  ]
}
```

### GET /api/skills
Returns all skills with optional filtering and sorting.

**Query Parameters:**
- `proficiency` (optional): Filter by proficiency level (Expert, Advanced, Intermediate, Beginner)
- `category` (optional): Filter by category (partial match, case-insensitive)
- `sort` (optional): Sort results (`name` for alphabetical sorting)

**Examples:**
```
GET /api/skills
GET /api/skills?proficiency=expert
GET /api/skills?category=programming
GET /api/skills?proficiency=expert&sort=name
```

**Response:**
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

### GET /api/skills/:id
Returns a single skill by ID.

**Parameters:**
- `id` (required): Skill ID (integer)

**Example:**
```
GET /api/skills/1
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "JavaScript",
    "category": "Programming Language",
    "proficiency": "Expert",
    "description": "Modern JavaScript including ES6+ features"
  }
}
```

**Response (Not Found):**
```json
{
  "success": false,
  "message": "Skill not found"
}
```

### GET /api/skills/category/:category
Returns all skills in a specific category (exact match, case-insensitive).

**Parameters:**
- `category` (required): Category name

**Example:**
```
GET /api/skills/category/programming%20language
```

**Response:**
```json
{
  "success": true,
  "count": 1,
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

## Error Responses

### 404 Not Found
```json
{
  "success": false,
  "message": "Route not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error reading skills data",
  "error": "Error message details"
}
```

## Testing with curl

```bash
# Get all skills
curl http://localhost:3001/api/skills

# Get skill by ID
curl http://localhost:3001/api/skills/1

# Filter by proficiency
curl "http://localhost:3001/api/skills?proficiency=expert"

# Filter by category
curl "http://localhost:3001/api/skills?category=programming"

# Get skills by category
curl http://localhost:3001/api/skills/category/programming%20language

# Sort by name
curl "http://localhost:3001/api/skills?sort=name"
```
