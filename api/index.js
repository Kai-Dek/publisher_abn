// api/index.js - Vercel Serverless Function Entry Point
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection with connection pooling for serverless
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('Using cached database connection');
    return cachedDb;
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const opts = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const db = await mongoose.connect(process.env.MONGODB_URI, opts);
    cachedDb = db;
    console.log('MongoDB Connected');
    return db;
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    throw err;
  }
};

// Health check (before routes to test basic functionality)
app.get('/api', (req, res) => {
  res.json({ 
    success: true,
    message: 'Library API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    mongoConnected: mongoose.connection.readyState === 1
  });
});

// Lazy load routes with error handling
let authRoutes, bookRoutes, adminRoutes;

try {
  authRoutes = require('../backend/routes/auth');
  bookRoutes = require('../backend/routes/books');
  adminRoutes = require('../backend/routes/admin');
  
  // Connect to DB before handling routes
  app.use('/api/auth', async (req, res, next) => {
    try {
      await connectDB();
      authRoutes(req, res, next);
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        message: 'Database connection failed',
        error: err.message 
      });
    }
  });

  app.use('/api/books', async (req, res, next) => {
    try {
      await connectDB();
      bookRoutes(req, res, next);
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        message: 'Database connection failed',
        error: err.message 
      });
    }
  });

  app.use('/api/admin', async (req, res, next) => {
    try {
      await connectDB();
      adminRoutes(req, res, next);
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        message: 'Database connection failed',
        error: err.message 
      });
    }
  });
} catch (err) {
  console.error('Error loading routes:', err);
  
  // Fallback routes if main routes fail to load
  app.use('/api/auth', (req, res) => {
    res.status(500).json({ 
      success: false, 
      message: 'Auth routes failed to load',
      error: err.message 
    });
  });
  
  app.use('/api/books', (req, res) => {
    res.status(500).json({ 
      success: false, 
      message: 'Books routes failed to load',
      error: err.message 
    });
  });
  
  app.use('/api/admin', (req, res) => {
    res.status(500).json({ 
      success: false, 
      message: 'Admin routes failed to load',
      error: err.message 
    });
  });
}

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;