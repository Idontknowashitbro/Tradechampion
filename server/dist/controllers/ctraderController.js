"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkConnectionStatus = exports.getAccountDetails = exports.fetchTrades = exports.disconnectAccount = exports.connectAccount = exports.oauthCallback = exports.getAuthorizationUrl = void 0;
const ChallengeEntry_1 = __importDefault(require("../models/ChallengeEntry"));
const ctraderService_1 = __importDefault(require("../services/ctraderService"));
const index_1 = require("../index");
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { CTRADER_API_URL, CTRADER_CLIENT_ID, CTRADER_CLIENT_SECRET, CTRADER_REDIRECT_URI, TOKEN_REFRESH_INTERVAL, } = process.env;
/**
 * Generate OAuth2 authorization URL
 */
const getAuthorizationUrl = (req, res) => {
    try {
        const authUrl = ctraderService_1.default.getAuthorizationUrl();
        res.json({ url: authUrl });
    }
    catch (error) {
        console.error('Error generating authorization URL:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};
exports.getAuthorizationUrl = getAuthorizationUrl;
/**
 * OAuth2 callback handler
 */
const oauthCallback = async (req, res) => {
    try {
        const { code, state } = req.query;
        const { challengeEntryId } = JSON.parse(state || '{}');
        if (!code) {
            return res.status(400).json({ message: 'Authorization code is required' });
        }
        if (!challengeEntryId) {
            return res.status(400).json({ message: 'Challenge entry ID is required' });
        }
        // Get access token
        const { accessToken, refreshToken } = await ctraderService_1.default.getAccessToken(code);
        // Fetch user accounts
        const accounts = await ctraderService_1.default.getUserAccounts(accessToken);
        // Update challenge entry with tokens
        const entry = await ChallengeEntry_1.default.findByPk(challengeEntryId);
        if (!entry) {
            return res.status(404).json({ message: 'Challenge entry not found' });
        }
        await entry.update({
            ctraderAccessToken: accessToken,
            ctraderRefreshToken: refreshToken,
            connectStatus: 'connected'
        });
        // Establish WebSocket connection
        await ctraderService_1.default.establishWebSocketConnection(challengeEntryId);
        // Redirect to frontend success page
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/ctrader-success?entryId=${challengeEntryId}`);
    }
    catch (error) {
        console.error('Error in OAuth callback:', error);
        // Redirect to frontend error page
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/ctrader-error`);
    }
};
exports.oauthCallback = oauthCallback;
/**
 * Connect cTrader account to challenge entry
 */
const connectAccount = async (req, res) => {
    var _a;
    try {
        const { challengeEntryId, accountId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!challengeEntryId) {
            return res.status(400).json({ message: 'Challenge entry ID is required' });
        }
        if (!accountId) {
            return res.status(400).json({ message: 'Account ID is required' });
        }
        // Find challenge entry
        const entry = await ChallengeEntry_1.default.findByPk(challengeEntryId);
        if (!entry) {
            return res.status(404).json({ message: 'Challenge entry not found' });
        }
        // Verify user owns the entry
        if (entry.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        // Update challenge entry with account ID
        await entry.update({
            ctraderAccountId: accountId
        });
        // Generate OAuth URL with state
        const state = JSON.stringify({ challengeEntryId });
        const baseUrl = ctraderService_1.default.getAuthorizationUrl();
        const authUrl = `${baseUrl}&state=${encodeURIComponent(state)}`;
        res.json({ url: authUrl });
    }
    catch (error) {
        console.error('Error connecting account:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};
exports.connectAccount = connectAccount;
/**
 * Disconnect cTrader account from challenge entry
 */
const disconnectAccount = async (req, res) => {
    var _a;
    try {
        const { challengeEntryId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!challengeEntryId) {
            return res.status(400).json({ message: 'Challenge entry ID is required' });
        }
        // Find challenge entry
        const entry = await ChallengeEntry_1.default.findByPk(parseInt(challengeEntryId));
        if (!entry) {
            return res.status(404).json({ message: 'Challenge entry not found' });
        }
        // Verify user owns the entry
        if (entry.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        // Disconnect WebSocket if active
        await ctraderService_1.default.disconnectWebSocket(parseInt(challengeEntryId));
        // Update challenge entry
        await entry.update({
            ctraderAccessToken: '',
            ctraderRefreshToken: '',
            connectStatus: 'disconnected'
        });
        // Notify via socket
        if (index_1.socketService && userId) {
            try {
                index_1.socketService.to(userId.toString()).emit('notification', {
                    title: 'cTrader Disconnected',
                    message: 'Your cTrader account has been disconnected.',
                    type: 'connection'
                });
            }
            catch (socketError) {
                console.error('Socket notification error:', socketError);
            }
        }
        res.json({ message: 'Account disconnected successfully' });
    }
    catch (error) {
        console.error('Error disconnecting account:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};
exports.disconnectAccount = disconnectAccount;
/**
 * Manually fetch trades for a challenge entry
 */
const fetchTrades = async (req, res) => {
    var _a;
    try {
        const { challengeEntryId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!challengeEntryId) {
            return res.status(400).json({ message: 'Challenge entry ID is required' });
        }
        // Find challenge entry
        const entry = await ChallengeEntry_1.default.findByPk(parseInt(challengeEntryId), {
            include: ['challenge']
        });
        if (!entry) {
            return res.status(404).json({ message: 'Challenge entry not found' });
        }
        // Verify user owns the entry
        if (entry.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        // Verify entry is connected
        if (entry.connectStatus !== 'connected' || !entry.ctraderAccessToken) {
            return res.status(400).json({ message: 'cTrader account not connected' });
        }
        // Check if WebSocket connection is active, if not establish it
        if (!ctraderService_1.default.isConnected(parseInt(challengeEntryId))) {
            await ctraderService_1.default.establishWebSocketConnection(parseInt(challengeEntryId));
        }
        // Fetch trades from cTrader
        const fromDate = entry.challenge ? new Date(entry.challenge.startDate) : new Date();
        const trades = await ctraderService_1.default.getAccountTrades(entry.ctraderAccessToken, entry.ctraderAccountId, fromDate);
        // Process trades
        for (const trade of trades) {
            await ctraderService_1.default.processTrade(parseInt(challengeEntryId), trade);
        }
        // Check if drawdown limit exceeded
        const exceededDrawdown = await ctraderService_1.default.checkDrawdownLimit(parseInt(challengeEntryId));
        if (exceededDrawdown && !entry.disqualified) {
            // Disqualify entry
            await entry.update({
                disqualified: true,
                disqualificationReason: 'Exceeded maximum drawdown'
            });
            // Notify via socket
            if (index_1.socketService && userId) {
                try {
                    index_1.socketService.to(userId.toString()).emit('disqualified', {
                        challengeEntryId: parseInt(challengeEntryId),
                        reason: 'Exceeded maximum drawdown'
                    });
                }
                catch (socketError) {
                    console.error('Socket notification error:', socketError);
                }
            }
        }
        res.json({
            message: 'Trades fetched and processed successfully',
            tradesCount: trades.length,
            websocketStatus: ctraderService_1.default.isConnected(parseInt(challengeEntryId)) ? 'connected' : 'disconnected'
        });
    }
    catch (error) {
        console.error('Error fetching trades:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};
exports.fetchTrades = fetchTrades;
/**
 * Get account details
 */
const getAccountDetails = async (req, res) => {
    var _a;
    try {
        const { challengeEntryId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!challengeEntryId) {
            return res.status(400).json({ message: 'Challenge entry ID is required' });
        }
        // Find challenge entry
        const entry = await ChallengeEntry_1.default.findByPk(parseInt(challengeEntryId));
        if (!entry) {
            return res.status(404).json({ message: 'Challenge entry not found' });
        }
        // Verify user owns the entry
        if (entry.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        // Verify entry is connected
        if (entry.connectStatus !== 'connected' || !entry.ctraderAccessToken) {
            return res.status(400).json({ message: 'cTrader account not connected' });
        }
        // Get account details
        const accountDetails = await ctraderService_1.default.getAccountDetails(entry.ctraderAccessToken, entry.ctraderAccountId);
        res.json(accountDetails);
    }
    catch (error) {
        console.error('Error getting account details:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};
exports.getAccountDetails = getAccountDetails;
/**
 * Admin-only route to check WebSocket connection status for all challenge entries
 */
const checkConnectionStatus = async (req, res) => {
    try {
        // In a real application, check if user is admin
        // if (!req.user?.isAdmin) {
        //   return res.status(403).json({ message: 'Admin access required' });
        // }
        // Get all challenge entries with connected status
        const entries = await ChallengeEntry_1.default.findAll({
            where: {
                connectStatus: 'connected'
            },
            include: [{
                    model: User_1.default,
                    as: 'user',
                    attributes: ['id', 'email', 'username']
                }]
        });
        // Map entries to include WebSocket connection status
        const statusData = entries.map(entry => {
            const connectionStatus = ctraderService_1.default.getConnectionStatus(entry.id);
            return {
                id: entry.id,
                userId: entry.userId,
                user: entry.user,
                connectStatus: entry.connectStatus,
                websocketStatus: connectionStatus,
                lastConnection: entry.updatedAt
            };
        });
        // Get total counts
        const activeConnections = ctraderService_1.default.getActiveConnectionsCount();
        const totalEntries = entries.length;
        const disconnectedCount = entries.filter(entry => !ctraderService_1.default.isConnected(entry.id)).length;
        res.json({
            activeConnections,
            totalConnectedEntries: totalEntries,
            disconnectedEntries: disconnectedCount,
            connections: statusData,
            wsUrl: process.env.CTRADER_WS_URL || 'Default URL (check logs)'
        });
    }
    catch (error) {
        console.error('Error checking connection status:', error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};
exports.checkConnectionStatus = checkConnectionStatus;
/**
 * Controller for handling cTrader API integration
 */
class CtraderController {
    /**
     * Generate the authorization URL for cTrader OAuth
     */
    getAuthUrl(req, res) {
        try {
            const authUrl = ctraderService_1.default.getAuthorizationUrl();
            res.json({ authUrl });
        }
        catch (error) {
            console.error('Error generating auth URL:', error);
            res.status(500).json({ message: 'Failed to generate authorization URL' });
        }
    }
    /**
     * Handle the callback from cTrader OAuth
     */
    async handleCallback(req, res) {
        try {
            const { code } = req.query;
            if (!code || typeof code !== 'string') {
                res.status(400).json({ message: 'Authorization code is missing or invalid' });
                return;
            }
            // Exchange authorization code for access token
            const { accessToken, refreshToken } = await ctraderService_1.default.getAccessToken(code);
            // Save token to user account
            if (req.user) {
                const userId = req.user.id;
                // Get current user data
                const user = await User_1.default.findByPk(userId);
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                // Update with new cTrader data
                await User_1.default.update({
                    ctrader: JSON.stringify({
                        accessToken,
                        refreshToken,
                        tokenExpiry: new Date(Date.now() + 3600 * 1000),
                        isConnected: true,
                        accounts: []
                    })
                }, {
                    where: { id: userId }
                });
                // Fetch and save cTrader account info
                await this.fetchAndSaveAccountInfo(userId, accessToken);
                res.redirect('/dashboard?ctrader=connected');
            }
            else {
                res.status(401).json({ message: 'User not authenticated' });
            }
        }
        catch (error) {
            console.error('Error handling callback:', error);
            res.status(500).json({ message: 'Failed to process cTrader authorization' });
        }
    }
    /**
     * Fetch account info from cTrader API
     */
    async fetchAndSaveAccountInfo(userId, accessToken) {
        try {
            const accounts = await ctraderService_1.default.getUserAccounts(accessToken);
            // Get current user data
            const user = await User_1.default.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }
            // Get cTrader data
            const ctraderData = user.getCtraderData();
            // Update with new accounts
            await User_1.default.update({
                ctrader: JSON.stringify({
                    ...ctraderData,
                    accounts
                })
            }, {
                where: { id: userId }
            });
        }
        catch (error) {
            console.error('Error fetching account info:', error);
            throw new Error('Failed to fetch cTrader account information');
        }
    }
    /**
     * Refresh the access token
     */
    async refreshToken(userId) {
        try {
            const user = await User_1.default.findByPk(userId);
            if (!user) {
                return null;
            }
            // Get cTrader data
            const ctraderData = user.getCtraderData();
            if (!ctraderData.refreshToken) {
                return null;
            }
            const tokenData = await ctraderService_1.default.refreshAccessToken(ctraderData.refreshToken);
            // Update token in database
            await User_1.default.update({
                ctrader: JSON.stringify({
                    ...ctraderData,
                    accessToken: tokenData.access_token,
                    refreshToken: tokenData.refresh_token,
                    tokenExpiry: new Date(Date.now() + tokenData.expires_in * 1000)
                })
            }, {
                where: { id: userId }
            });
            return tokenData.access_token;
        }
        catch (error) {
            console.error('Error refreshing token:', error);
            return null;
        }
    }
    /**
     * Disconnect cTrader account
     */
    async disconnectAccount(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }
            const userId = req.user.id;
            await User_1.default.update({
                ctrader: JSON.stringify({
                    accessToken: '',
                    refreshToken: '',
                    tokenExpiry: null,
                    isConnected: false,
                    accounts: []
                })
            }, {
                where: { id: userId }
            });
            res.json({ message: 'cTrader account disconnected successfully' });
        }
        catch (error) {
            console.error('Error disconnecting account:', error);
            res.status(500).json({ message: 'Failed to disconnect cTrader account' });
        }
    }
    /**
     * Get user's cTrader account status and info
     */
    async getAccountStatus(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }
            const userId = req.user.id;
            const user = await User_1.default.findByPk(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            // Get cTrader data
            const ctraderData = user.getCtraderData();
            // If token is about to expire, refresh it
            if (ctraderData.isConnected && ctraderData.tokenExpiry) {
                const expiryDate = new Date(ctraderData.tokenExpiry);
                if (expiryDate.getTime() - Date.now() < 300000) { // Less than 5 minutes until expiry
                    await this.refreshToken(userId);
                }
            }
            res.json({
                isConnected: ctraderData.isConnected || false,
                accounts: ctraderData.accounts || [],
            });
        }
        catch (error) {
            console.error('Error getting account status:', error);
            res.status(500).json({ message: 'Failed to get cTrader account status' });
        }
    }
    /**
     * Connect cTrader account to challenge entry (for challenge-specific connections)
     */
    async connectToChallengeEntry(req, res) {
        try {
            const { challengeEntryId, accountId } = req.body;
            const userId = req.user.id;
            if (!challengeEntryId) {
                res.status(400).json({ message: 'Challenge entry ID is required' });
                return;
            }
            if (!accountId) {
                res.status(400).json({ message: 'Account ID is required' });
                return;
            }
            // Find challenge entry
            const entry = await ChallengeEntry_1.default.findByPk(challengeEntryId);
            if (!entry) {
                res.status(404).json({ message: 'Challenge entry not found' });
                return;
            }
            // Verify user owns the entry
            if (entry.userId !== userId) {
                res.status(403).json({ message: 'Unauthorized' });
                return;
            }
            // Update challenge entry with account ID
            await entry.update({
                ctraderAccountId: accountId,
                connectStatus: 'pending'
            });
            // Generate authorization URL with state for callback
            const state = JSON.stringify({ challengeEntryId });
            const authUrl = ctraderService_1.default.getAuthorizationUrl() + `&state=${encodeURIComponent(state)}`;
            res.json({ authUrl });
        }
        catch (error) {
            console.error('Error connecting to challenge entry:', error);
            res.status(500).json({ message: 'Failed to connect cTrader account to challenge' });
        }
    }
    /**
     * Disconnect cTrader account from challenge entry
     */
    async disconnectFromChallengeEntry(req, res) {
        try {
            const { challengeEntryId } = req.params;
            const userId = req.user.id;
            if (!challengeEntryId) {
                res.status(400).json({ message: 'Challenge entry ID is required' });
                return;
            }
            // Find challenge entry
            const entry = await ChallengeEntry_1.default.findByPk(parseInt(challengeEntryId));
            if (!entry) {
                res.status(404).json({ message: 'Challenge entry not found' });
                return;
            }
            // Verify user owns the entry
            if (entry.userId !== userId) {
                res.status(403).json({ message: 'Unauthorized' });
                return;
            }
            // Update challenge entry
            await entry.update({
                ctraderAccessToken: '',
                ctraderRefreshToken: '',
                connectStatus: 'disconnected'
            });
            // Send notification if possible
            // Note: This requires socketService implementation
            try {
                if ((index_1.socketService === null || index_1.socketService === void 0 ? void 0 : index_1.socketService.to) && userId) {
                    index_1.socketService.to(userId.toString()).emit('notification', {
                        title: 'cTrader Disconnected',
                        message: 'Your cTrader account has been disconnected from the challenge.',
                        type: 'connection'
                    });
                }
            }
            catch (socketError) {
                console.error('Socket notification error:', socketError);
            }
            res.json({ message: 'Account disconnected from challenge successfully' });
        }
        catch (error) {
            console.error('Error disconnecting from challenge entry:', error);
            res.status(500).json({ message: 'Failed to disconnect cTrader account from challenge' });
        }
    }
}
exports.default = new CtraderController();
//# sourceMappingURL=ctraderController.js.map