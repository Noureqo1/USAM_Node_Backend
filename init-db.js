const sqlite3 = require("sqlite3").verbose();

// Create database connection
const db = new sqlite3.Database("./database.sqlite", (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
        throw err;
    } else {
        console.log("Connected to the SQLite database.");
        
        // Create ideas table
        db.run(`CREATE TABLE IF NOT EXISTS ideas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'Concept'
        )`, (err) => {
            if (err) {
                console.error("Error creating table:", err.message);
            } else {
                console.log("Ideas table created or already exists.");
                
                // Check if table is empty and insert initial data
                db.get("SELECT COUNT(*) as count FROM ideas", (err, row) => {
                    if (err) {
                        console.error("Error checking table:", err.message);
                    } else if (row.count === 0) {
                        console.log("Inserting initial data...");
                        
                        const insert = "INSERT INTO ideas (title, description, status) VALUES (?, ?, ?)";
                        
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
