"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logTrade = exports.getTradesByEntry = void 0;
const models_1 = require("../models");
const index_1 = require("../index");
const leaderboardService_1 = __importDefault(require("../services/leaderboardService"));
/**
 * Get trades for a challenge entry
 * @route GET /api/trades/:challengeEntryId
 */
const getTradesByEntry = async (req, res) => {
    var _a;
    try {
        const { challengeEntryId } = req.params;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        // Validate challengeEntryId
        if (!challengeEntryId) {
            return res.status(400).json({ message: 'Challenge entry ID is required' });
        }
        // Find the challenge entry
        const entry = await models_1.ChallengeEntry.findByPk(challengeEntryId);
        if (!entry) {
            return res.status(404).json({ message: 'Challenge entry not found' });
        }
        // Check if the user owns this entry or is an admin
        if (entry.userId !== userId && ((_a = req.user) === null || _a === void 0 ? void 0 : _a.status) !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        // Get trades with pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const { count, rows: trades } = await models_1.Trade.findAndCountAll({
            where: { challengeEntryId },
            order: [['exitTime', 'DESC']],
            limit,
            offset
        });
        res.json({
            trades,
            totalCount: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    }
    catch (error) {
        console.error('Error fetching trades:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getTradesByEntry = getTradesByEntry;
/**
 * Log a new trade
 * @route POST /api/trades
 * @note This endpoint would typically be called by the cTrader integration service
 */
const logTrade = async (req, res) => {
    try {
        const { challengeEntryId, tradeId, symbol, lotSize, entryTime, exitTime, pnl } = req.body;
        // Validate required fields
        if (!challengeEntryId || !tradeId || !symbol || !lotSize || !entryTime || !exitTime || pnl === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // Find the challenge entry
        const entry = await models_1.ChallengeEntry.findByPk(challengeEntryId, {
            include: [{ model: models_1.Challenge, as: 'challenge' }]
        });
        if (!entry) {
            return res.status(404).json({ message: 'Challenge entry not found' });
        }
        // Check if trade already exists
        const existingTrade = await models_1.Trade.findOne({
            where: {
                challengeEntryId,
                tradeId
            }
        });
        if (existingTrade) {
            return res.status(400).json({ message: 'Trade with this ID already exists' });
        }
        // Create the trade
        const trade = await models_1.Trade.create({
            challengeEntryId,
            tradeId,
            symbol,
            lotSize,
            entryTime,
            exitTime,
            pnl
        });
        // Update entry metrics
        await updateEntryMetrics(entry);
        // Notify the user about the trade
        index_1.socketService.to(entry.userId.toString()).emit('tradeClosed', {
            entryId: entry.id,
            tradeId: trade.id,
            symbol: trade.symbol,
            pnl: trade.pnl,
            exitTime: trade.exitTime
        });
        // Update the leaderboard
        await leaderboardService_1.default.updateLeaderboardAfterTrade(entry.id);
        res.status(201).json({
            message: 'Trade logged successfully',
            trade
        });
    }
    catch (error) {
        console.error('Error logging trade:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.logTrade = logTrade;
/**
 * Update entry metrics based on trades
 * This is called after a trade is added
 */
const updateEntryMetrics = async (entry) => {
    try {
        // Get all trades for this entry
        const trades = await models_1.Trade.findAll({
            where: { challengeEntryId: entry.id }
        });
        const challenge = entry.challenge;
        if (!challenge) {
            throw new Error('Challenge not found for entry');
        }
        // Calculate metrics
        const initialBalance = challenge.initialBalance;
        let currentBalance = initialBalance;
        let maxBalance = initialBalance;
        let minBalance = initialBalance;
        // Calculate PnL and drawdown
        trades.forEach(trade => {
            currentBalance += trade.pnl;
            maxBalance = Math.max(maxBalance, currentBalance);
            minBalance = Math.min(minBalance, currentBalance);
        });
        const pnlPercentage = ((currentBalance - initialBalance) / initialBalance) * 100;
        const drawdownPercentage = ((maxBalance - minBalance) / maxBalance) * 100;
        // Calculate average risk per trade (simplified)
        const avgRiskPerTrade = trades.length > 0
            ? trades.reduce((sum, trade) => sum + Math.abs(trade.pnl), 0) / trades.length / initialBalance * 100
            : 0;
        // Update entry metrics
        const metrics = {
            pnlPercentage,
            drawdownPercentage,
            tradeCount: trades.length,
            avgRiskPerTrade
        };
        await entry.update({ metrics });
        // Send metrics update to the user
        index_1.socketService.to(entry.userId.toString()).emit('metricsUpdate', {
            entryId: entry.id,
            metrics
        });
        // Check for disqualification
        if (drawdownPercentage > challenge.maxDrawdown) {
            await entry.update({
                disqualified: true,
                disqualificationReason: 'Exceeded maximum drawdown limit'
            });
            // Notify user about disqualification
            index_1.socketService.to(entry.userId.toString()).emit('disqualified', {
                entryId: entry.id,
                reason: 'Exceeded maximum drawdown limit'
            });
        }
        return metrics;
    }
    catch (error) {
        console.error('Error updating entry metrics:', error);
        throw error;
    }
};
//# sourceMappingURL=tradeController.js.map