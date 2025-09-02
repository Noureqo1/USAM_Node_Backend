const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

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
        message: 'Skills API is running!',
        version: '1.0.0',
        endpoints: [
            'GET /',
            'GET /api/skills',
            'GET /api/skills/:id',
            'GET /api/skills/category/:category'
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
