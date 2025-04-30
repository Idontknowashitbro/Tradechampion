import api from './api';

export interface Challenge {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly';
  description: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  entryFee: number;
  prizePool: number;
  participantsCount: number;
  maxDrawdown: number;
  maxRiskPerTrade: number;
  rules: string[];
}

export interface ChallengeEntry {
  id: string;
  challengeId: string;
  userId: string;
  status: 'active' | 'completed' | 'disqualified';
  rank?: number;
  pnlPercentage?: number;
  maxDrawdown?: number;
  tradesCount?: number;
  initialBalance?: number;
  currentBalance?: number;
  createdAt: string;
  updatedAt: string;
}

const challengeService = {
  // Get all active challenges
  async getActiveChallenges() {
    try {
      const response = await api.get('/challenges?status=active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active challenges:', error);
      throw error;
    }
  },

  // Get all challenges
  async getAllChallenges() {
    try {
      const response = await api.get('/challenges');
      return response.data;
    } catch (error) {
      console.error('Error fetching all challenges:', error);
      throw error;
    }
  },

  // Get challenge by ID
  async getChallengeById(id: string) {
    try {
      const response = await api.get(`/challenges/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching challenge ${id}:`, error);
      throw error;
    }
  },

  // Get user's active challenge entries
  async getUserActiveChallengeEntries() {
    try {
      const response = await api.get('/challenge-entries/user?status=active');
      return response.data;
    } catch (error) {
      console.error('Error fetching user active challenge entries:', error);
      throw error;
    }
  },

  // Get user's completed challenge entries
  async getUserCompletedChallengeEntries() {
    try {
      const response = await api.get('/challenge-entries/user?status=completed');
      return response.data;
    } catch (error) {
      console.error('Error fetching user completed challenge entries:', error);
      throw error;
    }
  },

  // Enter a challenge
  async enterChallenge(challengeId: string) {
    try {
      const response = await api.post('/challenge-entries', { challengeId });
      return response.data;
    } catch (error) {
      console.error(`Error entering challenge ${challengeId}:`, error);
      throw error;
    }
  },

  // Get challenge entry by ID
  async getChallengeEntryById(id: string) {
    try {
      const response = await api.get(`/challenge-entries/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching challenge entry ${id}:`, error);
      throw error;
    }
  }
};

export default challengeService;
