import { Request, Response } from 'express';
import { User, ChallengeEntry, WalletTransaction, Notification } from '../models';
import { Op } from 'sequelize';

/**
 * Get all users (admin only)
 * @route GET /api/users
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'discordUsername', 'walletBalance', 'status', 'createdAt']
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get user by ID (admin only or current user)
 * @route GET /api/users/:id
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    
    // Check if the user is requesting their own profile or is an admin
    if (req.userId !== userId && req.user?.status !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'discordUsername', 'walletBalance', 'status', 'createdAt'],
      include: [
        {
          model: ChallengeEntry,
          as: 'entries',
          attributes: ['id', 'challengeId', 'connectStatus', 'status', 'disqualified', 'metrics'],
          limit: 10,
          order: [['createdAt', 'DESC']]
        },
        {
          model: WalletTransaction,
          as: 'walletTransactions',
          attributes: ['id', 'amount', 'type', 'reason', 'createdAt', 'expiryDate'],
          limit: 10,
          order: [['createdAt', 'DESC']]
        },
        {
          model: Notification,
          as: 'notifications',
          attributes: ['id', 'title', 'message', 'read', 'createdAt'],
          limit: 10,
          order: [['createdAt', 'DESC']],
          where: {
            read: false
          }
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get user profile (current user only)
 * @route GET /api/users/profile
 */
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'discordUsername', 'walletBalance', 'cryptoAddress', 'createdAt'],
      include: [
        {
          model: ChallengeEntry,
          as: 'entries',
          attributes: ['id', 'challengeId', 'connectStatus', 'status', 'disqualified', 'metrics'],
          limit: 10,
          order: [['createdAt', 'DESC']]
        },
        {
          model: WalletTransaction,
          as: 'walletTransactions',
          attributes: ['id', 'amount', 'type', 'reason', 'createdAt', 'expiryDate'],
          limit: 10,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Count unread notifications
    const unreadCount = await Notification.count({
      where: {
        userId,
        read: false
      }
    });

    res.json({
      ...user.toJSON(),
      unreadNotifications: unreadCount
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update user (admin only)
 * @route PUT /api/users/:id
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    // Only allow specific fields to be updated
    const { name, email, status } = req.body;
    
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update allowed fields
    await user.update({
      name: name || user.name,
      email: email || user.email,
      status: status || user.status
    });
    
    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        discordUsername: user.discordUsername,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Ban/unban user (admin only)
 * @route PATCH /api/users/:id/status
 */
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'banned'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.update({ status });
    
    res.json({
      message: `User ${status === 'banned' ? 'banned' : 'activated'} successfully`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update user wallet balance (admin only)
 * @route PATCH /api/users/:id/wallet
 */
export const updateUserWallet = async (req: Request, res: Response) => {
  try {
    const { amount, reason } = req.body;
    
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create a wallet transaction
    const transaction = await WalletTransaction.create({
      userId: user.id,
      amount,
      type: 'admin_adjustment',
      reason: reason || 'Admin adjustment',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });
    
    // Update user's wallet balance
    const newBalance = parseFloat(user.walletBalance.toString()) + parseFloat(amount.toString());
    await user.update({ walletBalance: newBalance });
    
    res.json({
      message: 'Wallet balance updated successfully',
      transaction,
      newBalance
    });
  } catch (error) {
    console.error('Error updating wallet balance:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 