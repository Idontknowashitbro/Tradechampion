import { Server as SocketServer, Socket } from 'socket.io';
import { Server } from 'http';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Interface for socket data with authentication
interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: any;
  cTraderConnected?: boolean;
  data: {
    user?: {
      id: string;
      role: string;
    }
  }
}

interface NotificationData {
  title: string;
  message: string;
  type: string;
  data?: any;
}

class SocketService {
  private io: SocketServer;
  private userSockets: Map<string, string[]> = new Map();
  private cTraderConnections: Map<string, boolean> = new Map();

  constructor(server: Server) {
    this.io = new SocketServer(server, {
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

  private setupSocketAuth() {
    this.io.use((socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        // Verify token
        const secret = process.env.JWT_SECRET || 'default_jwt_secret';
        const decoded = jwt.verify(token, secret) as any;
        socket.data.user = {
          id: decoded.id,
          role: decoded.role
        };
        next();
      } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication error'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', this.handleConnection.bind(this));
  }

  private handleConnection(socket: AuthenticatedSocket) {
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
  public sendNotification(userId: string, notification: NotificationData) {
    this.io.to(userId).emit('notification', notification);
    console.log(`Notification sent to user ${userId}: ${notification.title}`);
    return true;
  }

  /**
   * Send a notification to all users
   */
  public broadcastNotification(notification: NotificationData) {
    this.io.emit('notification', notification);
    console.log(`Broadcast notification sent: ${notification.title}`);
    return true;
  }

  /**
   * Send a notification to all admins
   */
  public notifyAdmins(notification: NotificationData) {
    this.io.to('admin').emit('admin_notification', notification);
    console.log(`Admin notification sent: ${notification.title}`);
    return true;
  }

  /**
   * Update leaderboard for a specific challenge
   */
  public updateLeaderboard(challengeId: string, leaderboardData: any) {
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
  public updateConnectionStatus(userId: string, challengeId: string, status: string) {
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
  public getIO() {
    return this.io;
  }

  // Methods to emit events to clients

  // Update leaderboard for a challenge
  public updateLeaderboardForChallenge(challengeId: number | string, leaderboard: any) {
    // Emit to challenge-specific room
    const roomName = `challenge-${challengeId}`;
    this.io.to(roomName).emit('leaderboard_update', leaderboard);
    console.log(`Leaderboard updated for challenge ${challengeId}`);
    return true;
  }
}

export default SocketService;