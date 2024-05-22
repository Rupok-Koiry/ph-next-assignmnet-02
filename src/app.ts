// app.ts
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import AppError from './utils/appError';
import globalErrorHandler from './controllers/errorController';
import productRouter from './routes/productRoutes';
import orderRouter from './routes/orderRoutes';

// Create express app
const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
app.options('*', cors());

// Parse JSON and URL-encoded data and cookies
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

// Route handlers
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

// Handle all undefined routes


// Global error handling middleware
app.use(globalErrorHandler);

export default app;
