import api from './api';

export interface Trade {
  id: string;
  challengeEntryId: string;
  symbol: string;
  direction: 'buy' | 'sell';
  openPrice: number;
  closePrice?: number;
  volume: number;
  openTime: string;
  closeTime?: string;
  pnl?: number;
  pnlPercentage?: number;
  status: 'open' | 'closed';
  createdAt: string;
  updatedAt: string;
}

const tradeService = {
  // Get trades for a specific challenge entry
  async getTradesByEntry(challengeEntryId: string) {
    try {
      const response = await api.get(`/trades/${challengeEntryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching trades for entry ${challengeEntryId}:`, error);
      throw error;
    }
  },

  // Get all user trades across all challenge entries
  async getAllUserTrades() {
    try {
      const response = await api.get('/trades/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching all user trades:', error);
      throw error;
    }
  },

  // Get open trades for a specific challenge entry
  async getOpenTradesByEntry(challengeEntryId: string) {
    try {
      const response = await api.get(`/trades/${challengeEntryId}?status=open`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching open trades for entry ${challengeEntryId}:`, error);
      throw error;
    }
  }
};

export default tradeService;
