import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * Middleware to validate request using express-validator
 * Checks for validation errors and returns them as a response if any are found
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Format errors for a cleaner response
    const formattedErrors = errors.array().map(error => ({
      field: 'param' in error ? error.param : 'unknown',
      message: error.msg
    }));
    
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: formattedErrors 
    });
  }
  
  next();
}; 