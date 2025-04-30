import { Request, Response } from 'express';
/**
 * Get available cryptocurrencies for payment
 * @route GET /api/crypto/currencies
 */
export declare const getAvailableCurrencies: (req: Request, res: Response) => Promise<void>;
/**
 * Get estimated crypto amount for a fiat amount
 * @route GET /api/crypto/estimate
 */
export declare const getEstimatedPrice: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Create a crypto payment
 * @route POST /api/crypto/payment
 */
export declare const createPayment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Get payment status
 * @route GET /api/crypto/payment/:id
 */
export declare const getPaymentStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Get user's payment history
 * @route GET /api/crypto/payments
 */
export declare const getPaymentHistory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Handle webhook from NOWPayments for payment updates
 * @route POST /api/crypto/webhook
 */
export declare const handleWebhook: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
