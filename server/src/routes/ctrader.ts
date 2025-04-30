import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getAuthorizationUrl,
  oauthCallback,
  connectAccount,
  disconnectAccount,
  fetchTrades,
  getAccountDetails,
  checkConnectionStatus
} from '../controllers/ctraderController';

const router = Router();

// Public routes
router.get('/auth-url', authenticate, getAuthorizationUrl);
router.get('/callback', oauthCallback);

// Protected routes
router.post('/connect', authenticate, connectAccount);
router.post('/disconnect/:challengeEntryId', authenticate, disconnectAccount);
router.get('/trades/:challengeEntryId', authenticate, fetchTrades);
router.get('/account/:challengeEntryId', authenticate, getAccountDetails);

// Admin route to check all WebSocket connection status
router.get('/admin/connections', authenticate, checkConnectionStatus);

export default router; 