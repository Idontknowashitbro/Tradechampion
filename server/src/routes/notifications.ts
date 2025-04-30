import express from 'express';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import {
  getNotifications,
  markAsRead,
  createNotification,
  broadcastNotification
} from '../controllers/notificationController';

const router = express.Router();

// User routes
router.get('/', authenticate, getNotifications);
router.patch('/:id/read', authenticate, markAsRead);

// Admin routes
router.post('/', authenticate, createNotification);
router.post('/broadcast', authenticate, authorizeAdmin, broadcastNotification);

export default router; 