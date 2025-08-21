const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const { googleLogin } = require('./controllers/authControllers');
const app = express();

// ----------------------------
// Middleware
// ----------------------------
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Prevent Cross-Origin-Opener-Policy issues for Google OAuth
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// ----------------------------
// Rate limiting
// ----------------------------
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// ----------------------------
// Database connection
// ----------------------------
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrilink')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ----------------------------
// Routes
// ----------------------------
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const loanRoutes = require('./routes/loanRoutes');
const productRoutes = require('./routes/productRoutes');
const weatherRoutes = require('./routes/weatherRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/products', productRoutes);
app.use('/api/weather', weatherRoutes);

// ----------------------------
// Google OAuth login endpoint
// ----------------------------
app.post('/api/auth/google', googleLogin);

// ----------------------------
// Health check endpoint
// ----------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AgriLink API is running',
    timestamp: new Date().toISOString(),
  });
});

// ----------------------------
// Error handling middleware
// ----------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// ----------------------------
// 404 handler
// ----------------------------
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ----------------------------
// Safe port handling
// ----------------------------
const PORT = process.env.PORT || 50001;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`🚀 AgriLink Backend Server running on port ${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Health check: http://localhost:${port}/api/health`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} is in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  });
}

startServer(PORT);
