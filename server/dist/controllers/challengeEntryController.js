"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConnection = exports.getUserEntries = exports.getEntryById = exports.enterChallenge = void 0;
const models_1 = require("../models");
const index_1 = require("../index");
/**
 * Enter a challenge
 * @route POST /api/challenge-entries
 */
const enterChallenge = async (req, res) => {
    try {
        const { challengeId, ctraderAccountId, ctraderAccessToken, ctraderRefreshToken } = req.body;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        // Check if challenge exists
        const challenge = await models_1.Challenge.findByPk(challengeId);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        // Check if challenge is open for entry
        if (challenge.status !== 'upcoming' && challenge.status !== 'active') {
            return res.status(400).json({ message: 'Challenge is not open for entry' });
        }
        // Check if user already has an entry for this challenge
        const existingEntry = await models_1.ChallengeEntry.findOne({
            where: {
                userId,
                challengeId
            }
        });
        if (existingEntry) {
            return res.status(400).json({ message: 'You have already entered this challenge' });
        }
        // Create challenge entry
        const entry = await models_1.ChallengeEntry.create({
            userId,
            challengeId,
            ctraderAccountId,
            ctraderAccessToken,
            ctraderRefreshToken,
            status: 'pending'
        });
        // Notify user via socket
        index_1.socketService.to(userId).emit('notification', {
            title: 'Challenge Entry',
            message: `You have successfully entered the ${challenge.name} challenge`,
            type: 'challenge'
        });
        res.status(201).json(entry);
    }
    catch (error) {
        console.error('Error entering challenge:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.enterChallenge = enterChallenge;
/**
 * Get challenge entry by ID
 * @route GET /api/challenge-entries/:id
 */
const getEntryById = async (req, res) => {
    var _a;
    try {
        const entry = await models_1.ChallengeEntry.findByPk(req.params.id, {
            include: [
                {
                    model: models_1.User,
                    as: 'user',
                    attributes: ['id', 'name', 'discordUsername']
                },
                {
                    model: models_1.Challenge,
                    as: 'challenge'
                }
            ]
        });
        if (!entry) {
            return res.status(404).json({ message: 'Challenge entry not found' });
        }
        // Check if the user is requesting their own entry or is an admin
        if (entry.userId !== req.userId && ((_a = req.user) === null || _a === void 0 ? void 0 : _a.status) !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json(entry);
    }
    catch (error) {
        console.error('Error fetching challenge entry:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getEntryById = getEntryById;
/**
 * Get user's challenge entries
 * @route GET /api/challenge-entries/user
 */
const getUserEntries = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const entries = await models_1.ChallengeEntry.findAll({
            where: { userId },
            include: [
                {
                    model: models_1.Challenge,
                    as: 'challenge',
                    attributes: ['id', 'name', 'type', 'startDate', 'endDate', 'status', 'initialBalance']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(entries);
    }
    catch (error) {
        console.error('Error fetching user entries:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getUserEntries = getUserEntries;
/**
 * Update cTrader connection status
 * @route PATCH /api/challenge-entries/:id/connect
 */
const updateConnection = async (req, res) => {
    try {
        const { connectStatus } = req.body;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        // Find entry
        const entry = await models_1.ChallengeEntry.findByPk(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: 'Challenge entry not found' });
        }
        // Check if the user owns this entry
        if (entry.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        // Update connection status
        await entry.update({ connectStatus });
        // Send notification to user
        index_1.socketService.to(userId).emit('notification', {
            title: 'Connection Status',
            message: `Your connection status has been updated to ${connectStatus}`,
            type: 'connection'
        });
        res.json({
            message: 'Connection status updated successfully',
            connectStatus: entry.connectStatus
        });
    }
    catch (error) {
        console.error('Error updating connection status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateConnection = updateConnection;
//# sourceMappingURL=challengeEntryController.js.map