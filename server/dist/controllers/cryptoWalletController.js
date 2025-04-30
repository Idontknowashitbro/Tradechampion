"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultWallet = exports.deleteWallet = exports.updateWallet = exports.addWallet = exports.getUserWallets = void 0;
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
/**
 * Get user's crypto wallets
 * @route GET /api/crypto/wallets
 */
const getUserWallets = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const wallets = await models_1.CryptoWallet.findAll({
            where: { userId },
            order: [
                ['isDefault', 'DESC'],
                ['createdAt', 'DESC']
            ]
        });
        res.json(wallets);
    }
    catch (error) {
        console.error('Error fetching user wallets:', error);
        res.status(500).json({ message: 'Failed to fetch wallets' });
    }
};
exports.getUserWallets = getUserWallets;
/**
 * Add a new crypto wallet for user
 * @route POST /api/crypto/wallets
 */
const addWallet = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { walletType, address, label, isDefault = false } = req.body;
        // Validate required fields
        if (!walletType || !address || !label) {
            return res.status(400).json({ message: 'Wallet type, address, and label are required' });
        }
        // Check if wallet address already exists for this user
        const existingWallet = await models_1.CryptoWallet.findOne({
            where: { userId, address }
        });
        if (existingWallet) {
            return res.status(400).json({ message: 'Wallet address already exists' });
        }
        // Create new wallet
        const wallet = await models_1.CryptoWallet.create({
            userId,
            walletType,
            address,
            label,
            isDefault
        });
        res.status(201).json(wallet);
    }
    catch (error) {
        console.error('Error adding wallet:', error);
        res.status(500).json({ message: 'Failed to add wallet' });
    }
};
exports.addWallet = addWallet;
/**
 * Update an existing crypto wallet
 * @route PUT /api/crypto/wallets/:id
 */
const updateWallet = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const { label, isDefault } = req.body;
        // Find wallet by id and confirm ownership
        const wallet = await models_1.CryptoWallet.findOne({
            where: { id, userId }
        });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        // Update fields
        if (label !== undefined) {
            wallet.label = label;
        }
        if (isDefault !== undefined) {
            wallet.isDefault = isDefault;
        }
        await wallet.save();
        res.json(wallet);
    }
    catch (error) {
        console.error('Error updating wallet:', error);
        res.status(500).json({ message: 'Failed to update wallet' });
    }
};
exports.updateWallet = updateWallet;
/**
 * Delete a crypto wallet
 * @route DELETE /api/crypto/wallets/:id
 */
const deleteWallet = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        // Find wallet by id and confirm ownership
        const wallet = await models_1.CryptoWallet.findOne({
            where: { id, userId }
        });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        // Check if this is the default wallet
        if (wallet.isDefault) {
            // Find another wallet to set as default
            const anotherWallet = await models_1.CryptoWallet.findOne({
                where: {
                    userId,
                    id: { [sequelize_1.Op.ne]: id }
                }
            });
            if (anotherWallet) {
                anotherWallet.isDefault = true;
                await anotherWallet.save();
            }
        }
        // Delete the wallet
        await wallet.destroy();
        res.json({ message: 'Wallet deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting wallet:', error);
        res.status(500).json({ message: 'Failed to delete wallet' });
    }
};
exports.deleteWallet = deleteWallet;
/**
 * Set a wallet as default
 * @route PUT /api/crypto/wallets/:id/default
 */
const setDefaultWallet = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        // Find wallet by id and confirm ownership
        const wallet = await models_1.CryptoWallet.findOne({
            where: { id, userId }
        });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        // Set as default
        wallet.isDefault = true;
        await wallet.save();
        res.json(wallet);
    }
    catch (error) {
        console.error('Error setting default wallet:', error);
        res.status(500).json({ message: 'Failed to set default wallet' });
    }
};
exports.setDefaultWallet = setDefaultWallet;
//# sourceMappingURL=cryptoWalletController.js.map