import { Request, Response, NextFunction } from 'express';

// Interface for ApiError to extend the Error class
export class ApiError extends Error {
  statusCode: number;
  errors?: any[];
  
  constructor(message: string, statusCode: number, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    
    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// Not found error handler - to be used when route is not found
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

// Global error handler
export const errorHandler = (err: ApiError | Error, req: Request, res: Response, next: NextFunction) => {
  // Check if error is an instance of ApiError
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || 'Something went wrong';
  const errors = err instanceof ApiError ? err.errors : undefined;
  
  // Log error for server-side debugging
  console.error(`[ERROR] ${statusCode} - ${message}`);
  if (err.stack) {
    console.error(err.stack);
  }
  
  // Send standardized error response
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// Helper function to create errors in controllers
export const createError = (message: string, statusCode: number, errors?: any[]): ApiError => {
  return new ApiError(message, statusCode, errors);
}; 