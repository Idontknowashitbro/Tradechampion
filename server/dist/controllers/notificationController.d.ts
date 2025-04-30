import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
/**
 * Get notifications for the authenticated user
 * @route GET /api/notifications
 */
export declare const getNotifications: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Create a new notification
 * @route POST /api/notifications
 */
export declare const createNotification: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Mark notification(s) as read
 * @route PATCH /api/notifications/:id?/read
 */
export declare const markAsRead: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Delete notification(s)
 * @route DELETE /api/notifications/:id?
 */
export declare const deleteNotification: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * Broadcast a notification to all users (admin only)
 * @route POST /api/notifications/broadcast
 */
export declare const broadcastNotification: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare class NotificationController {
    getUserNotifications(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getUnreadCount(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    markAllAsRead(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    createNotification(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: NotificationController;
export default _default;
