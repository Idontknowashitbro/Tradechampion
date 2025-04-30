import express from 'express';
import { authenticate } from '../middleware/auth';
import { getTradesByEntry, logTrade } from '../controllers/tradeController';

const router = express.Router();

// Routes
router.get('/:challengeEntryId', authenticate, getTradesByEntry);
router.post('/', authenticate, logTrade);

export default router; 