"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundPayment = exports.refreshPaymentStatus = exports.getPaymentById = exports.getAllPayments = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const nowPaymentsService_1 = __importDefault(require("../services/nowPaymentsService"));
/**
 * Get all crypto payments with filtering and pagination
 * @route GET /api/admin/crypto/payments
 */
const getAllPayments = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const offset = (page - 1) * limit;
        // Filter parameters
        const status = req.query.status;
        const userId = req.query.userId;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        // Build where clause
        const where = {};
        if (status) {
            where.status = status;
        }
        if (userId) {
            where.userId = userId;
        }
        if (startDate && endDate) {
            where.createdAt = {
                [sequelize_1.Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }
        else if (startDate) {
            where.createdAt = {
                [sequelize_1.Op.gte]: new Date(startDate)
            };
        }
        else if (endDate) {
            where.createdAt = {
                [sequelize_1.Op.lte]: new Date(endDate)
            };
        }
        // Get payments with pagination
        const { count, rows: payments } = await models_1.CryptoPayment.findAndCountAll({
            where,
            include: [
                {
                    model: models_1.User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });
        res.json({
            payments,
            total: count,
            page,
            totalPages: Math.ceil(count / limit)
        });
    }
    catch (error) {
        console.error('Error fetching crypto payments:', error);
        res.status(500).json({ message: 'Failed to fetch payments' });
    }
};
exports.getAllPayments = getAllPayments;
/**
 * Get payment by ID
 * @route GET /api/admin/crypto/payments/:id
 */
const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        // Find payment by ID
        const payment = await models_1.CryptoPayment.findOne({
            where: { paymentId: id },
            include: [
                {
                    model: models_1.User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json(payment);
    }
    catch (error) {
        console.error('Error fetching payment details:', error);
        res.status(500).json({ message: 'Failed to fetch payment' });
    }
};
exports.getPaymentById = getPaymentById;
/**
 * Refresh payment status from NOWPayments API
 * @route POST /api/admin/crypto/payments/:id/refresh
 */
const refreshPaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        // Find payment in database
        const payment = await models_1.CryptoPayment.findOne({
            where: { paymentId: id },
            include: [
                {
                    model: models_1.User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        // Get latest status from NOWPayments API
        try {
            const paymentStatus = await nowPaymentsService_1.default.getPaymentStatus(id);
            // Update payment status in our database if changed
            if (payment.status !== paymentStatus.payment_status) {
                payment.status = paymentStatus.payment_status;
                // If actual amount paid is available, update it
                if (paymentStatus.amount_received) {
                    payment.actualCryptoAmount = paymentStatus.amount_received;
                }
                await payment.save();
            }
            res.json({
                ...payment.toJSON(),
                remote_status: paymentStatus.payment_status,
                amount_received: paymentStatus.amount_received
            });
        }
        catch (apiError) {
            // If API call fails, return local status and error
            console.error('Error fetching payment status from NOWPayments:', apiError);
            res.status(500).json({
                ...payment.toJSON(),
                error: 'Unable to fetch latest status from payment provider'
            });
        }
    }
    catch (error) {
        console.error('Error refreshing payment status:', error);
        res.status(500).json({ message: 'Failed to refresh payment status' });
    }
};
exports.refreshPaymentStatus = refreshPaymentStatus;
/**
 * Refund a payment (if possible)
 * @route POST /api/admin/crypto/payments/:id/refund
 */
const refundPayment = async (req, res) => {
    try {
        const { id } = req.params;
        // Find payment in database
        const payment = await models_1.CryptoPayment.findOne({
            where: { paymentId: id }
        });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        // Check if payment can be refunded
        if (payment.status !== 'finished') {
            return res.status(400).json({
                message: 'Only finished payments can be refunded',
                current_status: payment.status
            });
        }
        // In real implementation, this would call the NOWPayments API to request a refund
        // This is a placeholder for demonstration purposes
        try {
            // Simulate refund process
            // In production, this would be an actual API call to NOWPayments
            const refundResponse = {
                refund_id: `refund_${Date.now()}`,
                status: 'processing'
            };
            // Update payment status to refunded
            payment.status = 'refunded';
            await payment.save();
            res.json({
                ...payment.toJSON(),
                refund: refundResponse
            });
        }
        catch (apiError) {
            console.error('Error refunding payment:', apiError);
            res.status(500).json({
                message: 'Failed to process refund',
                error: apiError.message || 'Unknown error'
            });
        }
    }
    catch (error) {
        console.error('Error handling refund:', error);
        res.status(500).json({ message: 'Failed to process refund request' });
    }
};
exports.refundPayment = refundPayment;
//# sourceMappingURL=cryptoPaymentAdminController.js.map