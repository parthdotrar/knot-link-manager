require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');

// Connect to MongoDB
connectDB();

const app = express();

// ============================================
// Middleware
// ============================================
app.use(helmet()); // Adds security headers to requests
app.use(cors()); // Allows your frontend to talk to your backend
app.use(morgan('dev')); // Logs requests in your terminal (e.g., "GET /api 200")
app.use(express.json()); // Allows Express to understand JSON bodies sent from the frontend

// ============================================
// Routes
// ============================================
// Simple health-check route to test the server
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Knot API is running perfectly!',
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/links', require('./routes/linkRoutes'));

// Catch-all route for requests to unknown endpoints (404)
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// ============================================
// Start Server
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

