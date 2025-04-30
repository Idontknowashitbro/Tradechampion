import api from './api';

export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  referenceId?: string;
  referenceType?: 'challenge_entry' | 'prize' | 'admin_adjustment';
  balanceAfter: number;
  createdAt: string;
}

const walletService = {
  // Get wallet transactions for the current user
  async getTransactions() {
    try {
      const response = await api.get('/wallet/transactions');
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet transactions:', error);
      throw error;
    }
  },

  // Pay for a challenge entry using wallet credits
  async payWithWallet(challengeId: string) {
    try {
      const response = await api.post('/wallet/pay', { challengeId });
      return response.data;
    } catch (error) {
      console.error(`Error paying for challenge ${challengeId} with wallet:`, error);
      throw error;
    }
  },

  // Get wallet balance
  async getWalletBalance() {
    try {
      const response = await api.get('/users/profile');
      return response.data.walletBalance;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      throw error;
    }
  }
};

export default walletService;
