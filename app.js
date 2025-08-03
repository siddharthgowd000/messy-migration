const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection with proper error handling
let db;
try {
  db = new sqlite3.Database("users.db", (err) => {
    if (err) {
      console.error("Error opening database:", err.message);
      process.exit(1);
    } else {
      console.log("Connected to SQLite database");
    }
  });
} catch (error) {
  console.error("Failed to connect to database:", error);
  process.exit(1);
}

// Validation middleware
const validateUser = [
  body("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

// Database helper functions
const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

// Routes

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "User Management System",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await dbQuery(
      "SELECT id, name, email, created_at FROM users"
    );
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch users",
    });
  }
});

// Search users
app.get("/users/search", async (req, res) => {
  try {
    const q = req.query.q?.trim();

    if (!q) {
      return res.status(400).json({
        error: "Missing search parameter",
        message: "Please provide a 'q' parameter to search",
      });
    }

    if (q.length < 2) {
      return res.status(400).json({
        error: "Invalid search term",
        message: "Search term must be at least 2 characters long",
      });
    }

    const users = await dbQuery(
      "SELECT id, name, email, created_at FROM users WHERE name LIKE ?",
      [`%${q}%`]
    );

    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
      searchTerm: q,
    });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to search users",
    });
  }
});

// Get user by ID
app.get("/users/:user_id", async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id);

    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({
        error: "Invalid user ID",
        message: "User ID must be a positive integer",
      });
    }

    const user = await dbGet(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (user) {
      res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      res.status(404).json({
        error: "User not found",
        message: `No user found with ID ${userId}`,
      });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch user",
    });
  }
});

// Create new user
app.post("/users", validateUser, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await dbGet("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (existingUser) {
      return res.status(409).json({
        error: "Email already exists",
        message: "A user with this email already exists",
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await dbRun(
      "INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, new Date().toISOString()]
    );

    console.log("User created successfully with ID:", result.lastID);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { id: result.lastID, name, email },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to create user",
    });
  }
});

// Update user
app.put(
  "/users/:user_id",
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Valid email is required"),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const userId = parseInt(req.params.user_id);
      const { name, email } = req.body;

      if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({
          error: "Invalid user ID",
          message: "User ID must be a positive integer",
        });
      }

      if (!name && !email) {
        return res.status(400).json({
          error: "No data provided",
          message: "At least one field (name or email) must be provided",
        });
      }

      // Check if user exists
      const existingUser = await dbGet("SELECT id FROM users WHERE id = ?", [
        userId,
      ]);
      if (!existingUser) {
        return res.status(404).json({
          error: "User not found",
          message: `No user found with ID ${userId}`,
        });
      }

      // Check if email is being updated and if it already exists
      if (email) {
        const emailExists = await dbGet(
          "SELECT id FROM users WHERE email = ? AND id != ?",
          [email, userId]
        );
        if (emailExists) {
          return res.status(409).json({
            error: "Email already exists",
            message: "A user with this email already exists",
          });
        }
      }

      // Build update query dynamically
      const updates = [];
      const params = [];

      if (name) {
        updates.push("name = ?");
        params.push(name);
      }
      if (email) {
        updates.push("email = ?");
        params.push(email);
      }

      params.push(userId);
      const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;

      const result = await dbRun(query, params);

      if (result.changes > 0) {
        res.status(200).json({
          success: true,
          message: "User updated successfully",
        });
      } else {
        res.status(404).json({
          error: "User not found",
          message: `No user found with ID ${userId}`,
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to update user",
      });
    }
  }
);

// Delete user
app.delete("/users/:user_id", async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id);

    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({
        error: "Invalid user ID",
        message: "User ID must be a positive integer",
      });
    }

    const result = await dbRun("DELETE FROM users WHERE id = ?", [userId]);

    if (result.changes > 0) {
      console.log(`User ${userId} deleted successfully`);
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } else {
      res.status(404).json({
        error: "User not found",
        message: `No user found with ID ${userId}`,
      });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to delete user",
    });
  }
});

// Login
app.post(
  "/users/login",
  validateLogin,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await dbGet(
        "SELECT id, name, email, password FROM users WHERE email = ?",
        [email]
      );

      if (!user) {
        return res.status(401).json({
          error: "Authentication failed",
          message: "Invalid email or password",
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        res.status(200).json({
          success: true,
          message: "Login successful",
          data: {
            user_id: user.id,
            name: user.name,
            email: user.email,
          },
        });
      } else {
        res.status(401).json({
          error: "Authentication failed",
          message: "Invalid email or password",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to process login",
      });
    }
  }
);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({
    error: "Internal server error",
    message: "An unexpected error occurred",
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nReceived SIGINT. Closing database connection...");
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed");
    }
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("\nReceived SIGTERM. Closing database connection...");
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed");
    }
    process.exit(0);
  });
});
