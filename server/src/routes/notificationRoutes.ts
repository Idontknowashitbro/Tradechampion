import { Router } from 'express';
import notificationController from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';
import { markAsRead, deleteNotification } from '../controllers/notificationController';

const router = Router();

// Get all notifications for the authenticated user
router.get('/', authenticate, notificationController.getUserNotifications);

// Get count of unread notifications
router.get('/unread/count', authenticate, notificationController.getUnreadCount);

// Mark specific notifications as read
router.put('/read', authenticate, markAsRead);

// Mark all notifications as read
router.put('/read/all', authenticate, notificationController.markAllAsRead);

// Delete a notification
router.delete('/:id', authenticate, deleteNotification);

// Admin route to create a notification for a user
router.post('/admin/create', authenticate, notificationController.createNotification);

export default router; 