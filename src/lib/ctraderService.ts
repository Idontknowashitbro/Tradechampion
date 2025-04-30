import api from './api';

export interface CTraderAccount {
  id: string;
  accountId: string;
  accountName: string;
  broker: string;
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  leverage: number;
  marginLevel: number;
  connected: boolean;
  lastConnected: string;
}

export interface CTraderConnection {
  challengeEntryId: string;
  accountId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  connected: boolean;
}

const ctraderService = {
  // Get authorization URL for cTrader OAuth
  async getAuthUrl() {
    try {
      const response = await api.get('/ctrader/auth-url');
      return response.data.url;
    } catch (error) {
      console.error('Error getting cTrader auth URL:', error);
      throw error;
    }
  },

  // Connect cTrader account to a challenge entry
  async connectAccount(challengeEntryId: string, code: string) {
    try {
      const response = await api.post('/ctrader/connect', {
        challengeEntryId,
        code
      });
      return response.data;
    } catch (error) {
      console.error('Error connecting cTrader account:', error);
      throw error;
    }
  },

  // Disconnect cTrader account from a challenge entry
  async disconnectAccount(challengeEntryId: string) {
    try {
      const response = await api.post(`/ctrader/disconnect/${challengeEntryId}`);
      return response.data;
    } catch (error) {
      console.error('Error disconnecting cTrader account:', error);
      throw error;
    }
  },

  // Get cTrader account details for a challenge entry
  async getAccountDetails(challengeEntryId: string) {
    try {
      const response = await api.get(`/ctrader/account/${challengeEntryId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting cTrader account details:', error);
      throw error;
    }
  },

  // Get trades for a challenge entry
  async getTrades(challengeEntryId: string) {
    try {
      const response = await api.get(`/ctrader/trades/${challengeEntryId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting cTrader trades:', error);
      throw error;
    }
  },

  // Check connection status
  async checkConnectionStatus() {
    try {
      const response = await api.get('/ctrader/admin/connections');
      return response.data;
    } catch (error) {
      console.error('Error checking cTrader connection status:', error);
      throw error;
    }
  }
};

export default ctraderService;
