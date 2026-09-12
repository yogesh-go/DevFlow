const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const problemRoutes = require("./routes/problemRoutes");
const revisionRoutes = require("./routes/revisionRoutes");
const noteRoutes = require("./routes/noteRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const aiRoutes = require("./routes/aiRoutes");
const contestRoutes = require("./routes/contestRoutes");
const githubRoutes = require("./routes/githubRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/revision", revisionRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/github", githubRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "DevFlow API is running",
  });
});

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`DevFlow server running on port ${PORT}`);
});