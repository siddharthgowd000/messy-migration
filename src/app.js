const express = require("express");
const db = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const {
  globalErrorHandler,
  notFoundHandler,
} = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database connection
const initializeDatabase = async () => {
  try {
    await db.connect();
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
};

// Routes
app.use("/", userRoutes);

// Error handling middleware
app.use("*", notFoundHandler);
app.use(globalErrorHandler);

// Start server
const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, "localhost", () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Closing database connection...`);
  try {
    await db.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Start the application
startServer();
