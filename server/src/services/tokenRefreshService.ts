import { CronJob } from 'cron';
import User from '../models/User';
import sequelize from '../config/database';
import ctraderController from '../controllers/ctraderController';
import { Op } from 'sequelize';

/**
 * Service for refreshing cTrader tokens
 */
class TokenRefreshService {
  private job: CronJob | null = null;

  /**
   * Start the token refresh scheduler
   * @param intervalMinutes How often to run the refresh job in minutes
   */
  public startScheduler(intervalMinutes: number = 30): void {
    // Create a cron expression that runs every X minutes
    const cronExpression = `0 */${intervalMinutes} * * * *`;
    
    // Create and start the cron job
    this.job = new CronJob(
      cronExpression,
      this.refreshTokens.bind(this),
      null,
      true,
      'UTC'
    );
    
    console.log(`Token refresh scheduler started with ${intervalMinutes} minute interval`);
  }

  /**
   * Stop the token refresh scheduler
   */
  public stopScheduler(): void {
    if (this.job) {
      this.job.stop();
      this.job = null;
      console.log('Token refresh scheduler stopped');
    }
  }

  /**
   * Refresh tokens for all users that need refresh
   */
  private async refreshTokens(): Promise<void> {
    try {
      console.log('Running token refresh job...');

      // Find all users with cTrader tokens
      const users = await User.findAll();
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
          await ctraderController.refreshToken(user.id);
          console.log(`Successfully refreshed token for user ${user.id}`);
          return { userId: user.id, success: true };
        } catch (error) {
          console.error(`Failed to refresh token for user ${user.id}:`, error);
          return { userId: user.id, success: false, error };
        }
      });

      const results = await Promise.all(promises);
      const successCount = results.filter(r => r.success).length;
      
      console.log(`Refreshed tokens for ${successCount}/${usersToRefresh.length} users`);
    } catch (error) {
      console.error('Error in token refresh job:', error);
    }
  }
}

export default new TokenRefreshService(); 