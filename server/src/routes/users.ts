import express from 'express';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import {
  getUsers,
  getUserById,
  getUserProfile,
  updateUser,
  updateUserStatus,
  updateUserWallet
} from '../controllers/userController';

const router = express.Router();

// Public routes

// Protected routes
router.get('/profile', authenticate, getUserProfile);

// Admin routes
router.get('/', authenticate, authorizeAdmin, getUsers);
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, authorizeAdmin, updateUser);
router.patch('/:id/status', authenticate, authorizeAdmin, updateUserStatus);
router.patch('/:id/wallet', authenticate, authorizeAdmin, updateUserWallet);

export default router; 