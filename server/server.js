const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route files
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const questionRoutes = require('./routes/questionRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const mockSessionRoutes = require('./routes/mockSessionRoutes');
const userRoutes = require('./routes/userRoutes');
const aiMentorRoutes = require('./routes/aiMentorRoutes');

// Connect to Database
connectDB();

const app = express();

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible API usage
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://prep-mate-jade.vercel.app',
  'https://prepmate-59xn.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    // Exact match in allowedOrigins list
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // Allow all vercel.app subdomains (production & preview deployments)
    if (origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }

    // Allow local network IP or development ports
    if (
      process.env.NODE_ENV !== 'production' ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }

    callback(null, true); // Fallback permissive to avoid client blocking
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['Set-Cookie'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser for JWT in cookies
app.use(cookieParser());

// Sanitize data against NoSQL query injection
app.use(mongoSanitize());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PrepMate API Server is healthy and running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/mock-sessions', mockSessionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai-mentor', aiMentorRoutes);

// Root route welcome message
app.get('/', (req, res) => {
  res.send('Welcome to PrepMate API. Please navigate to /api/health to inspect status.');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 PrepMate Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`💥 Unhandled Rejection: ${err.message}`);
  // server.close(() => process.exit(1));
});

module.exports = app;
