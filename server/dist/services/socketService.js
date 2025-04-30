"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class SocketService {
    constructor(server) {
        this.userSockets = new Map();
        this.cTraderConnections = new Map();
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: process.env.NODE_ENV === 'production'
                    ? 'https://tradechampionx.com'
                    : 'http://localhost:8080',
                methods: ['GET', 'POST'],
                credentials: true
            }
        });
        this.setupSocketAuth();
        this.setupEventHandlers();
    }
    setupSocketAuth() {
        this.io.use((socket, next) => {
            try {
                const token = socket.handshake.auth.token;
                if (!token) {
                    return next(new Error('Authentication error: No token provided'));
                }
                // Verify token
                const secret = process.env.JWT_SECRET || 'default_jwt_secret';
                const decoded = jsonwebtoken_1.default.verify(token, secret);
                socket.data.user = {
                    id: decoded.id,
                    role: decoded.role
                };
                next();
            }
            catch (error) {
                console.error('Socket authentication error:', error);
                next(new Error('Authentication error'));
            }
        });
    }
    setupEventHandlers() {
        this.io.on('connection', this.handleConnection.bind(this));
    }
    handleConnection(socket) {
        console.log('User connected to socket:', socket.id);
        // Join room based on user ID
        if (socket.data.user) {
            socket.join(socket.data.user.id);
            console.log(`User ${socket.data.user.id} joined their room`);
            // If user is admin, join admin room
            if (socket.data.user.role === 'admin') {
                socket.join('admin');
                console.log(`Admin user ${socket.data.user.id} joined admin room`);
            }
        }
        // Handle joining challenge rooms
        socket.on('join_challenge', (challengeId) => {
            if (socket.data.user) {
                const roomName = `challenge-${challengeId}`;
                socket.join(roomName);
                console.log(`User ${socket.data.user.id} joined room: ${roomName}`);
            }
        });
        // Handle leaving challenge rooms
        socket.on('leave_challenge', (challengeId) => {
            if (socket.data.user) {
                const roomName = `challenge-${challengeId}`;
                socket.leave(roomName);
                console.log(`User ${socket.data.user.id} left room: ${roomName}`);
            }
        });
        socket.on('disconnect', () => {
            console.log('User disconnected from socket:', socket.id);
        });
    }
    /**
     * Send a notification to a specific user
     */
    sendNotification(userId, notification) {
        this.io.to(userId).emit('notification', notification);
        console.log(`Notification sent to user ${userId}: ${notification.title}`);
        return true;
    }
    /**
     * Send a notification to all users
     */
    broadcastNotification(notification) {
        this.io.emit('notification', notification);
        console.log(`Broadcast notification sent: ${notification.title}`);
        return true;
    }
    /**
     * Send a notification to all admins
     */
    notifyAdmins(notification) {
        this.io.to('admin').emit('admin_notification', notification);
        console.log(`Admin notification sent: ${notification.title}`);
        return true;
    }
    /**
     * Update leaderboard for a specific challenge
     */
    updateLeaderboard(challengeId, leaderboardData) {
        const roomName = `challenge-${challengeId}`;
        this.io.to(roomName).emit('leaderboard_update', {
            challengeId,
            leaderboard: leaderboardData
        });
        console.log(`Leaderboard updated for challenge ${challengeId}`);
        return true;
    }
    /**
     * Handle cTrader connection status update
     */
    updateConnectionStatus(userId, challengeId, status) {
        this.io.to(userId).emit('ctrader_connection', {
            challengeId,
            status
        });
        console.log(`cTrader connection status updated for user ${userId}, challenge ${challengeId}: ${status}`);
        return true;
    }
    /**
     * Get the socket.io instance
     */
    getIO() {
        return this.io;
    }
    // Methods to emit events to clients
    // Update leaderboard for a challenge
    updateLeaderboardForChallenge(challengeId, leaderboard) {
        // Emit to challenge-specific room
        const roomName = `challenge-${challengeId}`;
        this.io.to(roomName).emit('leaderboard_update', leaderboard);
        console.log(`Leaderboard updated for challenge ${challengeId}`);
        return true;
    }
}
exports.default = SocketService;
//# sourceMappingURL=socketService.js.map