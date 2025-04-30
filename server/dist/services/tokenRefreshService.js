"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("cron");
const User_1 = __importDefault(require("../models/User"));
const ctraderController_1 = __importDefault(require("../controllers/ctraderController"));
/**
 * Service for refreshing cTrader tokens
 */
class TokenRefreshService {
    constructor() {
        this.job = null;
    }
    /**
     * Start the token refresh scheduler
     * @param intervalMinutes How often to run the refresh job in minutes
     */
    startScheduler(intervalMinutes = 30) {
        // Create a cron expression that runs every X minutes
        const cronExpression = `0 */${intervalMinutes} * * * *`;
        // Create and start the cron job
        this.job = new cron_1.CronJob(cronExpression, this.refreshTokens.bind(this), null, true, 'UTC');
        console.log(`Token refresh scheduler started with ${intervalMinutes} minute interval`);
    }
    /**
     * Stop the token refresh scheduler
     */
    stopScheduler() {
        if (this.job) {
            this.job.stop();
            this.job = null;
            console.log('Token refresh scheduler stopped');
        }
    }
    /**
     * Refresh tokens for all users that need refresh
     */
    async refreshTokens() {
        try {
            console.log('Running token refresh job...');
            // Find all users with cTrader tokens
            const users = await User_1.default.findAll();
            const usersToRefresh = [];
            // Filter users who need a token refresh
            for (const user of users) {
                const ctraderData = user.getCtraderData();
                if (ctraderData.isConnected && ctraderData.tokenExpiry) {
                    const expiryDate = new Date(ctraderData.tokenExpiry);
                    // Refresh if expiry is less than 1 hour away
                    if (expiryDate.getTime() - Date.now() < 60 * 60 * 1000) {
                        usersToRefresh.push(user);
                    }
                }
            }
            console.log(`Found ${usersToRefresh.length} users that need token refresh`);
            // Refresh tokens for each user
            const promises = usersToRefresh.map(async (user) => {
                try {
                    await ctraderController_1.default.refreshToken(user.id);
                    console.log(`Successfully refreshed token for user ${user.id}`);
                    return { userId: user.id, success: true };
                }
                catch (error) {
                    console.error(`Failed to refresh token for user ${user.id}:`, error);
                    return { userId: user.id, success: false, error };
                }
            });
            const results = await Promise.all(promises);
            const successCount = results.filter(r => r.success).length;
            console.log(`Refreshed tokens for ${successCount}/${usersToRefresh.length} users`);
        }
        catch (error) {
            console.error('Error in token refresh job:', error);
        }
    }
}
exports.default = new TokenRefreshService();
//# sourceMappingURL=tokenRefreshService.js.map