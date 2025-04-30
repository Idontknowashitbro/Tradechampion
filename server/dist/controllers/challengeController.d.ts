import { Request, Response } from 'express';
/**
 * Get all active challenges
 * @route GET /api/challenges
 */
export declare const getChallenges: (req: Request, res: Response) => Promise<void>;
/**
 * Get challenge by ID
 * @route GET /api/challenges/:id
 */
export declare const getChallengeById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Create a new challenge (admin only)
 * @route POST /api/challenges
 */
export declare const createChallenge: (req: Request, res: Response) => Promise<void>;
/**
 * Update a challenge (admin only)
 * @route PUT /api/challenges/:id
 */
export declare const updateChallenge: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Delete a challenge (admin only)
 * @route DELETE /api/challenges/:id
 */
export declare const deleteChallenge: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Update challenge status (admin only)
 * @route PATCH /api/challenges/:id/status
 */
export declare const updateChallengeStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
