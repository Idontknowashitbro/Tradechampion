import { Request, Response } from 'express';
/**
 * Enter a challenge
 * @route POST /api/challenge-entries
 */
export declare const enterChallenge: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Get challenge entry by ID
 * @route GET /api/challenge-entries/:id
 */
export declare const getEntryById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Get user's challenge entries
 * @route GET /api/challenge-entries/user
 */
export declare const getUserEntries: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Update cTrader connection status
 * @route PATCH /api/challenge-entries/:id/connect
 */
export declare const updateConnection: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
