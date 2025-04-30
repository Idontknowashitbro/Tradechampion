import express from 'express';
import { 
  getLeaderboard, 
  getTopPerformers, 
  updateLeaderboard,
  getDisqualifiedEntries,
  getEntriesAtRisk
} from '../controllers/leaderboardController';
import { authenticateJWT, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Public route to get leaderboard
router.get('/:challengeId', getLeaderboard);

// Get top performers (useful for prize distribution)
router.get('/:challengeId/top/:percentage', authenticateJWT, getTopPerformers);

// Get disqualified entries with reasons
router.get('/:challengeId/disqualified', authenticateJWT, getDisqualifiedEntries);

// Get entries at risk of disqualification
router.get('/:challengeId/at-risk/:threshold?', authenticateJWT, getEntriesAtRisk);

// Admin only - manually update leaderboard
router.post('/:challengeId/update', authenticateJWT, isAdmin, updateLeaderboard);

export default router; 