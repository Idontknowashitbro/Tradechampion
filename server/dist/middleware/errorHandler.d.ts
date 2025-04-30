import { Request, Response, NextFunction } from 'express';
export declare class ApiError extends Error {
    statusCode: number;
    errors?: any[];
    constructor(message: string, statusCode: number, errors?: any[]);
}
export declare const notFound: (req: Request, res: Response, next: NextFunction) => void;
export declare const errorHandler: (err: ApiError | Error, req: Request, res: Response, next: NextFunction) => void;
export declare const createError: (message: string, statusCode: number, errors?: any[]) => ApiError;
