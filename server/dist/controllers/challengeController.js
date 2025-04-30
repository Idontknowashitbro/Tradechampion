"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChallengeStatus = exports.deleteChallenge = exports.updateChallenge = exports.createChallenge = exports.getChallengeById = exports.getChallenges = void 0;
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
/**
 * Get all active challenges
 * @route GET /api/challenges
 */
const getChallenges = async (req, res) => {
    try {
        const challenges = await models_1.Challenge.findAll({
            where: {
                status: {
                    [sequelize_1.Op.in]: ['upcoming', 'active']
                }
            },
            order: [['startDate', 'ASC']]
        });
        res.json(challenges);
    }
    catch (error) {
        console.error('Error fetching challenges:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getChallenges = getChallenges;
/**
 * Get challenge by ID
 * @route GET /api/challenges/:id
 */
const getChallengeById = async (req, res) => {
    try {
        const challenge = await models_1.Challenge.findByPk(req.params.id, {
            include: [
                {
                    model: models_1.ChallengeEntry,
                    as: 'entries',
                    attributes: ['id', 'userId', 'metrics', 'rank', 'status'],
                    include: [
                        {
                            model: models_1.User,
                            as: 'user',
                            attributes: ['id', 'name', 'discordUsername']
                        }
                    ]
                }
            ]
        });
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        res.json(challenge);
    }
    catch (error) {
        console.error('Error fetching challenge:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getChallengeById = getChallengeById;
/**
 * Create a new challenge (admin only)
 * @route POST /api/challenges
 */
const createChallenge = async (req, res) => {
    try {
        const { type, name, description, startDate, endDate, initialBalance, entryFee, maxDrawdown, maxDailyDrawdown, maxRiskPerTrade, minTrades, rules } = req.body;
        const challenge = await models_1.Challenge.create({
            type,
            name,
            description,
            startDate,
            endDate,
            initialBalance,
            entryFee,
            maxDrawdown,
            maxDailyDrawdown,
            maxRiskPerTrade,
            minTrades,
            prizePool: 0,
            status: new Date() > new Date(startDate) ? 'active' : 'upcoming',
            rules: rules || {}
        });
        res.status(201).json(challenge);
    }
    catch (error) {
        console.error('Error creating challenge:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createChallenge = createChallenge;
/**
 * Update a challenge (admin only)
 * @route PUT /api/challenges/:id
 */
const updateChallenge = async (req, res) => {
    try {
        const challenge = await models_1.Challenge.findByPk(req.params.id);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        // Don't allow updates if challenge has already started
        if (challenge.status !== 'upcoming') {
            return res.status(400).json({ message: 'Cannot update a challenge that has already started' });
        }
        await challenge.update(req.body);
        res.json(challenge);
    }
    catch (error) {
        console.error('Error updating challenge:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateChallenge = updateChallenge;
/**
 * Delete a challenge (admin only)
 * @route DELETE /api/challenges/:id
 */
const deleteChallenge = async (req, res) => {
    try {
        const challenge = await models_1.Challenge.findByPk(req.params.id);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        // Don't allow deletion if challenge has already started
        if (challenge.status !== 'upcoming') {
            return res.status(400).json({ message: 'Cannot delete a challenge that has already started' });
        }
        await challenge.destroy();
        res.json({ message: 'Challenge deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting challenge:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteChallenge = deleteChallenge;
/**
 * Update challenge status (admin only)
 * @route PATCH /api/challenges/:id/status
 */
const updateChallengeStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['upcoming', 'active', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const challenge = await models_1.Challenge.findByPk(req.params.id);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        await challenge.update({ status });
        res.json(challenge);
    }
    catch (error) {
        console.error('Error updating challenge status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateChallengeStatus = updateChallengeStatus;
//# sourceMappingURL=challengeController.js.map