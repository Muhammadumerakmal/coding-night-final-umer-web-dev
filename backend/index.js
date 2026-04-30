import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import requestRoutes from './routes/requests.js';
import userRoutes from './routes/users.js';
import analyticsRoutes from './routes/analytics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // Try loading from current directory first
dotenv.config({ path: path.join(__dirname, '../.env') }); // Then try the parent directory

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

console.log('Environment variables check:');
console.log(`- PORT: ${PORT}`);
console.log(`- JWT_SECRET: ${JWT_SECRET ? 'Defined' : 'UNDEFINED'}`);
console.log(`- MONGODB_URL: ${process.env.MONGODB_URL ? 'Defined' : 'UNDEFINED'}`);

if (!JWT_SECRET && process.env.NODE_ENV !== 'production') {
  console.error('Error: JWT_SECRET is not defined in .env file');
  // process.exit(1); // Don't exit immediately, let the check below handle it
}

// Middleware — allow frontend origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://coding-night-final-umer.vercel.app',
  'https://coding-night-final-umer-web-dev.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile/curl) or known origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// Request logging middleware (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// MongoDB Connection
const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.error('Error: MONGODB_URL is not defined in environment variables');
  if (process.env.NODE_ENV !== 'production') process.exit(1);
}

if (MONGODB_URL) {
  const maskedUrl = MONGODB_URL.replace(/:([^:@]{1,})@/, ':****@');
  console.log(`Connecting to MongoDB: ${maskedUrl}`);

  mongoose.connect(MONGODB_URL, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      // Don't crash immediately — let health check handle it
    });
}

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  };
  res.json(health);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message 
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});
