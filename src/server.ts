import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Server } from 'http';
import app from './app';

// Handling uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Load environment variables
dotenv.config({ path: path.join((process.cwd(), '.env')) });

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE as string)
  .then(() => console.log('DB connection successful!'))
  .catch((err: Error) => {
    console.error('DB connection error:', err.message);
    process.exit(1);
  });

// Start the server
const port = process.env.PORT || 8000;
const server: Server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM signal
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
