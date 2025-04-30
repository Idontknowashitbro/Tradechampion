"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketService = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const express_session_1 = __importDefault(require("express-session"));
// Load environment variables
dotenv_1.default.config();
// Import routes (will be created later)
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth"));
const challenges_1 = __importDefault(require("./routes/challenges"));
const challengeEntries_1 = __importDefault(require("./routes/challengeEntries"));
const trades_1 = __importDefault(require("./routes/trades"));
const wallets_1 = __importDefault(require("./routes/wallets"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const leaderboards_1 = __importDefault(require("./routes/leaderboards"));
const ctrader_1 = __importDefault(require("./routes/ctrader"));
const cryptoRoutes_1 = __importDefault(require("./routes/cryptoRoutes"));
const admin_1 = __importDefault(require("./routes/admin"));
const tokenRefreshService_1 = __importDefault(require("./services/tokenRefreshService"));
// Import database and models
const database_1 = __importDefault(require("./config/database"));
const index_1 = require("./models/index");
// Error handling middleware
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5002;
// Create HTTP server and socket.io instance
const server = http_1.default.createServer(app);
// Initialize socket service
const socketService = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? 'https://tradechampionx.com'
            : 'http://localhost:8080',
        methods: ['GET', 'POST'],
        credentials: true
    }
});
exports.socketService = socketService;
// Initialize token refresh service with 30 minute interval
const TOKEN_REFRESH_INTERVAL = process.env.TOKEN_REFRESH_INTERVAL ?
    parseInt(process.env.TOKEN_REFRESH_INTERVAL) : 30;
tokenRefreshService_1.default.startScheduler(TOKEN_REFRESH_INTERVAL);
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://tradechampionx.com'
        : 'http://localhost:8080',
    credentials: true
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use((0, compression_1.default)());
app.use((0, express_session_1.default)({
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
app.use('/api/users', users_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/challenges', challenges_1.default);
app.use('/api/challenge-entries', challengeEntries_1.default);
app.use('/api/trades', trades_1.default);
app.use('/api/wallet', wallets_1.default);
app.use('/api/notifications', notifications_1.default);
app.use('/api/leaderboards', leaderboards_1.default);
app.use('/api/ctrader', ctrader_1.default);
app.use('/api/crypto', cryptoRoutes_1.default);
app.use('/api/admin', admin_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Error handling middleware (should be after routes)
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
// Sync database and start server
const startServer = async () => {
    try {
        // Initialize database with sync enabled
        await (0, index_1.initDatabase)(true);
        // Start the token refresh scheduler
        const refreshIntervalMinutes = parseInt(process.env.TOKEN_REFRESH_INTERVAL || '30');
        tokenRefreshService_1.default.startScheduler(refreshIntervalMinutes);
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
        }
        catch (wsError) {
            console.error('Error starting WebSocket connection monitoring:', wsError);
        }
    }
    catch (error) {
        console.error('Failed to start server:', error);
    }
};
startServer();
// Connect to MongoDB (if enabled)
if (process.env.USE_MONGODB !== 'false') {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tradechampionx';
    mongoose_1.default.connect(MONGODB_URI)
        .then(() => {
        console.log('Connected to MongoDB');
    })
        .catch(err => {
        console.error('MongoDB connection error:', err);
        console.log('Continuing without MongoDB...');
    });
}
else {
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
        }
        catch (error) {
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
        }
        catch (error) {
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
    tokenRefreshService_1.default.stopScheduler();
    // Close database connections
    await database_1.default.close();
    await mongoose_1.default.disconnect();
    process.exit(0);
});
//# sourceMappingURL=index.js.map