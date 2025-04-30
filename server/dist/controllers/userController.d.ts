import { Request, Response } from 'express';
/**
 * Get all users (admin only)
 * @route GET /api/users
 */
export declare const getUsers: (req: Request, res: Response) => Promise<void>;
/**
 * Get user by ID (admin only or current user)
 * @route GET /api/users/:id
 */
export declare const getUserById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Get user profile (current user only)
 * @route GET /api/users/profile
 */
export declare const getUserProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Update user (admin only)
 * @route PUT /api/users/:id
 */
export declare const updateUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Ban/unban user (admin only)
 * @route PATCH /api/users/:id/status
 */
export declare const updateUserStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Update user wallet balance (admin only)
 * @route PATCH /api/users/:id/wallet
 */
export declare const updateUserWallet: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
