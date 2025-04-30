import { Request, Response } from 'express';
/**
 * Get all crypto payments with filtering and pagination
 * @route GET /api/admin/crypto/payments
 */
export declare const getAllPayments: (req: Request, res: Response) => Promise<void>;
/**
 * Get payment by ID
 * @route GET /api/admin/crypto/payments/:id
 */
export declare const getPaymentById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Refresh payment status from NOWPayments API
 * @route POST /api/admin/crypto/payments/:id/refresh
 */
export declare const refreshPaymentStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Refund a payment (if possible)
 * @route POST /api/admin/crypto/payments/:id/refund
 */
export declare const refundPayment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
