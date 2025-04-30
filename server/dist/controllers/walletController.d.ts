import { Request, Response } from 'express';
/**
 * Get wallet transactions for the current user
 * @route GET /api/wallet/transactions
 */
export declare const getTransactions: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Pay for a challenge entry using wallet credits
 * @route POST /api/wallet/pay
 */
export declare const payWithWallet: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Check for expired wallet credits and handle them
 * This should be called by a scheduled job
 */
export declare const handleExpiredCredits: () => Promise<{
    processedCount: number;
    success: boolean;
    error?: undefined;
} | {
    processedCount: number;
    success: boolean;
    error: string;
}>;
