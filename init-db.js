const sqlite3 = require("sqlite3").verbose();

// Create database connection
const db = new sqlite3.Database("./database.sqlite", (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
        throw err;
    } else {
        console.log("Connected to the SQLite database.");
        
        // Create users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error("Error creating users table:", err.message);
            } else {
                console.log("Users table created or already exists.");
            }
        });
        
        // Create ideas table with userId foreign key
        db.run(`CREATE TABLE IF NOT EXISTS ideas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'Concept',
            userId INTEGER,
            createdAt DATETIME,
            FOREIGN KEY (userId) REFERENCES users (id)
        )`, (err) => {
            if (err) {
                console.error("Error creating ideas table:", err.message);
            } else {
                console.log("Ideas table created or already exists.");
                
                // Add userId column to existing ideas table if it doesn't exist
                db.run(`ALTER TABLE ideas ADD COLUMN userId INTEGER`, (err) => {
                    if (err && !err.message.includes("duplicate column")) {
                        console.error("Error adding userId column:", err.message);
                    } else if (!err) {
                        console.log("Added userId column to ideas table.");
                    }
                });
                
                // Add createdAt column to existing ideas table if it doesn't exist
                db.run(`ALTER TABLE ideas ADD COLUMN createdAt DATETIME`, (err) => {
                    if (err && !err.message.includes("duplicate column")) {
                        console.error("Error adding createdAt column:", err.message);
                    } else if (!err) {
                        console.log("Added createdAt column to ideas table.");
                        
                        // Update existing rows with current timestamp
                        db.run(`UPDATE ideas SET createdAt = CURRENT_TIMESTAMP WHERE createdAt IS NULL`, (updateErr) => {
                            if (updateErr) {
                                console.error("Error updating createdAt values:", updateErr.message);
                            } else {
                                console.log("Updated existing ideas with createdAt timestamps.");
                            }
                        });
                    }
                });
                
                // Check if table is empty and insert initial data
                db.get("SELECT COUNT(*) as count FROM ideas", (err, row) => {
                    if (err) {
                        console.error("Error checking table:", err.message);
                    } else if (row.count === 0) {
                        console.log("Inserting initial data...");
                        
                        const insert = "INSERT INTO ideas (title, description, status, createdAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP)";
                        
                        // Insert sample ideas
                        const sampleIdeas = [
                            ["Eco-Friendly Water Bottle", "A smart water bottle that tracks hydration and suggests refill stations.", "Concept"],
                            ["AI-Powered Study Buddy", "An application that uses AI to create personalized study plans and quizzes.", "In Progress"],
                            ["Virtual Reality Fitness App", "An immersive VR application for home workouts with real-time coaching.", "Planning"],
                            ["Smart Home Energy Manager", "IoT system to optimize home energy consumption and reduce costs.", "Concept"],
                            ["Community Garden Platform", "A platform connecting people to share gardening spaces and knowledge.", "Development"]
                        ];
                        
                        sampleIdeas.forEach(([title, description, status]) => {
                            db.run(insert, [title, description, status], function(err) {
                                if (err) {
                                    console.error("Error inserting data:", err.message);
                                } else {
                                    console.log(`Inserted idea: ${title} (ID: ${this.lastID})`);
                                }
                            });
                        });
                    } else {
                        console.log(`Table already contains ${row.count} ideas.`);
                    }
                });
            }
        });
    }
});

// Close database connection after initialization
setTimeout(() => {
    db.close((err) => {
        if (err) {
            console.error("Error closing database:", err.message);
        } else {
            console.log("Database initialization complete. Connection closed.");
        }
    });
}, 1000);

module.exports = db;
