"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastNotification = exports.deleteNotification = exports.markAsRead = exports.createNotification = exports.getNotifications = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const User_1 = __importDefault(require("../models/User"));
const index_1 = require("../index");
/**
 * Get notifications for the authenticated user
 * @route GET /api/notifications
 */
const getNotifications = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        // Parse query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const unreadOnly = req.query.unread === 'true';
        // Build query options
        const queryOptions = {
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
        const totalCount = await Notification_1.default.count({
            where: queryOptions.where,
        });
        // Get notifications
        const notifications = await Notification_1.default.findAll(queryOptions);
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
    }
    catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ message: 'Failed to fetch notifications' });
    }
};
exports.getNotifications = getNotifications;
/**
 * Create a new notification
 * @route POST /api/notifications
 */
const createNotification = async (req, res) => {
    try {
        const { userId, type, title, message, data = {} } = req.body;
        // Validate required fields
        if (!userId || !type || !title || !message) {
            return res.status(400).json({
                message: 'Missing required fields. userId, type, title, and message are required.'
            });
        }
        // Check if user exists
        const userExists = await User_1.default.findByPk(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Create notification
        const notification = await Notification_1.default.create({
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
    }
    catch (error) {
        console.error('Error creating notification:', error);
        return res.status(500).json({ message: 'Failed to create notification' });
    }
};
exports.createNotification = createNotification;
/**
 * Mark notification(s) as read
 * @route PATCH /api/notifications/:id?/read
 */
const markAsRead = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { notificationIds } = req.body;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!notificationIds || !Array.isArray(notificationIds)) {
            return res.status(400).json({ message: 'Invalid notification IDs' });
        }
        // Convert all IDs to numbers and filter out invalid ones
        const parsedIds = notificationIds.map((id) => Number(id)).filter((id) => !isNaN(id));
        if (parsedIds.length === 0) {
            return res.status(400).json({ message: 'No valid notification IDs provided' });
        }
        await Notification_1.default.update({ read: true }, {
            where: {
                id: parsedIds,
                userId
            }
        });
        return res.status(200).json({ message: 'Notifications marked as read' });
    }
    catch (error) {
        console.error('Error marking notifications as read:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.markAsRead = markAsRead;
/**
 * Delete notification(s)
 * @route DELETE /api/notifications/:id?
 */
const deleteNotification = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        // Ensure id is always a string before parsing
        const idStr = String(req.params.id);
        const userId = req.user.id;
        // Check if user is trying to delete all notifications
        if (idStr === 'all') {
            await Notification_1.default.destroy({ where: { userId } });
            return res.status(200).json({ message: 'All notifications deleted' });
        }
        // Parse id to number
        const parsedId = Number(idStr);
        if (isNaN(parsedId)) {
            return res.status(400).json({ message: 'Invalid notification ID' });
        }
        // Find and delete specific notification
        const result = await Notification_1.default.destroy({
            where: {
                id: parsedId,
                userId
            }
        });
        if (result === 0) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        return res.status(200).json({ message: 'Notification deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting notification:', error);
        return res.status(500).json({ message: 'Failed to delete notification' });
    }
};
exports.deleteNotification = deleteNotification;
/**
 * Broadcast a notification to all users (admin only)
 * @route POST /api/notifications/broadcast
 */
const broadcastNotification = async (req, res) => {
    try {
        const { title, message, type } = req.body;
        // Validate required fields
        if (!title || !message || !type) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // Get all active users
        const users = await User_1.default.findAll({
            where: { status: 'active' }
        });
        const notifications = [];
        // Create notifications for each user
        for (const user of users) {
            const notification = await Notification_1.default.create({
                userId: typeof user.id === 'string' ? parseInt(user.id, 10) : user.id,
                title,
                message,
                type,
                data: req.body.data || {},
                read: false
            });
            notifications.push(notification);
            // Send real-time notification via Socket.IO
            index_1.socketService.to(String(user.id)).emit('notification', {
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
    }
    catch (error) {
        console.error('Error broadcasting notification:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.broadcastNotification = broadcastNotification;
class NotificationController {
    // Get all notifications for the authenticated user
    async getUserNotifications(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const notifications = await Notification_1.default.findAll({
                where: { userId },
                order: [['createdAt', 'DESC']]
            });
            return res.status(200).json(notifications);
        }
        catch (error) {
            console.error('Error fetching notifications:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    // Get count of unread notifications
    async getUnreadCount(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const count = await Notification_1.default.count({
                where: {
                    userId,
                    read: false
                }
            });
            return res.status(200).json({ count });
        }
        catch (error) {
            console.error('Error counting unread notifications:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    // Mark all notifications as read
    async markAllAsRead(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            await Notification_1.default.update({ read: true }, { where: { userId } });
            return res.status(200).json({ message: 'All notifications marked as read' });
        }
        catch (error) {
            console.error('Error marking all notifications as read:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    // Create a notification (admin only)
    async createNotification(req, res) {
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
            const notification = await Notification_1.default.create({
                userId: parsedUserId,
                type,
                title,
                message,
                data,
                read: false
            });
            return res.status(201).json(notification);
        }
        catch (error) {
            console.error('Error creating notification:', error);
            return res.status(500).json({ message: 'Failed to create notification' });
        }
    }
}
exports.default = new NotificationController();
//# sourceMappingURL=notificationController.js.map