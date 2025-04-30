import { Request, Response, NextFunction } from 'express';
/**
 * Middleware to validate if the authenticated user is an admin
 */
export declare const validateAdmin: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
