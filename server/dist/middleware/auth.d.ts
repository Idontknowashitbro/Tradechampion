import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            userId?: string;
            userRole?: string;
        }
    }
}
/**
 * Authentication middleware
 * Verifies JWT token and sets userId in the request
 */
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
/**
 * Admin authorization middleware
 * Checks if the authenticated user has admin role
 */
export declare const isAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const generateToken: (userId: string) => string;
export declare const authorizeAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
