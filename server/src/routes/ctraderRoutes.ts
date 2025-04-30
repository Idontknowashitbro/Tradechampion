import express from 'express';
import ctraderController from '../controllers/ctraderController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// Generate authorization URL for cTrader OAuth
router.get('/auth-url', authenticateJWT, ctraderController.getAuthUrl);

// Handle OAuth callback from cTrader
router.get('/callback', authenticateJWT, ctraderController.handleCallback);

// Disconnect cTrader account
router.post('/disconnect', authenticateJWT, ctraderController.disconnectAccount);

// Get account status and info
router.get('/status', authenticateJWT, ctraderController.getAccountStatus);

// Challenge-specific routes
router.post('/connect-challenge', authenticateJWT, ctraderController.connectToChallengeEntry);
router.post('/disconnect-challenge/:challengeEntryId', authenticateJWT, ctraderController.disconnectFromChallengeEntry);

export default router; 