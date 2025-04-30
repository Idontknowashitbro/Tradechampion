import axios from 'axios';
import * as querystring from 'querystring';
import dotenv from 'dotenv';
import { createError } from '../middleware/errorHandler';
import ChallengeEntry from '../models/ChallengeEntry';
import Trade from '../models/Trade';
import { socketService } from '../index';
import WebSocket from 'ws';
import User from '../models/User';
import Challenge from '../models/Challenge';
import leaderboardService from './leaderboardService';

// Extend the WebSocket interface to include our custom properties
interface CustomWebSocket extends WebSocket {
  pingInterval?: NodeJS.Timeout;
}

dotenv.config();

const {
  CTRADER_API_URL,
  CTRADER_CLIENT_ID,
  CTRADER_CLIENT_SECRET,
  CTRADER_REDIRECT_URI,
  CTRADER_WS_URL,
} = process.env;

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

/**
 * Service for interacting with the cTrader API
 */
class CtraderService {
  // Map to store active WebSocket connections
  private activeConnections: Map<string, CustomWebSocket> = new Map();
  // Map to store connection retry counts
  private connectionRetries: Map<string, number> = new Map();
  // Maximum number of retry attempts
  private readonly MAX_RETRY_ATTEMPTS = 5;
  // Initial retry delay in milliseconds (exponential backoff)
  private readonly INITIAL_RETRY_DELAY = 1000;
  // WebSocket ping interval in milliseconds
  private readonly PING_INTERVAL = 30000;
  // WebSocket ping timeout in milliseconds
  private readonly PING_TIMEOUT = 10000;

  /**
   * Generate authorization URL for OAuth
   */
  public getAuthorizationUrl(): string {
    if (!CTRADER_CLIENT_ID || !CTRADER_REDIRECT_URI) {
      throw new Error('cTrader client ID or redirect URI not configured');
    }
    
    return `${CTRADER_API_URL}/oauth/authorize?response_type=code&client_id=${CTRADER_CLIENT_ID}&redirect_uri=${encodeURIComponent(CTRADER_REDIRECT_URI)}&scope=accounts`;
  }

  /**
   * Exchange authorization code for access and refresh tokens
   * @param code The authorization code from cTrader
   */
  public async getAccessToken(code: string): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenData = await this.exchangeAuthCode(code, CTRADER_REDIRECT_URI || '');
    
    return {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token
    };
  }

  /**
   * Exchange authorization code for access token
   * @param code Authorization code from cTrader OAuth
   * @param redirectUri Redirect URI that was used
   */
  public async exchangeAuthCode(code: string, redirectUri: string): Promise<TokenResponse> {
    try {
      const response = await axios.post(
        `${CTRADER_API_URL}/oauth/token`,
        querystring.stringify({
          grant_type: 'authorization_code',
          code,
          client_id: CTRADER_CLIENT_ID,
          client_secret: CTRADER_CLIENT_SECRET,
          redirect_uri: redirectUri,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error exchanging auth code:', error);
      throw new Error('Failed to exchange authorization code for access token');
    }
  }

  /**
   * Refresh access token using refresh token
   * @param refreshToken Refresh token
   */
  public async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const response = await axios.post(
        `${CTRADER_API_URL}/oauth/token`,
        querystring.stringify({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: CTRADER_CLIENT_ID,
          client_secret: CTRADER_CLIENT_SECRET,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw new Error('Failed to refresh access token');
    }
  }

  /**
   * Get user accounts from cTrader
   * @param accessToken Access token
   */
  public async getUserAccounts(accessToken: string): Promise<any[]> {
    return this.getAccounts(accessToken);
  }

  /**
   * Get user accounts from cTrader
   * @param accessToken Access token
   */
  public async getAccounts(accessToken: string): Promise<any[]> {
    try {
      const response = await axios.get(`${CTRADER_API_URL}/accounts`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw new Error('Failed to fetch cTrader accounts');
    }
  }

  /**
   * Get account details
   * @param accessToken Access token
   * @param accountId cTrader account ID
   */
  public async getAccountDetails(accessToken: string, accountId: string): Promise<any> {
    try {
      const response = await axios.get(`${CTRADER_API_URL}/accounts/${accountId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching account details:', error);
      throw new Error('Failed to fetch cTrader account details');
    }
  }

  /**
   * Get account positions
   * @param accessToken Access token
   * @param accountId cTrader account ID
   */
  public async getAccountPositions(accessToken: string, accountId: string): Promise<any[]> {
    try {
      const response = await axios.get(`${CTRADER_API_URL}/accounts/${accountId}/positions`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching account positions:', error);
      throw new Error('Failed to fetch cTrader positions');
    }
  }

  /**
   * Get account trades for a date range
   * @param accessToken Access token
   * @param accountId cTrader account ID
   * @param fromDate Start date
   */
  public async getAccountTrades(
    accessToken: string, 
    accountId: string, 
    fromDate: Date
  ): Promise<any[]> {
    try {
      const response = await axios.get(
        `${CTRADER_API_URL}/accounts/${accountId}/trades`, 
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          params: {
            from: fromDate.toISOString(),
            status: 'CLOSED'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching account trades:', error);
      throw new Error('Failed to fetch cTrader trades');
    }
  }

  /**
   * Get account history
   * @param accessToken Access token
   * @param accountId cTrader account ID
   * @param from Start date
   * @param to End date
   */
  public async getAccountHistory(
    accessToken: string,
    accountId: string,
    from: string,
    to: string
  ): Promise<any[]> {
    try {
      const response = await axios.get(
        `${CTRADER_API_URL}/accounts/${accountId}/history`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          params: { from, to }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching account history:', error);
      throw new Error('Failed to fetch cTrader account history');
    }
  }

  /**
   * Process trade data from cTrader
   * @param challengeEntryId Challenge entry ID
   * @param tradeData Trade data from cTrader
   */
  public async processTrade(challengeEntryId: number, tradeData: any): Promise<void> {
    try {
      console.log(`Processing trade for challenge entry ${challengeEntryId}:`, tradeData);
      
      // Get challenge entry
      const entry = await ChallengeEntry.findByPk(challengeEntryId, {
        include: [{ model: Challenge }]
      });
      
      if (!entry) {
        throw new Error(`Challenge entry ${challengeEntryId} not found`);
      }
      
      // Get challenge rules
      const challenge = entry.challenge;
      if (!challenge) {
        throw new Error(`Challenge not found for entry ${challengeEntryId}`);
      }
      
      // Format trade data
      const trade = {
        challengeEntryId,
        tradeId: tradeData.id,
        symbol: tradeData.symbol,
        lotSize: tradeData.volume,
        entryTime: new Date(tradeData.openTime),
        exitTime: new Date(tradeData.closeTime),
        pnl: tradeData.profit
      };
      
      // Check if trade already exists
      const existingTrade = await Trade.findOne({
        where: {
          challengeEntryId,
          tradeId: trade.tradeId
        }
      });
      
      if (existingTrade) {
        console.log(`Trade ${trade.tradeId} already exists for challenge entry ${challengeEntryId}`);
        return;
      }
      
      // Create new trade
      const newTrade = await Trade.create(trade);
      console.log(`Created new trade record: ${newTrade.id}`);
      
      // Check if trade violates challenge rules
      
      // 1. Check for minimum trade duration (anti-scalping)
      if (challenge.minTradeDuration > 0) {
        const tradeDuration = Math.floor((trade.exitTime.getTime() - trade.entryTime.getTime()) / 1000);
        if (tradeDuration < challenge.minTradeDuration) {
          await this.handleDisqualification(challengeEntryId, 'Trade duration too short (scalping)');
          return;
        }
      }
      
      // 2. Check for maximum risk per trade
      if (challenge.maxRiskPerTrade > 0) {
        // Calculate risk percentage based on lot size
        const riskPercentage = (trade.lotSize / challenge.initialBalance) * 100;
        if (riskPercentage > challenge.maxRiskPerTrade) {
          await this.handleDisqualification(challengeEntryId, 'Maximum risk per trade exceeded');
          return;
        }
      }
      
      // Update challenge entry metrics
      await this.updateChallengeEntryMetrics(challengeEntryId);
      
      // Store the last position data
      await entry.update({
        lastPosition: tradeData
      });
      
      // Update leaderboard after processing trade
      try {
        await leaderboardService.updateLeaderboardAfterTrade(challengeEntryId);
      } catch (leaderboardError) {
        console.error(`Error updating leaderboard after trade: ${leaderboardError}`);
        // Don't throw here - we want to continue even if leaderboard update fails
      }
      
      console.log(`Trade processing completed for entry ${challengeEntryId}`);
    } catch (error) {
      console.error(`Error processing trade for challenge entry ${challengeEntryId}:`, error);
      throw new Error('Failed to process trade data');
    }
  }

  /**
   * Update challenge entry metrics based on trades
   * @param challengeEntryId Challenge entry ID
   */
  private async updateChallengeEntryMetrics(challengeEntryId: number): Promise<void> {
    try {
      // Get challenge entry with its challenge details
      const entry = await ChallengeEntry.findByPk(challengeEntryId, {
        include: [{ model: Challenge }]
      });
      
      if (!entry || !entry.challenge) {
        throw new Error(`Challenge entry ${challengeEntryId} or its challenge not found`);
      }
      
      // Get challenge details
      const challenge = entry.challenge;
      const initialBalance = challenge.initialBalance;
      
      // Get all trades for this challenge entry
      const trades = await Trade.findAll({
        where: { challengeEntryId }
      });
      
      // Calculate metrics
      const tradeCount = trades.length;
      
      // Calculate total PnL and PnL percentage
      const totalPnl = trades.reduce((sum, trade) => sum + Number(trade.pnl), 0);
      const pnlPercentage = (totalPnl / initialBalance) * 100;
      
      // Calculate running balance to find maximum drawdown
      let runningBalance = initialBalance;
      let peakBalance = initialBalance;
      let maxDrawdown = 0;
      let totalRisk = 0;
      
      // Sort trades by exit time
      const sortedTrades = [...trades].sort((a, b) => 
        a.exitTime.getTime() - b.exitTime.getTime()
      );
      
      for (const trade of sortedTrades) {
        runningBalance += Number(trade.pnl);
        
        // Update peak balance if current balance is higher
        if (runningBalance > peakBalance) {
          peakBalance = runningBalance;
        }
        
        // Calculate current drawdown from peak
        const currentDrawdown = ((peakBalance - runningBalance) / peakBalance) * 100;
        
        // Update max drawdown if current drawdown is higher
        if (currentDrawdown > maxDrawdown) {
          maxDrawdown = currentDrawdown;
        }
        
        // Accumulate risk (lot size as percentage of initial balance)
        totalRisk += (Number(trade.lotSize) / initialBalance) * 100;
      }
      
      // Calculate average risk per trade
      const avgRiskPerTrade = tradeCount > 0 ? totalRisk / tradeCount : 0;
      
      // Update challenge entry metrics
      await entry.update({
        metrics: {
          pnlPercentage: parseFloat(pnlPercentage.toFixed(2)),
          drawdownPercentage: parseFloat(maxDrawdown.toFixed(2)),
          tradeCount,
          avgRiskPerTrade: parseFloat(avgRiskPerTrade.toFixed(2))
        }
      });
      
      console.log(`Updated metrics for challenge entry ${challengeEntryId}:`, entry.metrics);
      
      // Check if challenge is completed based on minimum trade count
      if (challenge.minTrades && challenge.minTrades > 0 && tradeCount >= challenge.minTrades) {
        // If minimum trades achieved, mark as completed
        await entry.update({ status: 'completed' });
        console.log(`Challenge entry ${challengeEntryId} marked as completed - minimum trades achieved`);
      }
    } catch (error) {
      console.error(`Error updating metrics for challenge entry ${challengeEntryId}:`, error);
      throw new Error('Failed to update challenge entry metrics');
    }
  }

  /**
   * Check if the drawdown exceeds the maximum allowed
   * @param challengeEntryId Challenge entry ID
   */
  public async checkDrawdownLimit(challengeEntryId: number): Promise<boolean> {
    try {
      // Get challenge entry with challenge
      const entry = await ChallengeEntry.findByPk(challengeEntryId, {
        include: [{ model: Challenge }]
      });
      
      if (!entry || !entry.challenge) {
        throw new Error(`Challenge entry ${challengeEntryId} or its challenge not found`);
      }
      
      // Get challenge settings
      const challenge = entry.challenge;
      const maxDrawdown = challenge.maxDrawdown;
      
      // If no max drawdown set, return false (no violation)
      if (!maxDrawdown || maxDrawdown <= 0) {
        return false;
      }
      
      // Get current drawdown from metrics
      const currentDrawdown = entry.metrics.drawdownPercentage;
      
      // Check if current drawdown exceeds maximum allowed
      if (currentDrawdown > maxDrawdown) {
        console.log(`Maximum drawdown exceeded for challenge entry ${challengeEntryId}: ${currentDrawdown}% > ${maxDrawdown}%`);
        
        // Mark as disqualified if not already
        if (!entry.disqualified) {
          await entry.update({
            disqualified: true,
            disqualificationReason: `Maximum drawdown exceeded: ${currentDrawdown.toFixed(2)}% > ${maxDrawdown}%`,
            status: 'disqualified'
          });
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error checking drawdown limit for challenge entry ${challengeEntryId}:`, error);
      throw new Error('Failed to check drawdown limit');
    }
  }

  /**
   * Establish WebSocket connection for a challenge entry
   * @param challengeEntryId Challenge entry ID
   */
  public async establishWebSocketConnection(challengeEntryId: number): Promise<void> {
    try {
      // Check if there's already an active connection
      if (this.activeConnections.has(challengeEntryId.toString())) {
        console.log(`WebSocket connection already exists for challenge entry ${challengeEntryId}`);
        return;
      }

      // Get challenge entry
      const entry = await ChallengeEntry.findByPk(challengeEntryId, {
        include: [
          { model: User, as: 'user' },
          { model: Challenge, as: 'challenge' }
        ]
      });

      if (!entry) {
        throw new Error(`Challenge entry ${challengeEntryId} not found`);
      }

      // Verify that we have valid cTrader credentials
      if (!entry.ctraderAccessToken || !entry.ctraderRefreshToken || !entry.ctraderAccountId) {
        throw new Error(`Missing cTrader credentials for challenge entry ${challengeEntryId}`);
      }

      // Log the connection attempt
      console.log(`Establishing WebSocket connection for challenge entry ${challengeEntryId}, account ${entry.ctraderAccountId}`);
      
      // Verify the cTrader API connection by testing the access token
      try {
        // Try to fetch account details to validate the token
        await this.getAccountDetails(entry.ctraderAccessToken, entry.ctraderAccountId);
      } catch (tokenError) {
        console.error(`Token validation failed for entry ${challengeEntryId}:`, tokenError);
        
        // Try to refresh the token
        try {
          console.log(`Attempting to refresh token for entry ${challengeEntryId}`);
          const tokenData = await this.refreshAccessToken(entry.ctraderRefreshToken);
          
          // Update entry with new tokens
          await entry.update({
            ctraderAccessToken: tokenData.access_token,
            ctraderRefreshToken: tokenData.refresh_token
          });
          
          // Use new access token
          entry.ctraderAccessToken = tokenData.access_token;
        } catch (refreshError) {
          console.error(`Token refresh failed for entry ${challengeEntryId}:`, refreshError);
          throw new Error('Failed to authenticate with cTrader. Please reconnect your account.');
        }
      }

      // Create WebSocket connection
      if (!CTRADER_WS_URL) {
        throw new Error('cTrader WebSocket URL not configured');
      }

      const ws = new WebSocket(`${CTRADER_WS_URL}?token=${entry.ctraderAccessToken}`);
      const customWs = ws as CustomWebSocket;
      
      // Set up ping interval to keep connection alive
      customWs.pingInterval = setInterval(() => {
        if (customWs.readyState === WebSocket.OPEN) {
          customWs.ping();
        }
      }, this.PING_INTERVAL);

      // Handle WebSocket events
      ws.on('open', () => {
        console.log(`WebSocket connection opened for challenge entry ${challengeEntryId}`);
        
        // Reset connection retries
        this.connectionRetries.set(challengeEntryId.toString(), 0);
        
        // Subscribe to account updates
        const subscribeMessage = JSON.stringify({
          type: 'subscribe',
          topic: `account.${entry.ctraderAccountId}`
        });
        ws.send(subscribeMessage);

        // Store connection in active connections map
        this.activeConnections.set(challengeEntryId.toString(), customWs);
        
        // Update entry status
        entry.update({ connectStatus: 'connected' });
        
        // Notify user about successful connection
        if (entry.userId && socketService && socketService.to) {
          socketService.to(entry.userId.toString()).emit('notification', {
            title: 'cTrader Connected',
            message: 'Your cTrader account has been connected successfully.',
            type: 'connection'
          });
        }
      });

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.processWebSocketMessage(message, challengeEntryId);
        } catch (error) {
          console.error(`Error processing WebSocket message for entry ${challengeEntryId}:`, error);
        }
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for challenge entry ${challengeEntryId}:`, error);
      });

      ws.on('close', (code, reason) => {
        console.log(`WebSocket closed for challenge entry ${challengeEntryId}. Code: ${code}, Reason: ${reason}`);
        
        // Clear ping interval
        if (customWs.pingInterval) {
          clearInterval(customWs.pingInterval);
        }
        
        // Remove from active connections
        this.activeConnections.delete(challengeEntryId.toString());
        
        // Attempt to reconnect
        const retries = this.connectionRetries.get(challengeEntryId.toString()) || 0;
        if (retries < this.MAX_RETRY_ATTEMPTS) {
          this.connectionRetries.set(challengeEntryId.toString(), retries + 1);
          
          // Exponential backoff
          const delay = this.INITIAL_RETRY_DELAY * Math.pow(2, retries);
          console.log(`Attempting to reconnect WebSocket for entry ${challengeEntryId} in ${delay}ms (retry ${retries + 1}/${this.MAX_RETRY_ATTEMPTS})`);
          
          setTimeout(() => {
            this.reconnectWebSocket(challengeEntryId);
          }, delay);
        } else {
          console.log(`Max retry attempts reached for entry ${challengeEntryId}.`);
          
          // Update entry status
          entry.update({ connectStatus: 'disconnected' });
          
          // Notify user about disconnection
          if (entry.userId && socketService && socketService.to) {
            socketService.to(entry.userId.toString()).emit('notification', {
              title: 'cTrader Disconnected',
              message: 'Your cTrader connection has been lost. Please reconnect.',
              type: 'connection'
            });
          }
        }
      });

      // Handle app termination
      process.on('SIGINT', () => {
        this.disconnectWebSocket(challengeEntryId);
      });
    } catch (error) {
      // Update entry status on error
      try {
        const entry = await ChallengeEntry.findByPk(challengeEntryId);
        if (entry) {
          await entry.update({ connectStatus: 'disconnected' });
          
          // Notify user about connection failure
          if (entry.userId && socketService && socketService.to) {
            socketService.to(entry.userId.toString()).emit('notification', {
              title: 'cTrader Connection Failed',
              message: error instanceof Error ? error.message : 'Failed to connect to cTrader.',
              type: 'connection'
            });
          }
        }
      } catch (updateError) {
        console.error(`Failed to update entry status for ${challengeEntryId}:`, updateError);
      }
      
      console.error(`Failed to establish WebSocket connection for challenge entry ${challengeEntryId}:`, error);
      throw error;
    }
  }

  /**
   * Attempt to reconnect WebSocket with exponential backoff
   * @param challengeEntryId Challenge entry ID
   */
  private async reconnectWebSocket(challengeEntryId: number): Promise<void> {
    const entryId = challengeEntryId.toString();
    
    try {
      // Get retry count
      const retryCount = this.connectionRetries.get(entryId) || 0;
      
      // Check if max retries reached
      if (retryCount >= this.MAX_RETRY_ATTEMPTS) {
        console.error(`Maximum reconnection attempts reached for challenge entry: ${entryId}`);
        
        // Update connection status
        const entry = await ChallengeEntry.findByPk(challengeEntryId);
        if (entry) {
          await entry.update({ connectStatus: 'disconnected' });
          console.log(`Updated challenge entry ${entryId} status to disconnected after max retries`);
        }
        
        return;
      }
      
      // Increment retry count
      this.connectionRetries.set(entryId, retryCount + 1);
      
      // Calculate backoff delay
      const delay = this.INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
      
      // Log reconnection attempt
      console.log(`Attempting to reconnect WebSocket for challenge entry ${entryId}. Attempt ${retryCount + 1} of ${this.MAX_RETRY_ATTEMPTS} in ${delay}ms`);
      
      // Set timeout for reconnection
      setTimeout(async () => {
        try {
          // Check if token needs refresh
          const entry = await ChallengeEntry.findByPk(challengeEntryId);
          if (!entry || !entry.ctraderRefreshToken) {
            throw new Error('Challenge entry not found or refresh token missing');
          }
          
          // Refresh token if connection was previously established
          if (entry.connectStatus === 'connected') {
            console.log(`Refreshing access token for challenge entry ${entryId}`);
            const tokenData = await this.refreshAccessToken(entry.ctraderRefreshToken);
            
            // Update tokens in database
            await entry.update({
              ctraderAccessToken: tokenData.access_token,
              ctraderRefreshToken: tokenData.refresh_token
            });
            
            console.log(`Token refreshed successfully for challenge entry ${entryId}`);
          }
          
          // Establish new connection
          await this.establishWebSocketConnection(challengeEntryId);
        } catch (error) {
          console.error(`Error during WebSocket reconnection for challenge entry ${entryId}:`, error);
          
          // Try again with next backoff
          this.reconnectWebSocket(challengeEntryId);
        }
      }, delay);
    } catch (error) {
      console.error(`Error in reconnect logic for challenge entry ${entryId}:`, error);
    }
  }

  /**
   * Disconnect a WebSocket connection
   * @param challengeEntryId Challenge entry ID
   */
  public async disconnectWebSocket(challengeEntryId: number): Promise<void> {
    const entryId = challengeEntryId.toString();
    
    try {
      const ws = this.activeConnections.get(entryId);
      
      if (ws) {
        // Clear ping interval
        if (ws.pingInterval) {
          clearInterval(ws.pingInterval);
        }
        
        // Close connection
        ws.close(1000, 'Disconnected by user');
        
        // Remove from active connections
        this.activeConnections.delete(entryId);
        
        console.log(`WebSocket connection closed for challenge entry: ${entryId}`);
      }
    } catch (error) {
      console.error(`Error disconnecting WebSocket for challenge entry ${entryId}:`, error);
    }
  }

  /**
   * Handle user disqualification
   * @param challengeEntryId Challenge entry ID
   * @param reason Disqualification reason
   */
  private async handleDisqualification(challengeEntryId: number, reason: string): Promise<void> {
    try {
      const entry = await ChallengeEntry.findByPk(challengeEntryId);
      
      if (!entry || entry.disqualified) {
        return; // Already disqualified or entry not found
      }
      
      // Update entry status
      await entry.update({
        disqualified: true,
        disqualificationReason: reason
      });
      
      // Disconnect WebSocket
      await this.disconnectWebSocket(challengeEntryId);
      
      // Notify user via Socket.IO
      if (entry.userId && socketService && socketService.to) {
        try {
          socketService.to(entry.userId.toString()).emit('disqualified', {
            challengeEntryId,
            reason
          });
        } catch (socketError) {
          console.error('Socket notification error:', socketError);
        }
      }
      
      console.log(`User disqualified for challenge entry ${challengeEntryId}. Reason: ${reason}`);
    } catch (error) {
      console.error(`Error handling disqualification for challenge entry ${challengeEntryId}:`, error);
    }
  }
  
  /**
   * Get active WebSocket connections count
   */
  public getActiveConnectionsCount(): number {
    return this.activeConnections.size;
  }
  
  /**
   * Get connection status for a challenge entry
   * @param challengeEntryId Challenge entry ID
   */
  public isConnected(challengeEntryId: number): boolean {
    return this.activeConnections.has(challengeEntryId.toString());
  }
  
  /**
   * Get detailed connection status for debugging
   * @param challengeEntryId Challenge entry ID
   */
  public getConnectionStatus(challengeEntryId: number): any {
    const entryId = challengeEntryId.toString();
    const ws = this.activeConnections.get(entryId);
    
    if (!ws) {
      return {
        connected: false,
        readyState: null,
        retryCount: this.connectionRetries.get(entryId) || 0
      };
    }
    
    // Map WebSocket ready state to string for more readable output
    const readyStateMap = {
      [WebSocket.CONNECTING]: 'CONNECTING',
      [WebSocket.OPEN]: 'OPEN',
      [WebSocket.CLOSING]: 'CLOSING',
      [WebSocket.CLOSED]: 'CLOSED'
    };
    
    return {
      connected: ws.readyState === WebSocket.OPEN,
      readyState: readyStateMap[ws.readyState] || 'UNKNOWN',
      retryCount: this.connectionRetries.get(entryId) || 0
    };
  }
  
  /**
   * Start monitoring all connections periodically
   * This should be called at server startup
   * @param intervalMinutes How often to check connections (in minutes)
   */
  public startConnectionMonitoring(intervalMinutes: number = 5): NodeJS.Timeout {
    const intervalMs = intervalMinutes * 60 * 1000;
    
    console.log(`Starting cTrader WebSocket connection monitoring with ${intervalMinutes} minute interval`);
    
    const monitorInterval = setInterval(async () => {
      try {
        console.log('Checking cTrader WebSocket connections...');
        
        // Get all challenge entries that should be connected
        const entries = await ChallengeEntry.findAll({
          where: { connectStatus: 'connected' }
        });
        
        console.log(`Found ${entries.length} challenge entries that should be connected`);
        
        // Check each entry
        for (const entry of entries) {
          const isConnected = this.isConnected(entry.id);
          console.log(`Challenge entry ${entry.id}: WebSocket ${isConnected ? 'connected' : 'disconnected'}`);
          
          // Reconnect if not connected
          if (!isConnected) {
            console.log(`Reconnecting WebSocket for challenge entry ${entry.id}`);
            try {
              await this.establishWebSocketConnection(entry.id);
            } catch (error) {
              console.error(`Failed to reconnect WebSocket for challenge entry ${entry.id}:`, error);
            }
          }
        }
        
        console.log(`Active WebSocket connections: ${this.getActiveConnectionsCount()}`);
      } catch (error) {
        console.error('Error monitoring WebSocket connections:', error);
      }
    }, intervalMs);
    
    return monitorInterval;
  }
  
  /**
   * Stop connection monitoring
   * @param monitorInterval The interval returned by startConnectionMonitoring
   */
  public stopConnectionMonitoring(monitorInterval: NodeJS.Timeout): void {
    console.log('Stopping cTrader WebSocket connection monitoring');
    clearInterval(monitorInterval);
  }

  /**
   * Process WebSocket message from cTrader
   * @param message WebSocket message data
   * @param challengeEntryId Challenge entry ID
   */
  private async processWebSocketMessage(message: any, challengeEntryId: number): Promise<void> {
    try {
      // Check if this is a trade close event
      if (message && message.type === 'trade_close') {
        const tradeData = message.data;
        
        // Process the trade
        await this.processTrade(challengeEntryId, tradeData);
        
        // Update challenge metrics
        await this.updateChallengeEntryMetrics(challengeEntryId);
        
        // Get the challenge entry with its challenge details
        const entry = await ChallengeEntry.findByPk(challengeEntryId, {
          include: [{ model: User }, { model: Challenge }]
        });
        
        if (!entry || !entry.challenge || !entry.user) {
          throw new Error(`Failed to get complete entry data for ${challengeEntryId}`);
        }
        
        // Check if challenge rules are violated
        const isDisqualified = await this.checkDrawdownLimit(challengeEntryId);
        
        if (isDisqualified) {
          await this.handleDisqualification(challengeEntryId, 'Maximum drawdown exceeded');
        }
        
        // Update leaderboard for the challenge
        try {
          const leaderboardService = await import('./leaderboardService').then(mod => mod.default);
          await leaderboardService.updateLeaderboardAfterTrade(challengeEntryId);
        } catch (leaderboardError) {
          console.error(`Error updating leaderboard: ${leaderboardError}`);
        }
        
        // Notify via socket about trade update
        if (socketService) {
          socketService.to(entry.user.id).emit('trade_update', {
            challengeEntryId,
            trade: tradeData,
            metrics: entry.metrics
          });
        }
      }
    } catch (error) {
      console.error(`Error processing WebSocket message for entry ${challengeEntryId}:`, error);
    }
  }
}

export default new CtraderService(); 