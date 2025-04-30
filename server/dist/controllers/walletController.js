"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleExpiredCredits = exports.payWithWallet = exports.getTransactions = void 0;
const models_1 = require("../models");
const index_1 = require("../index");
const sequelize_1 = require("sequelize");
/**
 * Get wallet transactions for the current user
 * @route GET /api/wallet/transactions
 */
const getTransactions = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        // Get transactions with pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const { count, rows: transactions } = await models_1.WalletTransaction.findAndCountAll({
            where: { userId },
            include: [
                {
                    model: models_1.Challenge,
                    as: 'challenge',
                    attributes: ['id', 'name', 'type'],
                    required: false
                }
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });
        // Calculate available balance (non-expired credits)
        // Find transactions with no expiry date or future expiry
        const availableTransactions = await models_1.WalletTransaction.findAll({
            where: {
                userId,
                [sequelize_1.Op.or]: [
                    { expiryDate: undefined },
                    { expiryDate: { [sequelize_1.Op.gt]: new Date() } }
                ]
            },
            attributes: ['amount']
        });
        const availableBalance = availableTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount.toString()), 0);
        res.json({
            transactions,
            totalCount: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            availableBalance
        });
    }
    catch (error) {
        console.error('Error fetching wallet transactions:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getTransactions = getTransactions;
/**
 * Pay for a challenge entry using wallet credits
 * @route POST /api/wallet/pay
 */
const payWithWallet = async (req, res) => {
    try {
        const { challengeId } = req.body;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        // Validate required fields
        if (!challengeId) {
            return res.status(400).json({ message: 'Challenge ID is required' });
        }
        // Find the challenge
        const challenge = await models_1.Challenge.findByPk(challengeId);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        // Get the entry fee
        const entryFee = challenge.entryFee;
        // Check if user has enough non-expired credits
        const availableTransactions = await models_1.WalletTransaction.findAll({
            where: {
                userId,
                [sequelize_1.Op.or]: [
                    { expiryDate: undefined },
                    { expiryDate: { [sequelize_1.Op.gt]: new Date() } }
                ]
            },
            order: [
                ['expiryDate', 'ASC'],
                ['createdAt', 'ASC']
            ]
        });
        const availableBalance = availableTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount.toString()), 0);
        if (availableBalance < entryFee) {
            return res.status(400).json({
                message: 'Insufficient wallet balance',
                availableBalance,
                requiredAmount: entryFee
            });
        }
        // Create a transaction for the challenge entry fee
        const transaction = await models_1.WalletTransaction.create({
            userId,
            amount: -entryFee,
            type: 'challenge_entry',
            reason: `Entry fee for ${challenge.name}`,
            challengeId
        });
        // Find the user to get updated balance
        const user = await models_1.User.findByPk(userId);
        // Notify user about the transaction
        if (index_1.socketService) {
            try {
                index_1.socketService.to(userId.toString()).emit('notification', {
                    title: 'Challenge Entry Fee',
                    message: `${entryFee} credits have been deducted for your entry into ${challenge.name}`,
                    type: 'payment'
                });
            }
            catch (socketError) {
                console.error('Socket notification error:', socketError);
            }
        }
        res.status(201).json({
            message: 'Payment successful',
            transaction,
            newBalance: user === null || user === void 0 ? void 0 : user.walletBalance
        });
    }
    catch (error) {
        console.error('Error processing wallet payment:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.payWithWallet = payWithWallet;
/**
 * Check for expired wallet credits and handle them
 * This should be called by a scheduled job
 */
const handleExpiredCredits = async () => {
    try {
        // Find expired transactions
        const expiredTransactions = await models_1.WalletTransaction.findAll({
            where: {
                expiryDate: { [sequelize_1.Op.lt]: new Date() },
                type: { [sequelize_1.Op.ne]: 'expiry' } // Exclude already processed expiry records
            },
            include: [{ model: models_1.User, as: 'user' }]
        });
        // Process each expired transaction
        for (const transaction of expiredTransactions) {
            // Create a new transaction to record the expiry
            await models_1.WalletTransaction.create({
                userId: transaction.userId,
                amount: -parseFloat(transaction.amount.toString()),
                type: 'expiry',
                reason: `Credits expired from transaction #${transaction.id}`,
                expiryDate: undefined
            });
            // Notify the user about the expiry
            if (index_1.socketService) {
                try {
                    index_1.socketService.to(transaction.userId.toString()).emit('notification', {
                        title: 'Credits Expired',
                        message: `${transaction.amount} credits have expired from your wallet`,
                        type: 'payment'
                    });
                }
                catch (socketError) {
                    console.error('Socket notification error:', socketError);
                }
            }
        }
        return {
            processedCount: expiredTransactions.length,
            success: true
        };
    }
    catch (error) {
        console.error('Error handling expired credits:', error);
        return {
            processedCount: 0,
            success: false,
            error: error.message
        };
    }
};
exports.handleExpiredCredits = handleExpiredCredits;
//# sourceMappingURL=walletController.js.map