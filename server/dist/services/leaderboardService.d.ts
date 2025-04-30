/**
 * Service for handling real-time leaderboard generation and updates
 */
declare class LeaderboardService {
    /**
     * Generate and update leaderboard for a challenge
     * @param challengeId Challenge ID
     */
    generateLeaderboard(challengeId: number): Promise<any>;
    /**
     * Apply ranking algorithm with tiebreakers
     * Primary ranking: PnL Percentage (higher is better)
     * Tiebreaker 1: Drawdown Percentage (lower is better)
     * Tiebreaker 2: Trade Count (higher is better)
     * Tiebreaker 3: Average Risk Per Trade (lower is better)
     */
    private applyRankingAlgorithm;
    /**
     * Update entry ranks in the database
     */
    private updateEntryRanks;
    /**
     * Format leaderboard for response
     */
    private formatLeaderboard;
    /**
     * Broadcast leaderboard update to connected clients
     */
    private broadcastLeaderboardUpdate;
    /**
     * Update leaderboard after a trade
     * This is called when a trade is processed to update the leaderboard in real-time
     */
    updateLeaderboardAfterTrade(challengeEntryId: number): Promise<void>;
    /**
     * Get top performers from a leaderboard (for prize distribution)
     * @param challengeId Challenge ID
     * @param topPercent Percentage of top performers to return (e.g., 0.3 for top 30%)
     */
    getTopPerformers(challengeId: number, topPercent?: number): Promise<any[]>;
    /**
     * Get disqualified entries for a challenge with reasons
     * @param challengeId Challenge ID
     */
    getDisqualifiedEntries(challengeId: number): Promise<any[]>;
    /**
     * Get entries that are at risk of disqualification (close to violating rules)
     * @param challengeId Challenge ID
     * @param thresholdPercentage How close to limits (e.g. 0.9 means 90% of max drawdown)
     */
    getEntriesAtRisk(challengeId: number, thresholdPercentage?: number): Promise<any[]>;
}
declare const _default: LeaderboardService;
export default _default;
