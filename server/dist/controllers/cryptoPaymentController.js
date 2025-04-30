"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.getPaymentHistory = exports.getPaymentStatus = exports.createPayment = exports.getEstimatedPrice = exports.getAvailableCurrencies = void 0;
const uuid_1 = require("uuid");
const models_1 = require("../models");
const nowPaymentsService_1 = __importDefault(require("../services/nowPaymentsService"));
const index_1 = require("../index");
// Base URL for callbacks
const BASE_URL = process.env.BASE_URL || 'http://localhost:5002';
/**
 * Get available cryptocurrencies for payment
 * @route GET /api/crypto/currencies
 */
const getAvailableCurrencies = async (req, res) => {
    try {
        const currencies = await nowPaymentsService_1.default.getAvailableCurrencies();
        res.json(currencies);
    }
    catch (error) {
        console.error('Error fetching available currencies:', error);
        res.status(500).json({ message: 'Failed to fetch available currencies' });
    }
};
exports.getAvailableCurrencies = getAvailableCurrencies;
/**
 * Get estimated crypto amount for a fiat amount
 * @route GET /api/crypto/estimate
 */
const getEstimatedPrice = async (req, res) => {
    try {
        const { amount, from_currency = 'usd', to_currency } = req.query;
        if (!amount || !to_currency) {
            return res.status(400).json({ message: 'Amount and to_currency are required' });
        }
        const estimate = await nowPaymentsService_1.default.estimatePrice(parseFloat(amount), from_currency, to_currency);
        res.json(estimate);
    }
    catch (error) {
        console.error('Error estimating price:', error);
        res.status(500).json({ message: 'Failed to estimate price' });
    }
};
exports.getEstimatedPrice = getEstimatedPrice;
/**
 * Create a crypto payment
 * @route POST /api/crypto/payment
 */
const createPayment = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { amount, currency = 'usd', pay_currency, order_description, challengeId, success_url, cancel_url } = req.body;
        if (!amount) {
            return res.status(400).json({ message: 'Amount is required' });
        }
        // Generate unique order ID
        const orderId = `order_${(0, uuid_1.v4)()}`;
        // Default callback URL for IPN notifications
        const callbackUrl = `${BASE_URL}/api/crypto/webhook`;
        // Create payment request
        const paymentData = {
            price_amount: parseFloat(amount),
            price_currency: currency,
            pay_currency: pay_currency,
            ipn_callback_url: callbackUrl,
            order_id: orderId,
            order_description: order_description || `Wallet deposit of ${amount} ${currency.toUpperCase()}`,
            success_url: success_url || `${BASE_URL}/payment/success`,
            cancel_url: cancel_url || `${BASE_URL}/payment/cancel`
        };
        // Choose between direct payment or invoice based on implementation choice
        // For better UX, we'll use invoice which provides a hosted payment page
        const useInvoice = true;
        let paymentResponse;
        let invoiceId;
        let invoiceUrl;
        if (useInvoice) {
            // Create invoice (hosted payment page)
            const invoiceResponse = await nowPaymentsService_1.default.createInvoice(paymentData);
            invoiceId = invoiceResponse.id;
            invoiceUrl = invoiceResponse.invoice_url;
            // Get payment details
            paymentResponse = await nowPaymentsService_1.default.getPaymentStatus(invoiceId);
        }
        else {
            // Direct payment (customer needs to manually send crypto)
            paymentResponse = await nowPaymentsService_1.default.createPayment(paymentData);
        }
        // Save payment information to database
        const payment = await models_1.CryptoPayment.create({
            userId,
            challengeId: challengeId || null,
            paymentId: paymentResponse.payment_id,
            invoiceId: invoiceId || null,
            amount: paymentResponse.price_amount,
            cryptoCurrency: pay_currency || paymentResponse.pay_currency || 'btc',
            paymentAddress: paymentResponse.pay_address,
            status: paymentResponse.payment_status,
            description: paymentResponse.order_description || '',
            callbackUrl,
            successUrl: success_url || `${BASE_URL}/payment/success`,
            cancelUrl: cancel_url || `${BASE_URL}/payment/cancel`,
        });
        // Return payment information to client
        res.status(201).json({
            ...payment.toJSON(),
            invoice_url: invoiceUrl,
            payment_address: paymentResponse.pay_address
        });
    }
    catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ message: 'Failed to create payment' });
    }
};
exports.createPayment = createPayment;
/**
 * Get payment status
 * @route GET /api/crypto/payment/:id
 */
const getPaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        // Find payment in database
        const payment = await models_1.CryptoPayment.findOne({
            where: {
                paymentId: id,
                userId
            }
        });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        // Check latest status from NOWPayments API
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
            // If API call fails, return local status
            console.error('Error fetching payment status from NOWPayments:', apiError);
            res.json({
                ...payment.toJSON(),
                error: 'Unable to fetch latest status from payment provider'
            });
        }
    }
    catch (error) {
        console.error('Error fetching payment status:', error);
        res.status(500).json({ message: 'Failed to fetch payment status' });
    }
};
exports.getPaymentStatus = getPaymentStatus;
/**
 * Get user's payment history
 * @route GET /api/crypto/payments
 */
const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        // Get payments with pagination
        const { count, rows: payments } = await models_1.CryptoPayment.findAndCountAll({
            where: { userId },
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
        console.error('Error fetching payment history:', error);
        res.status(500).json({ message: 'Failed to fetch payment history' });
    }
};
exports.getPaymentHistory = getPaymentHistory;
/**
 * Handle webhook from NOWPayments for payment updates
 * @route POST /api/crypto/webhook
 */
const handleWebhook = async (req, res) => {
    try {
        // Get the signature from the headers
        const signature = req.headers['x-nowpayments-sig'];
        if (!signature) {
            console.error('Missing signature in webhook request');
            return res.status(400).json({ message: 'Missing signature' });
        }
        // Verify webhook signature
        const isValidSignature = nowPaymentsService_1.default.verifyWebhookSignature(req.body, signature);
        if (!isValidSignature) {
            console.error('Invalid webhook signature');
            return res.status(403).json({ message: 'Invalid signature' });
        }
        // Process webhook data
        const { payment_id, payment_status, pay_address, price_amount, price_currency, pay_amount, actually_paid, pay_currency, order_id, order_description } = req.body;
        // Find the payment in our database
        const payment = await models_1.CryptoPayment.findOne({
            where: { paymentId: payment_id },
            include: [{ model: models_1.User, as: 'user' }]
        });
        if (!payment) {
            console.error(`Payment with ID ${payment_id} not found in database`);
            return res.status(404).json({ message: 'Payment not found' });
        }
        // Update payment status and details
        payment.status = payment_status;
        payment.actualCryptoAmount = actually_paid || pay_amount;
        await payment.save();
        // If payment is finished, create a wallet transaction to add funds
        if (payment_status === 'finished') {
            // Only add funds if it hasn't been added already (avoid duplicates)
            const existingTransaction = await models_1.WalletTransaction.findOne({
                where: {
                    reason: `Crypto payment #${payment_id}`,
                    userId: payment.userId
                }
            });
            if (!existingTransaction) {
                await models_1.WalletTransaction.create({
                    userId: payment.userId,
                    amount: price_amount,
                    type: payment.challengeId ? 'challenge_entry' : 'deposit',
                    reason: `Crypto payment #${payment_id}`,
                    challengeId: payment.challengeId || null
                });
                // Notify user about successful payment
                if (index_1.socketService && payment.user) {
                    index_1.socketService.to(payment.userId).emit('notification', {
                        title: 'Payment Successful',
                        message: `Your payment of ${price_amount} ${price_currency.toUpperCase()} has been completed successfully.`,
                        type: 'success'
                    });
                }
            }
        }
        else if (payment_status === 'failed' || payment_status === 'expired') {
            // Notify user about failed payment
            if (index_1.socketService && payment.user) {
                index_1.socketService.to(payment.userId).emit('notification', {
                    title: 'Payment Failed',
                    message: `Your payment of ${price_amount} ${price_currency.toUpperCase()} has ${payment_status}.`,
                    type: 'error'
                });
            }
        }
        // Send success response
        res.status(200).json({ status: 'success' });
    }
    catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ message: 'Error processing webhook' });
    }
};
exports.handleWebhook = handleWebhook;
//# sourceMappingURL=cryptoPaymentController.js.map