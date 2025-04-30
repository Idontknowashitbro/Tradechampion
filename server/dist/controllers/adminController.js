"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChallenge = exports.updateChallenge = exports.createChallenge = exports.getChallenge = exports.getChallenges = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.getDashboardStats = void 0;
const models_1 = require("../models");
// Dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        // Get counts of various entities
        const userCount = await models_1.User.count();
        const challengeCount = await models_1.Challenge.count();
        const activeEntryCount = await models_1.ChallengeEntry.count({
            where: { status: 'active' }
        });
        const completedEntryCount = await models_1.ChallengeEntry.count({
            where: { status: 'completed' }
        });
        const tradeCount = await models_1.Trade.count();
        // Get recent users
        const recentUsers = await models_1.User.findAll({
            order: [['createdAt', 'DESC']],
            limit: 5,
            attributes: ['id', 'name', 'email', 'createdAt', 'status']
        });
        // Get recent challenge entries
        const recentEntries = await models_1.ChallengeEntry.findAll({
            order: [['createdAt', 'DESC']],
            limit: 5,
            include: [
                { model: models_1.User, attributes: ['id', 'name', 'email'] },
                { model: models_1.Challenge, attributes: ['id', 'name'] }
            ]
        });
        res.json({
            stats: {
                userCount,
                challengeCount,
                activeEntryCount,
                completedEntryCount,
                tradeCount
            },
            recentUsers,
            recentEntries
        });
    }
    catch (error) {
        console.error('Error getting dashboard stats:', error);
        res.status(500).json({ message: 'Failed to get dashboard statistics' });
    }
};
exports.getDashboardStats = getDashboardStats;
// User management
const getUsers = async (req, res) => {
    try {
        const users = await models_1.User.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(users);
    }
    catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: 'Failed to get users' });
    }
};
exports.getUsers = getUsers;
const getUser = async (req, res) => {
    try {
        const user = await models_1.User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ message: 'Failed to get user' });
    }
};
exports.getUser = getUser;
const updateUser = async (req, res) => {
    try {
        const user = await models_1.User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.update(req.body);
        res.json(user);
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Failed to update user' });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const user = await models_1.User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
};
exports.deleteUser = deleteUser;
// Challenge management
const getChallenges = async (req, res) => {
    try {
        const challenges = await models_1.Challenge.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(challenges);
    }
    catch (error) {
        console.error('Error getting challenges:', error);
        res.status(500).json({ message: 'Failed to get challenges' });
    }
};
exports.getChallenges = getChallenges;
const getChallenge = async (req, res) => {
    try {
        const challenge = await models_1.Challenge.findByPk(req.params.id);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        res.json(challenge);
    }
    catch (error) {
        console.error('Error getting challenge:', error);
        res.status(500).json({ message: 'Failed to get challenge' });
    }
};
exports.getChallenge = getChallenge;
const createChallenge = async (req, res) => {
    try {
        const challenge = await models_1.Challenge.create(req.body);
        res.status(201).json(challenge);
    }
    catch (error) {
        console.error('Error creating challenge:', error);
        res.status(500).json({ message: 'Failed to create challenge' });
    }
};
exports.createChallenge = createChallenge;
const updateChallenge = async (req, res) => {
    try {
        const challenge = await models_1.Challenge.findByPk(req.params.id);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        await challenge.update(req.body);
        res.json(challenge);
    }
    catch (error) {
        console.error('Error updating challenge:', error);
        res.status(500).json({ message: 'Failed to update challenge' });
    }
};
exports.updateChallenge = updateChallenge;
const deleteChallenge = async (req, res) => {
    try {
        const challenge = await models_1.Challenge.findByPk(req.params.id);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        await challenge.destroy();
        res.json({ message: 'Challenge deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting challenge:', error);
        res.status(500).json({ message: 'Failed to delete challenge' });
    }
};
exports.deleteChallenge = deleteChallenge;
//# sourceMappingURL=adminController.js.map