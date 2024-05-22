// Import statements
import { Request, Response, NextFunction } from 'express';

// Error response functions
const sendError = (err: any, req: Request, res: Response): void => {
  res.status(err.statusCode!).json({
    success: false,
    message: err.message,
  });
};

// Main error handling middleware
const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  // Set default error status code and status
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  sendError(err, req, res);
};

// Export the middleware
export default globalErrorHandler;
