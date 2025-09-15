require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware');

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Request logging middleware
const requestLogger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Basic route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Skills & Ideas API is running!',
        version: '1.0.0',
        endpoints: [
            'GET /',
            'GET /api/skills',
            'GET /api/skills/:id',
            'GET /api/skills/category/:category',
            'GET /api/ideas',
            'GET /api/ideas/:id',
            'POST /api/ideas',
            'PUT /api/ideas/:id',
            'DELETE /api/ideas/:id'
        ]
    });
});

// Get all skills with optional query parameters
app.get('/api/skills', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'data', 'skills.json'), 'utf8');
        let skills = JSON.parse(data);

        // Filter by proficiency if provided
        if (req.query.proficiency) {
            skills = skills.filter(skill =>
                skill.proficiency.toLowerCase() === req.query.proficiency.toLowerCase()
            );
        }

        // Filter by category if provided
        if (req.query.category) {
            skills = skills.filter(skill =>
                skill.category.toLowerCase().includes(req.query.category.toLowerCase())
            );
        }

        // Sort by name if requested
        if (req.query.sort === 'name') {
            skills.sort((a, b) => a.name.localeCompare(b.name));
        }

        res.json({
            success: true,
            count: skills.length,
            data: skills
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error reading skills data',
            error: error.message
        });
    }
});

// Get single skill by ID
app.get('/api/skills/:id', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'data', 'skills.json'), 'utf8');
        const skills = JSON.parse(data);
        const skill = skills.find(s => s.id === parseInt(req.params.id));

        if (!skill) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        res.json({
            success: true,
            data: skill
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error reading skills data',
            error: error.message
        });
    }
});

// Get skills by category
app.get('/api/skills/category/:category', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'data', 'skills.json'), 'utf8');
        const skills = JSON.parse(data);
        const filteredSkills = skills.filter(skill =>
            skill.category.toLowerCase() === req.params.category.toLowerCase()
        );

        res.json({
            success: true,
            count: filteredSkills.length,
            data: filteredSkills
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error reading skills data',
            error: error.message
        });
    }
});

// IDEAS ENDPOINTS

// Get all ideas
app.get('/api/ideas', (req, res) => {
    db.all("SELECT * FROM ideas", [], (err, rows) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Database error",
                error: err.message
            });
            return;
        }
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    });
});

// Get single idea by ID
app.get('/api/ideas/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM ideas WHERE id = ?", id, (err, row) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Database error",
                error: err.message
            });
            return;
        }
        if (!row) {
            return res.status(404).json({
                success: false,
                message: "Idea not found"
            });
        }
        res.json({
            success: true,
            data: row
        });
    });
});

// Create new idea
app.post('/api/ideas', (req, res) => {
    const { title, description, status } = req.body;
    
    if (!title) {
        return res.status(400).json({
            success: false,
            message: "Title is required"
        });
    }
    
    const insert = "INSERT INTO ideas (title, description, status) VALUES (?, ?, ?)";
    db.run(insert, [title, description, status || "Concept"], function (err) {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Database error",
                error: err.message
            });
            return;
        }
        res.status(201).json({
            success: true,
            message: "Idea created successfully",
            data: {
                id: this.lastID,
                title,
                description,
                status: status || "Concept"
            }
        });
    });
});

// Update existing idea
app.put('/api/ideas/:id', (req, res) => {
    const id = req.params.id;
    const { title, description, status } = req.body;
    
    if (!title) {
        return res.status(400).json({
            success: false,
            message: "Title is required"
        });
    }
    
    db.run(
        `UPDATE ideas SET 
         title = COALESCE(?, title), 
         description = COALESCE(?, description), 
         status = COALESCE(?, status) 
         WHERE id = ?`,
        [title, description, status, id],
        function (err) {
            if (err) {
                res.status(400).json({
                    success: false,
                    message: "Database error",
                    error: err.message
                });
                return;
            }
            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Idea not found"
                });
            }
            res.json({
                success: true,
                message: "Idea updated successfully",
                data: { id, title, description, status }
            });
        }
    );
});

// Delete idea
app.delete('/api/ideas/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM ideas WHERE id = ?", id, function (err) {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Database error",
                error: err.message
            });
            return;
        }
        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Idea not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Idea deleted successfully"
        });
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to see the API`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});
