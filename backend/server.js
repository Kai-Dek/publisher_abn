const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();

// CORS Configuration - PENTING!
const corsOptions = {
  origin: [
    'http://localhost:8080',
    'https://publisher-abn.vercel.app',
    'https://publisher-abn-*.vercel.app' // untuk preview deployments
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger untuk debugging
app.use((req, res, next) => {
  console.log(`📍 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MongoDB Connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('✅ Using existing database connection');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/library_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Error:', err);
    throw err;
  }
};

// Connect to DB
connectDB();

// Health check - ROOT
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Library API is running!',
    timestamp: new Date().toISOString()
  });
});

// Health check - API
app.get('/api', (req, res) => {
  res.json({ 
    success: true,
    message: 'Library API is running!',
    endpoints: {
      auth: '/api/auth',
      books: '/api/books',
      admin: '/api/admin'
    },
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler - harus return JSON
app.use((req, res, next) => {
  res.status(404).json({ 
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'GET /api',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'GET /api/books',
      'GET /api/books/featured/list',
      'GET /api/books/categories/list',
      'GET /api/books/:id'
    ]
  });
});

// Error Handler - harus return JSON
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Local development
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;