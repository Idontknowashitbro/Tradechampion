/// <reference types="node" />
interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}
/**
 * Service for interacting with the cTrader API
 */
declare class CtraderService {
    private activeConnections;
    private connectionRetries;
    private readonly MAX_RETRY_ATTEMPTS;
    private readonly INITIAL_RETRY_DELAY;
    private readonly PING_INTERVAL;
    private readonly PING_TIMEOUT;
    /**
     * Generate authorization URL for OAuth
     */
    getAuthorizationUrl(): string;
    /**
     * Exchange authorization code for access and refresh tokens
     * @param code The authorization code from cTrader
     */
    getAccessToken(code: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    /**
     * Exchange authorization code for access token
     * @param code Authorization code from cTrader OAuth
     * @param redirectUri Redirect URI that was used
     */
    exchangeAuthCode(code: string, redirectUri: string): Promise<TokenResponse>;
    /**
     * Refresh access token using refresh token
     * @param refreshToken Refresh token
     */
    refreshAccessToken(refreshToken: string): Promise<TokenResponse>;
    /**
     * Get user accounts from cTrader
     * @param accessToken Access token
     */
    getUserAccounts(accessToken: string): Promise<any[]>;
    /**
     * Get user accounts from cTrader
     * @param accessToken Access token
     */
    getAccounts(accessToken: string): Promise<any[]>;
    /**
     * Get account details
     * @param accessToken Access token
     * @param accountId cTrader account ID
     */
    getAccountDetails(accessToken: string, accountId: string): Promise<any>;
    /**
     * Get account positions
     * @param accessToken Access token
     * @param accountId cTrader account ID
     */
    getAccountPositions(accessToken: string, accountId: string): Promise<any[]>;
    /**
     * Get account trades for a date range
     * @param accessToken Access token
     * @param accountId cTrader account ID
     * @param fromDate Start date
     */
    getAccountTrades(accessToken: string, accountId: string, fromDate: Date): Promise<any[]>;
    /**
     * Get account history
     * @param accessToken Access token
     * @param accountId cTrader account ID
     * @param from Start date
     * @param to End date
     */
    getAccountHistory(accessToken: string, accountId: string, from: string, to: string): Promise<any[]>;
    /**
     * Process trade data from cTrader
     * @param challengeEntryId Challenge entry ID
     * @param tradeData Trade data from cTrader
     */
    processTrade(challengeEntryId: number, tradeData: any): Promise<void>;
    /**
     * Update challenge entry metrics based on trades
     * @param challengeEntryId Challenge entry ID
     */
    private updateChallengeEntryMetrics;
    /**
     * Check if the drawdown exceeds the maximum allowed
     * @param challengeEntryId Challenge entry ID
     */
    checkDrawdownLimit(challengeEntryId: number): Promise<boolean>;
    /**
     * Establish WebSocket connection for a challenge entry
     * @param challengeEntryId Challenge entry ID
     */
    establishWebSocketConnection(challengeEntryId: number): Promise<void>;
    /**
     * Attempt to reconnect WebSocket with exponential backoff
     * @param challengeEntryId Challenge entry ID
     */
    private reconnectWebSocket;
    /**
     * Disconnect a WebSocket connection
     * @param challengeEntryId Challenge entry ID
     */
    disconnectWebSocket(challengeEntryId: number): Promise<void>;
    /**
     * Handle user disqualification
     * @param challengeEntryId Challenge entry ID
     * @param reason Disqualification reason
     */
    private handleDisqualification;
    /**
     * Get active WebSocket connections count
     */
    getActiveConnectionsCount(): number;
    /**
     * Get connection status for a challenge entry
     * @param challengeEntryId Challenge entry ID
     */
    isConnected(challengeEntryId: number): boolean;
    /**
     * Get detailed connection status for debugging
     * @param challengeEntryId Challenge entry ID
     */
    getConnectionStatus(challengeEntryId: number): any;
    /**
     * Start monitoring all connections periodically
     * This should be called at server startup
     * @param intervalMinutes How often to check connections (in minutes)
     */
    startConnectionMonitoring(intervalMinutes?: number): NodeJS.Timeout;
    /**
     * Stop connection monitoring
     * @param monitorInterval The interval returned by startConnectionMonitoring
     */
    stopConnectionMonitoring(monitorInterval: NodeJS.Timeout): void;
    /**
     * Process WebSocket message from cTrader
     * @param message WebSocket message data
     * @param challengeEntryId Challenge entry ID
     */
    private processWebSocketMessage;
}
declare const _default: CtraderService;
export default _default;
