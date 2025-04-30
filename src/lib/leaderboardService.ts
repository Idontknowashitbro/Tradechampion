import api from './api';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  challengeEntryId: string;
  pnlPercentage: number;
  maxDrawdown: number;
  tradesCount: number;
  lastTradeTime?: string;
  status: 'active' | 'disqualified';
  disqualificationReason?: string;
}

const leaderboardService = {
  // Get leaderboard for a specific challenge
  async getLeaderboard(challengeId: string) {
    try {
      const response = await api.get(`/leaderboards/${challengeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching leaderboard for challenge ${challengeId}:`, error);
      throw error;
    }
  },

  // Get top performers for a specific challenge
  async getTopPerformers(challengeId: string, percentage: number = 30) {
    try {
      const response = await api.get(`/leaderboards/${challengeId}/top/${percentage}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching top performers for challenge ${challengeId}:`, error);
      throw error;
    }
  },

  // Get disqualified entries for a specific challenge
  async getDisqualifiedEntries(challengeId: string) {
    try {
      const response = await api.get(`/leaderboards/${challengeId}/disqualified`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching disqualified entries for challenge ${challengeId}:`, error);
      throw error;
    }
  },

  // Get entries at risk of disqualification
  async getEntriesAtRisk(challengeId: string, threshold: number = 90) {
    try {
      const response = await api.get(`/leaderboards/${challengeId}/at-risk/${threshold}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching at-risk entries for challenge ${challengeId}:`, error);
      throw error;
    }
  }
};

export default leaderboardService;
