import express from 'express';
import { User, Challenge, ChallengeEntry, WalletTransaction } from '../models';

const router = express.Router();

// Simple test endpoint
router.get('/', (req, res) => {
  res.status(200).json({ message: 'API is working!' });
});

// Test database connection
router.get('/db', async (req, res) => {
  try {
    // Test database connection
    const userCount = await User.count();
    const challengeCount = await Challenge.count();
    const entryCount = await ChallengeEntry.count();
    const walletCount = await WalletTransaction.count();

    res.status(200).json({
      message: 'Database connection successful',
      counts: {
        users: userCount,
        challenges: challengeCount,
        entries: entryCount,
        walletTransactions: walletCount
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;
