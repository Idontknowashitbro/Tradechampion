import { Request, Response, NextFunction } from 'express';
/**
 * Middleware to validate request using express-validator
 * Checks for validation errors and returns them as a response if any are found
 */
export declare const validate: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
