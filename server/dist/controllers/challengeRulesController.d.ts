import { Request, Response } from 'express';
/**
 * Get default challenge rules by type
 * @route GET /api/challenge-rules/defaults/:type
 */
export declare const getDefaultRules: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Validate rules for a challenge entry
 * @route GET /api/challenge-rules/validate/:challengeEntryId
 */
export declare const validateRules: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Update challenge rule settings
 * @route PUT /api/challenge-rules/:challengeId
 */
export declare const updateRules: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Create new challenge with rules
 * @route POST /api/challenge-rules
 */
export declare const createChallengeWithRules: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const challengeRulesController: {
    getDefaultRules: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    validateRules: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    updateRules: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    createChallengeWithRules: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
export default challengeRulesController;
