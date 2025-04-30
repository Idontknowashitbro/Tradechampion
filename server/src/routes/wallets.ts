import express from 'express';
import { authenticate } from '../middleware/auth';
import { getTransactions, payWithWallet } from '../controllers/walletController';

const router = express.Router();

// Routes
router.get('/transactions', authenticate, getTransactions);
router.post('/pay', authenticate, payWithWallet);

export default router; 