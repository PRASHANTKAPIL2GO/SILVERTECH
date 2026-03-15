require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// ─── Route Imports ────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const progressRoutes = require('./routes/progressRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const mentorRoutes = require('./routes/mentorRoutes');

// ─── Middleware Imports ───────────────────────────────────
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// ─── App Initialisation ───────────────────────────────────
const app = express();

// Connect to MongoDB
connectDB();

// ─── Core Middleware ──────────────────────────────────────

// Enable CORS — tighten 'origin' in production to your frontend domain
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ───────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/mentor', mentorRoutes);

// ─── Health Check ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SilverTech API is running.',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── Error Handling ───────────────────────────────────────
// 404 handler — must come after all routes
app.use(notFound);

// Global error handler — must be last middleware
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SilverTech API running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;
