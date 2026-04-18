import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';

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

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.error('Error: MONGODB_URL is not defined in environment variables');
  if (process.env.NODE_ENV !== 'production') process.exit(1);
}

if (MONGODB_URL) {
  // Log connection attempt (hiding password)
  const maskedUrl = MONGODB_URL.replace(/:([^:@]{1,})@/, ':****@');
  console.log(`Attempting to connect to: ${maskedUrl}`);

  mongoose.connect(MONGODB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
}

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
