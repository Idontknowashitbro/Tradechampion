import { Request, Response } from 'express';
/**
 * Get user's crypto wallets
 * @route GET /api/crypto/wallets
 */
export declare const getUserWallets: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Add a new crypto wallet for user
 * @route POST /api/crypto/wallets
 */
export declare const addWallet: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Update an existing crypto wallet
 * @route PUT /api/crypto/wallets/:id
 */
export declare const updateWallet: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Delete a crypto wallet
 * @route DELETE /api/crypto/wallets/:id
 */
export declare const deleteWallet: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Set a wallet as default
 * @route PUT /api/crypto/wallets/:id/default
 */
export declare const setDefaultWallet: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
