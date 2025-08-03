const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

// Create database connection
const db = new sqlite3.Database("users.db");

// Create users table
db.run(
  `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`,
  (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
      return;
    }
    console.log("Users table created");

    // Add sample users
    addSampleUsers();
  }
);

function addSampleUsers() {
  const users = [
    ["John Doe", "john@example.com", "password123"],
    ["Jane Smith", "jane@example.com", "secret456"],
    ["Bob Johnson", "bob@example.com", "qwerty789"],
  ];

  users.forEach(([name, email, password]) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err.message);
        return;
      }

      db.run(
        "INSERT OR IGNORE INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hash],
        function (err) {
          if (err) {
            console.error("Error inserting user:", err.message);
          } else if (this.changes > 0) {
            console.log(`Added user: ${name}`);
          }
        }
      );
    });
  });

  // Close database after adding users
  setTimeout(() => {
    db.close();
    console.log("Database initialized");
  }, 1000);
}
