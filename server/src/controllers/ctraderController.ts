import { Request, Response } from 'express';
import { createError } from '../middleware/errorHandler';
import ChallengeEntry from '../models/ChallengeEntry';
import ctraderService from '../services/ctraderService';
import { socketService } from '../index';
import axios from 'axios';
import * as querystring from 'querystring';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const {
  CTRADER_API_URL,
  CTRADER_CLIENT_ID,
  CTRADER_CLIENT_SECRET,
  CTRADER_REDIRECT_URI,
  TOKEN_REFRESH_INTERVAL,
} = process.env;

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

/**
 * Generate OAuth2 authorization URL
 */
export const getAuthorizationUrl = (req: Request, res: Response) => {
  try {
    const authUrl = ctraderService.getAuthorizationUrl();
    res.json({ url: authUrl });
  } catch (error) {
    console.error('Error generating authorization URL:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

/**
 * OAuth2 callback handler
 */
export const oauthCallback = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;
    const { challengeEntryId } = JSON.parse(state as string || '{}');

    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    if (!challengeEntryId) {
      return res.status(400).json({ message: 'Challenge entry ID is required' });
    }

    // Get access token
    const { accessToken, refreshToken } = await ctraderService.getAccessToken(code as string);

    // Fetch user accounts
    const accounts = await ctraderService.getUserAccounts(accessToken);

    // Update challenge entry with tokens
    const entry = await ChallengeEntry.findByPk(challengeEntryId);
    if (!entry) {
      return res.status(404).json({ message: 'Challenge entry not found' });
    }

    await entry.update({
      ctraderAccessToken: accessToken,
      ctraderRefreshToken: refreshToken,
      connectStatus: 'connected'
    });

    // Establish WebSocket connection
    await ctraderService.establishWebSocketConnection(challengeEntryId);

    // Redirect to frontend success page
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/ctrader-success?entryId=${challengeEntryId}`);
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    // Redirect to frontend error page
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/ctrader-error`);
  }
};

/**
 * Connect cTrader account to challenge entry
 */
export const connectAccount = async (req: Request, res: Response) => {
  try {
    const { challengeEntryId, accountId } = req.body;
    const userId = req.user?.id;

    if (!challengeEntryId) {
      return res.status(400).json({ message: 'Challenge entry ID is required' });
    }

    if (!accountId) {
      return res.status(400).json({ message: 'Account ID is required' });
    }

    // Find challenge entry
    const entry = await ChallengeEntry.findByPk(challengeEntryId);
    if (!entry) {
      return res.status(404).json({ message: 'Challenge entry not found' });
    }

    // Verify user owns the entry
    if (entry.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update challenge entry with account ID
    await entry.update({
      ctraderAccountId: accountId
    });

    // Generate OAuth URL with state
    const state = JSON.stringify({ challengeEntryId });
    const baseUrl = ctraderService.getAuthorizationUrl();
    const authUrl = `${baseUrl}&state=${encodeURIComponent(state)}`;

    res.json({ url: authUrl });
  } catch (error) {
    console.error('Error connecting account:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

/**
 * Disconnect cTrader account from challenge entry
 */
export const disconnectAccount = async (req: Request, res: Response) => {
  try {
    const { challengeEntryId } = req.params;
    const userId = req.user?.id;

    if (!challengeEntryId) {
      return res.status(400).json({ message: 'Challenge entry ID is required' });
    }

    // Find challenge entry
    const entry = await ChallengeEntry.findByPk(parseInt(challengeEntryId));
    if (!entry) {
      return res.status(404).json({ message: 'Challenge entry not found' });
    }

    // Verify user owns the entry
    if (entry.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Disconnect WebSocket if active
    await ctraderService.disconnectWebSocket(parseInt(challengeEntryId));

    // Update challenge entry
    await entry.update({
      ctraderAccessToken: '',
      ctraderRefreshToken: '',
      connectStatus: 'disconnected'
    });

    // Notify via socket
    if (socketService && userId) {
      try {
        socketService.to(userId.toString()).emit('notification', {
          title: 'cTrader Disconnected',
          message: 'Your cTrader account has been disconnected.',
          type: 'connection'
        });
      } catch (socketError) {
        console.error('Socket notification error:', socketError);
      }
    }

    res.json({ message: 'Account disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting account:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

/**
 * Manually fetch trades for a challenge entry
 */
export const fetchTrades = async (req: Request, res: Response) => {
  try {
    const { challengeEntryId } = req.params;
    const userId = req.user?.id;

    if (!challengeEntryId) {
      return res.status(400).json({ message: 'Challenge entry ID is required' });
    }

    // Find challenge entry
    const entry = await ChallengeEntry.findByPk(parseInt(challengeEntryId), {
      include: ['challenge']
    });
    
    if (!entry) {
      return res.status(404).json({ message: 'Challenge entry not found' });
    }

    // Verify user owns the entry
    if (entry.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Verify entry is connected
    if (entry.connectStatus !== 'connected' || !entry.ctraderAccessToken) {
      return res.status(400).json({ message: 'cTrader account not connected' });
    }

    // Check if WebSocket connection is active, if not establish it
    if (!ctraderService.isConnected(parseInt(challengeEntryId))) {
      await ctraderService.establishWebSocketConnection(parseInt(challengeEntryId));
    }

    // Fetch trades from cTrader
    const fromDate = entry.challenge ? new Date(entry.challenge.startDate) : new Date();
    const trades = await ctraderService.getAccountTrades(
      entry.ctraderAccessToken,
      entry.ctraderAccountId,
      fromDate
    );

    // Process trades
    for (const trade of trades) {
      await ctraderService.processTrade(parseInt(challengeEntryId), trade);
    }

    // Check if drawdown limit exceeded
    const exceededDrawdown = await ctraderService.checkDrawdownLimit(parseInt(challengeEntryId));
    if (exceededDrawdown && !entry.disqualified) {
      // Disqualify entry
      await entry.update({
        disqualified: true,
        disqualificationReason: 'Exceeded maximum drawdown'
      });

      // Notify via socket
      if (socketService && userId) {
        try {
          socketService.to(userId.toString()).emit('disqualified', {
            challengeEntryId: parseInt(challengeEntryId),
            reason: 'Exceeded maximum drawdown'
          });
        } catch (socketError) {
          console.error('Socket notification error:', socketError);
        }
      }
    }

    res.json({ 
      message: 'Trades fetched and processed successfully', 
      tradesCount: trades.length,
      websocketStatus: ctraderService.isConnected(parseInt(challengeEntryId)) ? 'connected' : 'disconnected'
    });
  } catch (error) {
    console.error('Error fetching trades:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

/**
 * Get account details
 */
export const getAccountDetails = async (req: Request, res: Response) => {
  try {
    const { challengeEntryId } = req.params;
    const userId = req.user?.id;

    if (!challengeEntryId) {
      return res.status(400).json({ message: 'Challenge entry ID is required' });
    }

    // Find challenge entry
    const entry = await ChallengeEntry.findByPk(parseInt(challengeEntryId));
    if (!entry) {
      return res.status(404).json({ message: 'Challenge entry not found' });
    }

    // Verify user owns the entry
    if (entry.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Verify entry is connected
    if (entry.connectStatus !== 'connected' || !entry.ctraderAccessToken) {
      return res.status(400).json({ message: 'cTrader account not connected' });
    }

    // Get account details
    const accountDetails = await ctraderService.getAccountDetails(
      entry.ctraderAccessToken,
      entry.ctraderAccountId
    );

    res.json(accountDetails);
  } catch (error) {
    console.error('Error getting account details:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

/**
 * Admin-only route to check WebSocket connection status for all challenge entries
 */
export const checkConnectionStatus = async (req: Request, res: Response) => {
  try {
    // In a real application, check if user is admin
    // if (!req.user?.isAdmin) {
    //   return res.status(403).json({ message: 'Admin access required' });
    // }

    // Get all challenge entries with connected status
    const entries = await ChallengeEntry.findAll({
      where: {
        connectStatus: 'connected'
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'username']
      }]
    });

    // Map entries to include WebSocket connection status
    const statusData = entries.map(entry => {
      const connectionStatus = ctraderService.getConnectionStatus(entry.id);
      return {
        id: entry.id,
        userId: entry.userId,
        user: entry.user,
        connectStatus: entry.connectStatus,
        websocketStatus: connectionStatus,
        lastConnection: entry.updatedAt
      };
    });

    // Get total counts
    const activeConnections = ctraderService.getActiveConnectionsCount();
    const totalEntries = entries.length;
    const disconnectedCount = entries.filter(entry => !ctraderService.isConnected(entry.id)).length;

    res.json({
      activeConnections,
      totalConnectedEntries: totalEntries,
      disconnectedEntries: disconnectedCount,
      connections: statusData,
      wsUrl: process.env.CTRADER_WS_URL || 'Default URL (check logs)'
    });
  } catch (error) {
    console.error('Error checking connection status:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

/**
 * Controller for handling cTrader API integration
 */
class CtraderController {
  /**
   * Generate the authorization URL for cTrader OAuth
   */
  public getAuthUrl(req: Request, res: Response): void {
    try {
      const authUrl = ctraderService.getAuthorizationUrl();
      res.json({ authUrl });
    } catch (error) {
      console.error('Error generating auth URL:', error);
      res.status(500).json({ message: 'Failed to generate authorization URL' });
    }
  }

  /**
   * Handle the callback from cTrader OAuth
   */
  public async handleCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.query;
      
      if (!code || typeof code !== 'string') {
        res.status(400).json({ message: 'Authorization code is missing or invalid' });
        return;
      }

      // Exchange authorization code for access token
      const { accessToken, refreshToken } = await ctraderService.getAccessToken(code);
      
      // Save token to user account
      if (req.user) {
        const userId = (req.user as any).id;
        
        // Get current user data
        const user = await User.findByPk(userId);
        if (!user) {
          res.status(404).json({ message: 'User not found' });
          return;
        }
        
        // Update with new cTrader data
        await User.update(
          {
            ctrader: JSON.stringify({
              accessToken,
              refreshToken,
              tokenExpiry: new Date(Date.now() + 3600 * 1000), // Default 1 hour expiry if not provided
              isConnected: true,
              accounts: []
            })
          },
          {
            where: { id: userId }
          }
        );
        
        // Fetch and save cTrader account info
        await this.fetchAndSaveAccountInfo(userId, accessToken);
        
        res.redirect('/dashboard?ctrader=connected');
      } else {
        res.status(401).json({ message: 'User not authenticated' });
      }
    } catch (error) {
      console.error('Error handling callback:', error);
      res.status(500).json({ message: 'Failed to process cTrader authorization' });
    }
  }

  /**
   * Fetch account info from cTrader API
   */
  private async fetchAndSaveAccountInfo(userId: string, accessToken: string): Promise<void> {
    try {
      const accounts = await ctraderService.getUserAccounts(accessToken);
      
      // Get current user data
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      // Get cTrader data
      const ctraderData = user.getCtraderData();
      
      // Update with new accounts
      await User.update(
        {
          ctrader: JSON.stringify({
            ...ctraderData,
            accounts
          })
        },
        {
          where: { id: userId }
        }
      );
    } catch (error) {
      console.error('Error fetching account info:', error);
      throw new Error('Failed to fetch cTrader account information');
    }
  }

  /**
   * Refresh the access token
   */
  public async refreshToken(userId: string): Promise<string | null> {
    try {
      const user = await User.findByPk(userId);
      
      if (!user) {
        return null;
      }
      
      // Get cTrader data
      const ctraderData = user.getCtraderData();
      
      if (!ctraderData.refreshToken) {
        return null;
      }

      const tokenData = await ctraderService.refreshAccessToken(ctraderData.refreshToken);
      
      // Update token in database
      await User.update(
        {
          ctrader: JSON.stringify({
            ...ctraderData,
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            tokenExpiry: new Date(Date.now() + tokenData.expires_in * 1000)
          })
        },
        {
          where: { id: userId }
        }
      );

      return tokenData.access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  /**
   * Disconnect cTrader account
   */
  public async disconnectAccount(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const userId = (req.user as any).id;
      
      await User.update(
        {
          ctrader: JSON.stringify({
            accessToken: '',
            refreshToken: '',
            tokenExpiry: null,
            isConnected: false,
            accounts: []
          })
        },
        {
          where: { id: userId }
        }
      );

      res.json({ message: 'cTrader account disconnected successfully' });
    } catch (error) {
      console.error('Error disconnecting account:', error);
      res.status(500).json({ message: 'Failed to disconnect cTrader account' });
    }
  }

  /**
   * Get user's cTrader account status and info
   */
  public async getAccountStatus(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const userId = (req.user as any).id;
      const user = await User.findByPk(userId);
      
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      // Get cTrader data
      const ctraderData = user.getCtraderData();

      // If token is about to expire, refresh it
      if (ctraderData.isConnected && ctraderData.tokenExpiry) {
        const expiryDate = new Date(ctraderData.tokenExpiry);
        if (expiryDate.getTime() - Date.now() < 300000) { // Less than 5 minutes until expiry
          await this.refreshToken(userId);
        }
      }

      res.json({
        isConnected: ctraderData.isConnected || false,
        accounts: ctraderData.accounts || [],
      });
    } catch (error) {
      console.error('Error getting account status:', error);
      res.status(500).json({ message: 'Failed to get cTrader account status' });
    }
  }

  /**
   * Connect cTrader account to challenge entry (for challenge-specific connections)
   */
  public async connectToChallengeEntry(req: Request, res: Response): Promise<void> {
    try {
      const { challengeEntryId, accountId } = req.body;
      const userId = (req.user as any).id;

      if (!challengeEntryId) {
        res.status(400).json({ message: 'Challenge entry ID is required' });
        return;
      }

      if (!accountId) {
        res.status(400).json({ message: 'Account ID is required' });
        return;
      }

      // Find challenge entry
      const entry = await ChallengeEntry.findByPk(challengeEntryId);
      if (!entry) {
        res.status(404).json({ message: 'Challenge entry not found' });
        return;
      }

      // Verify user owns the entry
      if (entry.userId !== userId) {
        res.status(403).json({ message: 'Unauthorized' });
        return;
      }

      // Update challenge entry with account ID
      await entry.update({
        ctraderAccountId: accountId,
        connectStatus: 'pending'
      });

      // Generate authorization URL with state for callback
      const state = JSON.stringify({ challengeEntryId });
      const authUrl = ctraderService.getAuthorizationUrl() + `&state=${encodeURIComponent(state)}`;

      res.json({ authUrl });
    } catch (error) {
      console.error('Error connecting to challenge entry:', error);
      res.status(500).json({ message: 'Failed to connect cTrader account to challenge' });
    }
  }

  /**
   * Disconnect cTrader account from challenge entry
   */
  public async disconnectFromChallengeEntry(req: Request, res: Response): Promise<void> {
    try {
      const { challengeEntryId } = req.params;
      const userId = (req.user as any).id;

      if (!challengeEntryId) {
        res.status(400).json({ message: 'Challenge entry ID is required' });
        return;
      }

      // Find challenge entry
      const entry = await ChallengeEntry.findByPk(parseInt(challengeEntryId));
      if (!entry) {
        res.status(404).json({ message: 'Challenge entry not found' });
        return;
      }

      // Verify user owns the entry
      if (entry.userId !== userId) {
        res.status(403).json({ message: 'Unauthorized' });
        return;
      }

      // Update challenge entry
      await entry.update({
        ctraderAccessToken: '',
        ctraderRefreshToken: '',
        connectStatus: 'disconnected'
      });

      // Send notification if possible
      // Note: This requires socketService implementation
      try {
        if (socketService?.to && userId) {
          socketService.to(userId.toString()).emit('notification', {
            title: 'cTrader Disconnected',
            message: 'Your cTrader account has been disconnected from the challenge.',
            type: 'connection'
          });
        }
      } catch (socketError) {
        console.error('Socket notification error:', socketError);
      }

      res.json({ message: 'Account disconnected from challenge successfully' });
    } catch (error) {
      console.error('Error disconnecting from challenge entry:', error);
      res.status(500).json({ message: 'Failed to disconnect cTrader account from challenge' });
    }
  }
}

export default new CtraderController(); 