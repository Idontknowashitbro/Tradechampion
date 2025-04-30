/// <reference types="node" />
import { Server as SocketServer } from 'socket.io';
import { Server } from 'http';
interface NotificationData {
    title: string;
    message: string;
    type: string;
    data?: any;
}
declare class SocketService {
    private io;
    private userSockets;
    private cTraderConnections;
    constructor(server: Server);
    private setupSocketAuth;
    private setupEventHandlers;
    private handleConnection;
    /**
     * Send a notification to a specific user
     */
    sendNotification(userId: string, notification: NotificationData): boolean;
    /**
     * Send a notification to all users
     */
    broadcastNotification(notification: NotificationData): boolean;
    /**
     * Send a notification to all admins
     */
    notifyAdmins(notification: NotificationData): boolean;
    /**
     * Update leaderboard for a specific challenge
     */
    updateLeaderboard(challengeId: string, leaderboardData: any): boolean;
    /**
     * Handle cTrader connection status update
     */
    updateConnectionStatus(userId: string, challengeId: string, status: string): boolean;
    /**
     * Get the socket.io instance
     */
    getIO(): SocketServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
    updateLeaderboardForChallenge(challengeId: number | string, leaderboard: any): boolean;
}
export default SocketService;
