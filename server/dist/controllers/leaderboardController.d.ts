import { Request, Response } from 'express';
/**
 * Get leaderboard for a challenge
 * @route GET /api/leaderboards/:challengeId
 */
export declare const getLeaderboard: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Get top performers for a challenge
 * @route GET /api/leaderboards/:challengeId/top/:percentage
 */
export declare const getTopPerformers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Admin endpoint to manually update a challenge leaderboard
 * @route POST /api/leaderboards/:challengeId/update
 */
export declare const updateLeaderboard: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Get disqualified entries for a challenge
 * @route GET /api/leaderboards/:challengeId/disqualified
 */
export declare const getDisqualifiedEntries: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Get entries at risk of disqualification
 * @route GET /api/leaderboards/:challengeId/at-risk/:threshold?
 */
export declare const getEntriesAtRisk: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
