import { Request, Response } from 'express';
import Notification from '../models/Notification';
import { AuthenticatedRequest } from '../types/auth';
import User from '../models/User';
import { socketService } from '../index';
import { Op } from 'sequelize';

/**
 * Get notifications for the authenticated user
 * @route GET /api/notifications
 */
export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Parse query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const unreadOnly = req.query.unread === 'true';

    // Build query options
    const queryOptions: any = {
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    };

    // Add unread filter if specified
    if (unreadOnly) {
      queryOptions.where.read = false;
    }

    // Get total count for pagination
    const totalCount = await Notification.count({
      where: queryOptions.where,
    });

    // Get notifications
    const notifications = await Notification.findAll(queryOptions);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return res.status(200).json({
      notifications,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

/**
 * Create a new notification
 * @route POST /api/notifications
 */
export const createNotification = async (req: Request, res: Response) => {
  try {
    const { userId, type, title, message, data = {} } = req.body;

    // Validate required fields
    if (!userId || !type || !title || !message) {
      return res.status(400).json({ 
        message: 'Missing required fields. userId, type, title, and message are required.' 
      });
    }

    // Check if user exists
    const userExists = await User.findByPk(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create notification
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      data,
      read: false,
    });

    return res.status(201).json({
      message: 'Notification created successfully',
      notification,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return res.status(500).json({ message: 'Failed to create notification' });
  }
};

/**
 * Mark notification(s) as read
 * @route PATCH /api/notifications/:id?/read
 */
export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { notificationIds } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return res.status(400).json({ message: 'Invalid notification IDs' });
    }
    // Convert all IDs to numbers and filter out invalid ones
    const parsedIds: number[] = notificationIds.map((id: any) => Number(id)).filter((id: number) => !isNaN(id));
    if (parsedIds.length === 0) {
      return res.status(400).json({ message: 'No valid notification IDs provided' });
    }
    await Notification.update(
      { read: true },
      { 
        where: { 
          id: parsedIds,
          userId 
        } 
      }
    );
    
    return res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete notification(s)
 * @route DELETE /api/notifications/:id?
 */
export const deleteNotification = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Ensure id is always a string before parsing
    const idStr: string = String(req.params.id);
    const userId = req.user.id;
    // Check if user is trying to delete all notifications
    if (idStr === 'all') {
      await Notification.destroy({ where: { userId } });
      return res.status(200).json({ message: 'All notifications deleted' });
    }

    // Parse id to number
    const parsedId: number = Number(idStr);
    if (isNaN(parsedId)) {
      return res.status(400).json({ message: 'Invalid notification ID' });
    }

    // Find and delete specific notification
    const result = await Notification.destroy({
      where: {
        id: parsedId,
        userId
      }
    });

    if (result === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({ message: 'Failed to delete notification' });
  }
};

/**
 * Broadcast a notification to all users (admin only)
 * @route POST /api/notifications/broadcast
 */
export const broadcastNotification = async (req: Request, res: Response) => {
  try {
    const { title, message, type } = req.body;

    // Validate required fields
    if (!title || !message || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get all active users
    const users = await User.findAll({
      where: { status: 'active' }
    });

    const notifications = [];

    // Create notifications for each user
    for (const user of users) {
      const notification = await Notification.create({
        userId: typeof user.id === 'string' ? parseInt(user.id, 10) : user.id,
        title,
        message,
        type,
        data: req.body.data || {},
        read: false
      });

      notifications.push(notification);

      // Send real-time notification via Socket.IO
      socketService.to(String(user.id)).emit('notification', {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type
      });
    }

    res.status(201).json({
      message: `Notification broadcast to ${users.length} users`,
      notificationCount: notifications.length
    });
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

class NotificationController {
  // Get all notifications for the authenticated user
  async getUserNotifications(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const notifications = await Notification.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']]
      });
      
      return res.status(200).json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // Get count of unread notifications
  async getUnreadCount(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const count = await Notification.count({
        where: { 
          userId,
          read: false 
        }
      });
      
      return res.status(200).json({ count });
    } catch (error) {
      console.error('Error counting unread notifications:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // Mark all notifications as read
  async markAllAsRead(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      await Notification.update(
        { read: true },
        { where: { userId } }
      );
      
      return res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // Create a notification (admin only)
  async createNotification(req: AuthenticatedRequest, res: Response) {
    try {
      const { userId, type, title, message, data = {} } = req.body;
      
      // Here you might want to add admin check
      // if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
      
      if (!userId || !type || !title || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // Ensure userId is a number for database consistency
      const parsedUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
      if (isNaN(parsedUserId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      
      const notification = await Notification.create({
        userId: parsedUserId,
        type,
        title,
        message,
        data,
        read: false
      });
      
      return res.status(201).json(notification);
    } catch (error) {
      console.error('Error creating notification:', error);
      return res.status(500).json({ message: 'Failed to create notification' });
    }
  }
}

export default new NotificationController(); 