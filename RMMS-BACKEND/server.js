import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';

// Load environment variables from .env file
dotenv.config();

const app = express();

// ==========================================
// 1. Middlewares
// ==========================================

// Security HTTP headers
app.use(helmet());

// Cross-Origin Resource Sharing configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // Vite default port
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// HTTP Request Logging (Development mode)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser Middleware (JSON & URL-Encoded Data)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 2. Database Connection
// ==========================================

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// ==========================================
// 3. API Routes Integration
// ==========================================

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'RMMS Backend Server is running smoothly.' });
});

import authRoutes from './routes/authRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);

// ==========================================
// 4. Fallback & Error Handling Middlewares
// ==========================================

// 404 Not Found Handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global Error Handler
// Bottom of server.js
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});
// ==========================================
// 5. Server Setup
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 RMMS Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});