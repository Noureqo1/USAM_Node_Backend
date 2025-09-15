const request = require('supertest');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Set test environment before importing app
process.env.NODE_ENV = 'test';
const TEST_DB_SUFFIX = Date.now();
process.env.TEST_DB_SUFFIX = TEST_DB_SUFFIX;

// Import the app after setting environment
const app = require('../server');

// Test database setup with unique name to avoid conflicts
const TEST_DB_PATH = `./test_database_${TEST_DB_SUFFIX}.sqlite`;

describe('API Integration Tests', () => {
    let testToken;
    let testUserId;
    let testIdeaId;

    beforeAll(async () => {
        // Initialize test database with tables
        const testDb = new sqlite3.Database(TEST_DB_PATH);
        
        await new Promise((resolve, reject) => {
            testDb.serialize(() => {
                testDb.run(`CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
                )`);
                
                testDb.run(`CREATE TABLE IF NOT EXISTS ideas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    description TEXT,
                    status TEXT DEFAULT 'Concept',
                    userId INTEGER,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (userId) REFERENCES users (id)
                )`, (err) => {
                    testDb.close();
                    if (err) reject(err);
                    else resolve();
                });
            });
        });
        
        // Wait for server to be ready
        await new Promise(resolve => setTimeout(resolve, 1000));
    });

    afterAll(async () => {
        // Clean up test database with retry logic
        await new Promise(resolve => setTimeout(resolve, 500));
        try {
            if (fs.existsSync(TEST_DB_PATH)) {
                fs.unlinkSync(TEST_DB_PATH);
            }
        } catch (error) {
            // Ignore file deletion errors in tests
            console.log('Test database cleanup skipped:', error.message);
        }
    });

    describe('Basic Routes', () => {
        test('GET / should return API information', async () => {
            const res = await request(app).get('/');
            
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('version');
            expect(res.body).toHaveProperty('endpoints');
            expect(Array.isArray(res.body.endpoints)).toBe(true);
        });

        test('GET /nonexistent should return 404', async () => {
            const res = await request(app).get('/nonexistent');
            
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Route not found');
        });
    });

    describe('Skills API', () => {
        test('GET /api/skills should return all skills', async () => {
            const res = await request(app).get('/api/skills');
            
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body).toHaveProperty('data');
            expect(res.body).toHaveProperty('count');
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        test('GET /api/skills with proficiency filter should work', async () => {
            const res = await request(app).get('/api/skills?proficiency=Advanced');
            
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        test('GET /api/skills with category filter should work', async () => {
            const res = await request(app).get('/api/skills?category=Programming');
            
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        test('GET /api/skills with sort parameter should work', async () => {
            const res = await request(app).get('/api/skills?sort=name');
            
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        test('GET /api/skills/:id should return specific skill', async () => {
            const res = await request(app).get('/api/skills/1');
            
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body).toHaveProperty('data');
        });

        test('GET /api/skills/:id with invalid ID should return 404', async () => {
            const res = await request(app).get('/api/skills/999');
            
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Skill not found');
        });

        test('GET /api/skills/category/:category should return skills by category', async () => {
            const res = await request(app).get('/api/skills/category/Programming');
            
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body).toHaveProperty('data');
            expect(res.body).toHaveProperty('count');
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe('Authentication API', () => {
        const testUser = {
            username: `testuser_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            password: 'testpassword123'
        };

        test('POST /api/register should create a new user', async () => {
            const res = await request(app)
                .post('/api/register')
                .send(testUser);
            
            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('User registered successfully');
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data).toHaveProperty('username', testUser.username);
            
            testUserId = res.body.data.id;
        });

        test('POST /api/register should reject duplicate username', async () => {
            const res = await request(app)
                .post('/api/register')
                .send(testUser);
            
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('User already exists');
        });

        test('POST /api/register should reject invalid input', async () => {
            const invalidUser = {
                username: 'ab', // too short
                password: '123' // too short
            };
            
            const res = await request(app)
                .post('/api/register')
                .send(invalidUser);
            
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test('POST /api/login should authenticate valid user', async () => {
            const res = await request(app)
                .post('/api/login')
                .send(testUser);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Login successful');
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('username', testUser.username);
            
            testToken = res.body.token;
        });

        test('POST /api/login should reject invalid credentials', async () => {
            const invalidUser = {
                username: testUser.username,
                password: 'wrongpassword'
            };
            
            const res = await request(app)
                .post('/api/login')
                .send(invalidUser);
            
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid credentials');
        });

        test('POST /api/login should reject missing credentials', async () => {
            const res = await request(app)
                .post('/api/login')
                .send({});
            
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Username and password are required');
        });
    });

    describe('Ideas API', () => {
        const testIdea = {
            title: 'Test Idea',
            description: 'This is a test idea for integration testing',
            status: 'Concept'
        };

        test('GET /api/ideas should return all ideas', async () => {
            const res = await request(app).get('/api/ideas');
            
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body).toHaveProperty('data');
            expect(res.body).toHaveProperty('count');
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        test('POST /api/ideas should create new idea with authentication', async () => {
            const res = await request(app)
                .post('/api/ideas')
                .set('Authorization', `Bearer ${testToken}`)
                .send(testIdea);
            
            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Idea created successfully');
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data).toHaveProperty('title', testIdea.title);
            expect(res.body.data).toHaveProperty('userId', testUserId);
            
            testIdeaId = res.body.data.id;
        });

        test('POST /api/ideas should reject request without authentication', async () => {
            const res = await request(app)
                .post('/api/ideas')
                .send(testIdea);
            
            expect(res.statusCode).toBe(401);
        });

        test('POST /api/ideas should reject invalid input', async () => {
            const invalidIdea = {
                description: 'Missing title'
            };
            
            const res = await request(app)
                .post('/api/ideas')
                .set('Authorization', `Bearer ${testToken}`)
                .send(invalidIdea);
            
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Title is required');
        });

        test('GET /api/ideas/:id should return specific idea', async () => {
            const res = await request(app).get(`/api/ideas/${testIdeaId}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('id', testIdeaId);
            expect(res.body.data).toHaveProperty('title', testIdea.title);
        });

        test('GET /api/ideas/:id with invalid ID should return 404', async () => {
            const res = await request(app).get('/api/ideas/999');
            
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Idea not found');
        });

        test('PUT /api/ideas/:id should update existing idea', async () => {
            const updatedIdea = {
                title: 'Updated Test Idea',
                description: 'Updated description',
                status: 'In Progress'
            };
            
            const res = await request(app)
                .put(`/api/ideas/${testIdeaId}`)
                .send(updatedIdea);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Idea updated successfully');
            expect(res.body.data).toHaveProperty('title', updatedIdea.title);
        });

        test('PUT /api/ideas/:id with invalid ID should return 404', async () => {
            const res = await request(app)
                .put('/api/ideas/999')
                .send({ title: 'Updated Title' });
            
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Idea not found');
        });

        test('DELETE /api/ideas/:id should delete existing idea', async () => {
            const res = await request(app).delete(`/api/ideas/${testIdeaId}`);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Idea deleted successfully');
        });

        test('DELETE /api/ideas/:id with invalid ID should return 404', async () => {
            const res = await request(app).delete('/api/ideas/999');
            
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Idea not found');
        });
    });
});
