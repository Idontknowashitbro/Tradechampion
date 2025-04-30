/**
 * Service for refreshing cTrader tokens
 */
declare class TokenRefreshService {
    private job;
    /**
     * Start the token refresh scheduler
     * @param intervalMinutes How often to run the refresh job in minutes
     */
    startScheduler(intervalMinutes?: number): void;
    /**
     * Stop the token refresh scheduler
     */
    stopScheduler(): void;
    /**
     * Refresh tokens for all users that need refresh
     */
    private refreshTokens;
}
declare const _default: TokenRefreshService;
export default _default;
