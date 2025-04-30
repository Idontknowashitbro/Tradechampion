import { Request, Response } from 'express';
import { Trade, ChallengeEntry, Challenge } from '../models';
import { socketService } from '../index';
import leaderboardService from '../services/leaderboardService';

/**
 * Get trades for a challenge entry
 * @route GET /api/trades/:challengeEntryId
 */
export const getTradesByEntry = async (req: Request, res: Response) => {
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
    const entry = await ChallengeEntry.findByPk(challengeEntryId);

    if (!entry) {
      return res.status(404).json({ message: 'Challenge entry not found' });
    }

    // Check if the user owns this entry or is an admin
    if (entry.userId !== userId && req.user?.status !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get trades with pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const { count, rows: trades } = await Trade.findAndCountAll({
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
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Log a new trade
 * @route POST /api/trades
 * @note This endpoint would typically be called by the cTrader integration service
 */
export const logTrade = async (req: Request, res: Response) => {
  try {
    const {
      challengeEntryId,
      tradeId,
      symbol,
      lotSize,
      entryTime,
      exitTime,
      pnl
    } = req.body;

    // Validate required fields
    if (!challengeEntryId || !tradeId || !symbol || !lotSize || !entryTime || !exitTime || pnl === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find the challenge entry
    const entry = await ChallengeEntry.findByPk(challengeEntryId, {
      include: [{ model: Challenge, as: 'challenge' }]
    });

    if (!entry) {
      return res.status(404).json({ message: 'Challenge entry not found' });
    }

    // Check if trade already exists
    const existingTrade = await Trade.findOne({
      where: {
        challengeEntryId,
        tradeId
      }
    });

    if (existingTrade) {
      return res.status(400).json({ message: 'Trade with this ID already exists' });
    }

    // Create the trade
    const trade = await Trade.create({
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
    socketService.to(entry.userId.toString()).emit('tradeClosed', {
      entryId: entry.id,
      tradeId: trade.id,
      symbol: trade.symbol,
      pnl: trade.pnl,
      exitTime: trade.exitTime
    });

    // Update the leaderboard
    await leaderboardService.updateLeaderboardAfterTrade(entry.id);

    res.status(201).json({
      message: 'Trade logged successfully',
      trade
    });
  } catch (error) {
    console.error('Error logging trade:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update entry metrics based on trades
 * This is called after a trade is added
 */
const updateEntryMetrics = async (entry: ChallengeEntry) => {
  try {
    // Get all trades for this entry
    const trades = await Trade.findAll({
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
    socketService.to(entry.userId.toString()).emit('metricsUpdate', {
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
      socketService.to(entry.userId.toString()).emit('disqualified', {
        entryId: entry.id,
        reason: 'Exceeded maximum drawdown limit'
      });
    }

    return metrics;
  } catch (error) {
    console.error('Error updating entry metrics:', error);
    throw error;
  }
}; 