import { Request, Response } from 'express';
import { CryptoWallet } from '../models';
import { Op } from 'sequelize';

/**
 * Get user's crypto wallets
 * @route GET /api/crypto/wallets
 */
export const getUserWallets = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const wallets = await CryptoWallet.findAll({ 
      where: { userId },
      order: [
        ['isDefault', 'DESC'],
        ['createdAt', 'DESC']
      ]
    });
    
    res.json(wallets);
  } catch (error) {
    console.error('Error fetching user wallets:', error);
    res.status(500).json({ message: 'Failed to fetch wallets' });
  }
};

/**
 * Add a new crypto wallet for user
 * @route POST /api/crypto/wallets
 */
export const addWallet = async (req: Request, res: Response) => {
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
    const existingWallet = await CryptoWallet.findOne({
      where: { userId, address }
    });
    
    if (existingWallet) {
      return res.status(400).json({ message: 'Wallet address already exists' });
    }
    
    // Create new wallet
    const wallet = await CryptoWallet.create({
      userId,
      walletType,
      address,
      label,
      isDefault
    });
    
    res.status(201).json(wallet);
  } catch (error) {
    console.error('Error adding wallet:', error);
    res.status(500).json({ message: 'Failed to add wallet' });
  }
};

/**
 * Update an existing crypto wallet
 * @route PUT /api/crypto/wallets/:id
 */
export const updateWallet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const { label, isDefault } = req.body;
    
    // Find wallet by id and confirm ownership
    const wallet = await CryptoWallet.findOne({
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
  } catch (error) {
    console.error('Error updating wallet:', error);
    res.status(500).json({ message: 'Failed to update wallet' });
  }
};

/**
 * Delete a crypto wallet
 * @route DELETE /api/crypto/wallets/:id
 */
export const deleteWallet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Find wallet by id and confirm ownership
    const wallet = await CryptoWallet.findOne({
      where: { id, userId }
    });
    
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    
    // Check if this is the default wallet
    if (wallet.isDefault) {
      // Find another wallet to set as default
      const anotherWallet = await CryptoWallet.findOne({
        where: { 
          userId,
          id: { [Op.ne]: id }
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
  } catch (error) {
    console.error('Error deleting wallet:', error);
    res.status(500).json({ message: 'Failed to delete wallet' });
  }
};

/**
 * Set a wallet as default
 * @route PUT /api/crypto/wallets/:id/default
 */
export const setDefaultWallet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Find wallet by id and confirm ownership
    const wallet = await CryptoWallet.findOne({
      where: { id, userId }
    });
    
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    
    // Set as default
    wallet.isDefault = true;
    await wallet.save();
    
    res.json(wallet);
  } catch (error) {
    console.error('Error setting default wallet:', error);
    res.status(500).json({ message: 'Failed to set default wallet' });
  }
}; 