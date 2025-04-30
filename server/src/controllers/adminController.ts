import { Request, Response } from 'express';
import { User, Challenge, ChallengeEntry, Trade } from '../models';
import { Op } from 'sequelize';

// Dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get counts of various entities
    const userCount = await User.count();
    const challengeCount = await Challenge.count();
    const activeEntryCount = await ChallengeEntry.count({
      where: { status: 'active' }
    });
    const completedEntryCount = await ChallengeEntry.count({
      where: { status: 'completed' }
    });
    const tradeCount = await Trade.count();

    // Get recent users
    const recentUsers = await User.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'name', 'email', 'createdAt', 'status']
    });

    // Get recent challenge entries
    const recentEntries = await ChallengeEntry.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Challenge, as: 'challenge', attributes: ['id', 'name'] }
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
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: 'Failed to get dashboard statistics' });
  }
};

// User management
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Failed to get users' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Failed to get user' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update(req.body);
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// Challenge management
export const getChallenges = async (req: Request, res: Response) => {
  try {
    const challenges = await Challenge.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(challenges);
  } catch (error) {
    console.error('Error getting challenges:', error);
    res.status(500).json({ message: 'Failed to get challenges' });
  }
};

export const getChallenge = async (req: Request, res: Response) => {
  try {
    const challenge = await Challenge.findByPk(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.json(challenge);
  } catch (error) {
    console.error('Error getting challenge:', error);
    res.status(500).json({ message: 'Failed to get challenge' });
  }
};

export const createChallenge = async (req: Request, res: Response) => {
  try {
    // Get default rules based on challenge type
    const defaultRules = Challenge.getDefaultRules(req.body.type);

    // Determine challenge status based on start date
    const startDate = new Date(req.body.startDate);
    const currentDate = new Date();
    const status = currentDate >= startDate ? 'active' : 'upcoming';

    // Merge default rules with provided data
    const challengeData = {
      ...defaultRules,
      ...req.body,
      // Ensure these fields are properly set
      status: req.body.status || status, // Use provided status or calculate based on dates
      maxRiskPerTrade: req.body.maxRiskPerTrade || defaultRules.maxRiskPerTrade,
      minTradeDuration: req.body.minTradeDuration || defaultRules.minTradeDuration,
      allowHedging: req.body.allowHedging !== undefined ? req.body.allowHedging : defaultRules.allowHedging,
      allowMartingale: req.body.allowMartingale !== undefined ? req.body.allowMartingale : defaultRules.allowMartingale,
      allowScalping: req.body.allowScalping !== undefined ? req.body.allowScalping : defaultRules.allowScalping
    };

    console.log('Creating challenge with data:', challengeData);

    const challenge = await Challenge.create(challengeData);
    res.status(201).json(challenge);
  } catch (error: any) {
    console.error('Error creating challenge:', error);

    // Provide more detailed error message
    const errorMessage = error.name === 'SequelizeValidationError'
      ? `Validation error: ${error.errors.map((e: any) => e.message).join(', ')}`
      : 'Failed to create challenge';

    res.status(500).json({ message: errorMessage, error: error.message });
  }
};

export const updateChallenge = async (req: Request, res: Response) => {
  try {
    const challenge = await Challenge.findByPk(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    await challenge.update(req.body);
    res.json(challenge);
  } catch (error) {
    console.error('Error updating challenge:', error);
    res.status(500).json({ message: 'Failed to update challenge' });
  }
};

export const deleteChallenge = async (req: Request, res: Response) => {
  try {
    const challenge = await Challenge.findByPk(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    await challenge.destroy();
    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    res.status(500).json({ message: 'Failed to delete challenge' });
  }
};
