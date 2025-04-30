import express from 'express';
import { authenticate } from '../middleware/auth';
import * as cryptoPaymentController from '../controllers/cryptoPaymentController';
import * as cryptoWalletController from '../controllers/cryptoWalletController';

const router = express.Router();

// Crypto payment routes
router.get('/currencies', authenticate, cryptoPaymentController.getAvailableCurrencies);
router.get('/estimate', authenticate, cryptoPaymentController.getEstimatedPrice);
router.post('/payment', authenticate, cryptoPaymentController.createPayment);
router.get('/payment/:id', authenticate, cryptoPaymentController.getPaymentStatus);
router.get('/payments', authenticate, cryptoPaymentController.getPaymentHistory);
router.post('/webhook', cryptoPaymentController.handleWebhook); // No auth required for webhooks

// Crypto wallet routes
router.get('/wallets', authenticate, cryptoWalletController.getUserWallets);
router.post('/wallets', authenticate, cryptoWalletController.addWallet);
router.put('/wallets/:id', authenticate, cryptoWalletController.updateWallet);
router.delete('/wallets/:id', authenticate, cryptoWalletController.deleteWallet);
router.put('/wallets/:id/default', authenticate, cryptoWalletController.setDefaultWallet);

export default router; 