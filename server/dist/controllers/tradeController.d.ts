import { Request, Response } from 'express';
/**
 * Get trades for a challenge entry
 * @route GET /api/trades/:challengeEntryId
 */
export declare const getTradesByEntry: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Log a new trade
 * @route POST /api/trades
 * @note This endpoint would typically be called by the cTrader integration service
 */
export declare const logTrade: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
