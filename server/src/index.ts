import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import session from 'express-session';

// Load environment variables
dotenv.config();

// Import routes (will be created later)
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import challengeRoutes from './routes/challenges';
import challengeEntryRoutes from './routes/challengeEntries';
import tradeRoutes from './routes/trades';
import walletRoutes from './routes/wallets';
import notificationRoutes from './routes/notifications';
import leaderboardRoutes from './routes/leaderboards';
import ctraderRoutes from './routes/ctrader';
import cryptoRoutes from './routes/cryptoRoutes';
import adminRoutes from './routes/admin';
import testRoutes from './routes/test';

// Import services
import SocketService from './services/socketService';
import tokenRefreshService from './services/tokenRefreshService';
import initDb from './scripts/initDb';

// Import database and models
import sequelize from './config/database';
import { initDatabase } from './models/index';

// Error handling middleware
import { notFound, errorHandler } from './middleware/errorHandler';
import { authenticateJWT } from './middleware/authMiddleware';

const app = express();
const PORT = process.env.PORT || 5002;

// Create HTTP server and socket.io instance
const server = http.createServer(app);

// Initialize socket service
const socketService = new SocketServer(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? 'https://tradechampionx.com'
      : 'http://localhost:8080',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Export socket service for use in other modules
export { socketService };

// Initialize token refresh service with 30 minute interval
const TOKEN_REFRESH_INTERVAL = process.env.TOKEN_REFRESH_INTERVAL ?
  parseInt(process.env.TOKEN_REFRESH_INTERVAL) : 30;
tokenRefreshService.startScheduler(TOKEN_REFRESH_INTERVAL);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://tradechampionx.com'
    : 'http://localhost:8080',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/challenge-entries', challengeEntryRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/leaderboards', leaderboardRoutes);
app.use('/api/ctrader', ctraderRoutes);
app.use('/api/crypto', cryptoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/test', testRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware (should be after routes)
app.use(notFound);
app.use(errorHandler);

// Sync database and start server
const startServer = async () => {
  try {
    // Initialize database with sync enabled
    await initDatabase(true);

    // Start the token refresh scheduler
    const refreshIntervalMinutes = parseInt(process.env.TOKEN_REFRESH_INTERVAL || '30');
    tokenRefreshService.startScheduler(refreshIntervalMinutes);
    console.log(`Token refresh service started with ${refreshIntervalMinutes} minute interval`);

    // Start the server
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Start cTrader WebSocket connection monitoring
    try {
      const ctraderService = require('./services/ctraderService').default;

      // Start WebSocket connection monitoring
      const connectionMonitorInterval = 5; // Check every 5 minutes
      const monitorInterval = ctraderService.startConnectionMonitoring(connectionMonitorInterval);

      // Add to process cleanup
      process.on('SIGINT', () => {
        console.log('Stopping WebSocket connection monitoring...');
        ctraderService.stopConnectionMonitoring(monitorInterval);
      });

      console.log(`WebSocket connection monitoring started with ${connectionMonitorInterval} minute interval`);
    } catch (wsError) {
      console.error('Error starting WebSocket connection monitoring:', wsError);
    }
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();

// Connect to MongoDB (if enabled)
if (process.env.USE_MONGODB !== 'false') {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tradechampionx';
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      console.log('Continuing without MongoDB...');
    });
} else {
  console.log('MongoDB is disabled by configuration. Using SQLite only.');
}

// Socket.io connection handler
socketService.on('connection', (socket) => {
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

  // Handle cTrader connection
  socket.on('connect_ctrader', async (data) => {
    try {
      if (socket.data.user && data.challengeEntryId) {
        console.log(`Attempting to connect cTrader for user ${socket.data.user.id}, entry ${data.challengeEntryId}`);

        // Call ctraderService to establish connection
        const ctraderService = require('./services/ctraderService').default;
        await ctraderService.establishWebSocketConnection(data.challengeEntryId);

        // Notify user of success
        socket.emit('notification', {
          title: 'cTrader Connected',
          message: 'Successfully connected to cTrader account',
          type: 'connection'
        });
      }
    } catch (error) {
      console.error('Error connecting to cTrader:', error);
      socket.emit('notification', {
        title: 'cTrader Connection Failed',
        message: 'Failed to connect to cTrader. Please try again.',
        type: 'connection'
      });
    }
  });

  // Handle cTrader disconnection
  socket.on('disconnect_ctrader', async (data) => {
    try {
      if (socket.data.user && data && data.challengeEntryId) {
        console.log(`Disconnecting cTrader for user ${socket.data.user.id}, entry ${data.challengeEntryId}`);

        // Call ctraderService to disconnect
        const ctraderService = require('./services/ctraderService').default;
        await ctraderService.disconnectWebSocket(data.challengeEntryId);

        // Notify user of success
        socket.emit('notification', {
          title: 'cTrader Disconnected',
          message: 'Successfully disconnected from cTrader account',
          type: 'connection'
        });
      }
    } catch (error) {
      console.error('Error disconnecting from cTrader:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from socket:', socket.id);
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down...');

  // Stop token refresh service
  tokenRefreshService.stopScheduler();

  // Close database connections
  await sequelize.close();
  await mongoose.disconnect();

  process.exit(0);
});