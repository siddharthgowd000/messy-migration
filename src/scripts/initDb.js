const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Create database connection
const db = new sqlite3.Database('users.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    } else {
        console.log('Connected to SQLite database');
    }
});

async function initializeDatabase() {
    try {
        // Create users table with improved schema
        await new Promise((resolve, reject) => {
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        console.log('Users table created successfully');

        // Hash passwords for sample data
        const saltRounds = 10;
        const password1 = await bcrypt.hash('password123', saltRounds);
        const password2 = await bcrypt.hash('secret456', saltRounds);
        const password3 = await bcrypt.hash('qwerty789', saltRounds);

        // Insert sample data with hashed passwords
        const sampleUsers = [
            ['John Doe', 'john@example.com', password1],
            ['Jane Smith', 'jane@example.com', password2],
            ['Bob Johnson', 'bob@example.com', password3]
        ];

        for (const [name, email, password] of sampleUsers) {
            await new Promise((resolve, reject) => {
                db.run(
                    'INSERT OR IGNORE INTO users (name, email, password) VALUES (?, ?, ?)',
                    [name, email, password],
                    function(err) {
                        if (err) reject(err);
                        else {
                            if (this.changes > 0) {
                                console.log(`User ${name} created with ID: ${this.lastID}`);
                            } else {
                                console.log(`User ${name} already exists`);
                            }
                            resolve();
                        }
                    }
                );
            });
        }

        console.log('Database initialized with sample data');
        console.log('Sample users:');
        console.log('- john@example.com / password123');
        console.log('- jane@example.com / secret456');
        console.log('- bob@example.com / qwerty789');

    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        // Close database connection
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('Database connection closed');
            }
        });
    }
}

// Run initialization
initializeDatabase(); 