import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth';
import * as adminController from '../controllers/adminController';
import * as cryptoPaymentAdminController from '../controllers/cryptoPaymentAdminController';

const router = express.Router();

// Require admin authentication for all routes
router.use(authenticate, isAdmin);

// Admin dashboard routes
router.get('/dashboard', adminController.getDashboardStats);

// User management routes
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Challenge management routes
router.get('/challenges', adminController.getChallenges);
router.get('/challenges/:id', adminController.getChallenge);
router.post('/challenges', adminController.createChallenge);
router.put('/challenges/:id', adminController.updateChallenge);
router.delete('/challenges/:id', adminController.deleteChallenge);

// Crypto payment management routes
router.get('/crypto/payments', cryptoPaymentAdminController.getAllPayments);
router.get('/crypto/payments/:id', cryptoPaymentAdminController.getPaymentById);
router.post('/crypto/payments/:id/refresh', cryptoPaymentAdminController.refreshPaymentStatus);
router.post('/crypto/payments/:id/refund', cryptoPaymentAdminController.refundPayment);

export default router; 