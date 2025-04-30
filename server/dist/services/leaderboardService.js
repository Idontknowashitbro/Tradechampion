"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = require("../index");
const ChallengeEntry_1 = __importDefault(require("../models/ChallengeEntry"));
const Challenge_1 = __importDefault(require("../models/Challenge"));
const User_1 = __importDefault(require("../models/User"));
/**
 * Service for handling real-time leaderboard generation and updates
 */
class LeaderboardService {
    /**
     * Generate and update leaderboard for a challenge
     * @param challengeId Challenge ID
     */
    async generateLeaderboard(challengeId) {
        try {
            // Check if challenge exists
            const challenge = await Challenge_1.default.findByPk(challengeId);
            if (!challenge) {
                throw new Error(`Challenge ${challengeId} not found`);
            }
            // Get all entries that haven't been disqualified and have met minimum requirements
            const entries = await ChallengeEntry_1.default.findAll({
                where: {
                    challengeId,
                    disqualified: false,
                    status: { [sequelize_1.Op.in]: ['active', 'completed'] } // Only include active or completed entries
                },
                include: [
                    {
                        model: User_1.default,
                        attributes: ['id', 'name', 'discordUsername']
                    }
                ]
            });
            if (!entries.length) {
                console.log(`No qualifying entries found for challenge ${challengeId}`);
                return {
                    challengeId: challengeId,
                    challengeName: challenge.name,
                    totalEntries: 0,
                    updatedAt: new Date().toISOString(),
                    entries: []
                };
            }
            // Filter entries that meet minimum requirements
            const qualifyingEntries = entries.filter(entry => {
                // Check if minimum trade count requirement is met
                if (challenge.minTrades && entry.metrics.tradeCount < challenge.minTrades) {
                    console.log(`Entry ${entry.id} excluded: insufficient trade count (${entry.metrics.tradeCount}/${challenge.minTrades})`);
                    return false;
                }
                // Check max drawdown not exceeded
                if (challenge.maxDrawdown && entry.metrics.drawdownPercentage > challenge.maxDrawdown) {
                    console.log(`Entry ${entry.id} excluded: exceeded max drawdown (${entry.metrics.drawdownPercentage}%/${challenge.maxDrawdown}%)`);
                    return false;
                }
                // Check max risk per trade not exceeded
                if (challenge.maxRiskPerTrade && entry.metrics.avgRiskPerTrade > challenge.maxRiskPerTrade) {
                    console.log(`Entry ${entry.id} excluded: exceeded max risk per trade (${entry.metrics.avgRiskPerTrade}%/${challenge.maxRiskPerTrade}%)`);
                    return false;
                }
                return true;
            });
            if (!qualifyingEntries.length) {
                console.log(`No entries meeting all requirements found for challenge ${challengeId}`);
                return {
                    challengeId: challengeId,
                    challengeName: challenge.name,
                    totalEntries: 0,
                    updatedAt: new Date().toISOString(),
                    entries: []
                };
            }
            // Apply ranking algorithm with tiebreakers to qualifying entries
            const rankedEntries = await this.applyRankingAlgorithm(qualifyingEntries, challenge);
            // Update ranks in database
            await this.updateEntryRanks(rankedEntries);
            // Format leaderboard for response
            const leaderboard = this.formatLeaderboard(rankedEntries, challenge);
            // Broadcast leaderboard update to clients
            this.broadcastLeaderboardUpdate(challengeId, leaderboard);
            return leaderboard;
        }
        catch (error) {
            console.error(`Error generating leaderboard for challenge ${challengeId}:`, error);
            throw error;
        }
    }
    /**
     * Apply ranking algorithm with tiebreakers
     * Primary ranking: PnL Percentage (higher is better)
     * Tiebreaker 1: Drawdown Percentage (lower is better)
     * Tiebreaker 2: Trade Count (higher is better)
     * Tiebreaker 3: Average Risk Per Trade (lower is better)
     */
    async applyRankingAlgorithm(entries, challenge) {
        // Sort entries based on metrics with multiple tiebreakers
        return entries.sort((a, b) => {
            // Primary sort by PnL percentage (descending)
            const pnlDiff = b.metrics.pnlPercentage - a.metrics.pnlPercentage;
            if (Math.abs(pnlDiff) > 0.001) { // Using small epsilon to handle floating point comparison
                return pnlDiff;
            }
            // Tiebreaker 1: Drawdown percentage (ascending - lower is better)
            const drawdownDiff = a.metrics.drawdownPercentage - b.metrics.drawdownPercentage;
            if (Math.abs(drawdownDiff) > 0.001) {
                return drawdownDiff;
            }
            // Tiebreaker 2: Trade count (descending - higher is better)
            const tradeDiff = b.metrics.tradeCount - a.metrics.tradeCount;
            if (tradeDiff !== 0) {
                return tradeDiff;
            }
            // Tiebreaker 3: Average risk per trade (ascending - lower is better)
            return a.metrics.avgRiskPerTrade - b.metrics.avgRiskPerTrade;
        });
    }
    /**
     * Update entry ranks in the database
     */
    async updateEntryRanks(rankedEntries) {
        const updatePromises = rankedEntries.map((entry, index) => {
            const newRank = index + 1;
            if (entry.rank !== newRank) {
                return entry.update({ rank: newRank });
            }
            return Promise.resolve();
        });
        await Promise.all(updatePromises);
    }
    /**
     * Format leaderboard for response
     */
    formatLeaderboard(rankedEntries, challenge) {
        const leaderboardEntries = rankedEntries.map((entry, index) => {
            var _a, _b;
            return {
                rank: index + 1,
                entryId: entry.id,
                userId: entry.userId,
                userName: ((_a = entry.user) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown',
                discordUsername: ((_b = entry.user) === null || _b === void 0 ? void 0 : _b.discordUsername) || null,
                metrics: {
                    pnlPercentage: entry.metrics.pnlPercentage,
                    drawdownPercentage: entry.metrics.drawdownPercentage,
                    tradeCount: entry.metrics.tradeCount,
                    avgRiskPerTrade: entry.metrics.avgRiskPerTrade
                }
            };
        });
        return {
            challengeId: challenge.id,
            challengeName: challenge.name,
            totalEntries: rankedEntries.length,
            updatedAt: new Date().toISOString(),
            entries: leaderboardEntries
        };
    }
    /**
     * Broadcast leaderboard update to connected clients
     */
    broadcastLeaderboardUpdate(challengeId, leaderboard) {
        if (index_1.socketService) {
            try {
                // Emit to challenge-specific room
                index_1.socketService.to(`challenge-${challengeId}`).emit('leaderboard-update', leaderboard);
                // Also emit to admin room
                index_1.socketService.to('admin').emit('leaderboard-update', leaderboard);
                console.log(`Leaderboard update broadcast for challenge ${challengeId}`);
            }
            catch (error) {
                console.error('Error broadcasting leaderboard update:', error);
            }
        }
    }
    /**
     * Update leaderboard after a trade
     * This is called when a trade is processed to update the leaderboard in real-time
     */
    async updateLeaderboardAfterTrade(challengeEntryId) {
        try {
            // Get challenge entry with its challenge
            const entry = await ChallengeEntry_1.default.findByPk(challengeEntryId, {
                include: [{ model: Challenge_1.default }]
            });
            if (!entry || !entry.challenge) {
                throw new Error(`Challenge entry ${challengeEntryId} or its challenge not found`);
            }
            // Generate updated leaderboard
            await this.generateLeaderboard(entry.challengeId);
        }
        catch (error) {
            console.error(`Error updating leaderboard after trade for entry ${challengeEntryId}:`, error);
            throw error;
        }
    }
    /**
     * Get top performers from a leaderboard (for prize distribution)
     * @param challengeId Challenge ID
     * @param topPercent Percentage of top performers to return (e.g., 0.3 for top 30%)
     */
    async getTopPerformers(challengeId, topPercent = 0.3) {
        try {
            // Generate updated leaderboard
            const leaderboard = await this.generateLeaderboard(challengeId);
            if (!leaderboard || !leaderboard.entries || !leaderboard.entries.length) {
                return [];
            }
            // Calculate how many entries to include
            const totalEntries = leaderboard.entries.length;
            const topCount = Math.max(1, Math.ceil(totalEntries * topPercent));
            // Return top performers
            return leaderboard.entries.slice(0, topCount);
        }
        catch (error) {
            console.error(`Error getting top performers for challenge ${challengeId}:`, error);
            throw error;
        }
    }
    /**
     * Get disqualified entries for a challenge with reasons
     * @param challengeId Challenge ID
     */
    async getDisqualifiedEntries(challengeId) {
        try {
            // Get all disqualified entries for this challenge
            const disqualifiedEntries = await ChallengeEntry_1.default.findAll({
                where: {
                    challengeId,
                    disqualified: true
                },
                include: [
                    {
                        model: User_1.default,
                        attributes: ['id', 'name', 'discordUsername']
                    }
                ]
            });
            // Format response
            return disqualifiedEntries.map(entry => {
                var _a, _b;
                return {
                    entryId: entry.id,
                    userId: entry.userId,
                    userName: ((_a = entry.user) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown',
                    discordUsername: ((_b = entry.user) === null || _b === void 0 ? void 0 : _b.discordUsername) || null,
                    disqualificationReason: entry.disqualificationReason || 'Unknown reason',
                    metrics: {
                        pnlPercentage: entry.metrics.pnlPercentage,
                        drawdownPercentage: entry.metrics.drawdownPercentage,
                        tradeCount: entry.metrics.tradeCount,
                        avgRiskPerTrade: entry.metrics.avgRiskPerTrade
                    },
                    disqualifiedAt: entry.updatedAt
                };
            });
        }
        catch (error) {
            console.error(`Error fetching disqualified entries for challenge ${challengeId}:`, error);
            throw error;
        }
    }
    /**
     * Get entries that are at risk of disqualification (close to violating rules)
     * @param challengeId Challenge ID
     * @param thresholdPercentage How close to limits (e.g. 0.9 means 90% of max drawdown)
     */
    async getEntriesAtRisk(challengeId, thresholdPercentage = 0.9) {
        try {
            // Get challenge rules
            const challenge = await Challenge_1.default.findByPk(challengeId);
            if (!challenge) {
                throw new Error(`Challenge ${challengeId} not found`);
            }
            // Get all active entries
            const entries = await ChallengeEntry_1.default.findAll({
                where: {
                    challengeId,
                    disqualified: false,
                    status: 'active'
                },
                include: [
                    {
                        model: User_1.default,
                        attributes: ['id', 'name', 'discordUsername']
                    }
                ]
            });
            // Filter for entries that are close to violation
            return entries.filter(entry => {
                // Check if close to max drawdown limit
                if (challenge.maxDrawdown &&
                    entry.metrics.drawdownPercentage > (challenge.maxDrawdown * thresholdPercentage)) {
                    return true;
                }
                // Check if close to max risk per trade limit
                if (challenge.maxRiskPerTrade &&
                    entry.metrics.avgRiskPerTrade > (challenge.maxRiskPerTrade * thresholdPercentage)) {
                    return true;
                }
                return false;
            }).map(entry => {
                var _a, _b;
                // Calculate risk factors
                const drawdownRisk = challenge.maxDrawdown ?
                    (entry.metrics.drawdownPercentage / challenge.maxDrawdown) : 0;
                const riskPerTradeRisk = challenge.maxRiskPerTrade ?
                    (entry.metrics.avgRiskPerTrade / challenge.maxRiskPerTrade) : 0;
                return {
                    entryId: entry.id,
                    userId: entry.userId,
                    userName: ((_a = entry.user) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown',
                    discordUsername: ((_b = entry.user) === null || _b === void 0 ? void 0 : _b.discordUsername) || null,
                    metrics: entry.metrics,
                    riskFactors: {
                        drawdownRiskPercentage: Math.round(drawdownRisk * 100),
                        riskPerTradeRiskPercentage: Math.round(riskPerTradeRisk * 100)
                    }
                };
            });
        }
        catch (error) {
            console.error(`Error fetching at-risk entries for challenge ${challengeId}:`, error);
            throw error;
        }
    }
}
exports.default = new LeaderboardService();
//# sourceMappingURL=leaderboardService.js.map