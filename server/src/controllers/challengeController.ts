import { Request, Response } from 'express';
import { Challenge, ChallengeEntry, User, WalletTransaction } from '../models';
import { Op } from 'sequelize';

/**
 * Get all active challenges
 * @route GET /api/challenges
 */
export const getChallenges = async (req: Request, res: Response) => {
  try {
    const challenges = await Challenge.findAll({
      where: {
        status: {
          [Op.in]: ['upcoming', 'active']
        }
      },
      order: [['startDate', 'ASC']]
    });

    res.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get challenge by ID
 * @route GET /api/challenges/:id
 */
export const getChallengeById = async (req: Request, res: Response) => {
  try {
    const challenge = await Challenge.findByPk(req.params.id, {
      include: [
        {
          model: ChallengeEntry,
          as: 'entries',
          attributes: ['id', 'userId', 'metrics', 'rank', 'status'],
          include: [
            {
              model: User,
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
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a new challenge (admin only)
 * @route POST /api/challenges
 */
export const createChallenge = async (req: Request, res: Response) => {
  try {
    const {
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
      rules
    } = req.body;

    const challenge = await Challenge.create({
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
      prizePool: 0, // Will be calculated based on entries
      status: new Date() > new Date(startDate) ? 'active' : 'upcoming',
      rules: rules || {}
    });

    res.status(201).json(challenge);
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update a challenge (admin only)
 * @route PUT /api/challenges/:id
 */
export const updateChallenge = async (req: Request, res: Response) => {
  try {
    const challenge = await Challenge.findByPk(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Don't allow updates if challenge has already started
    if (challenge.status !== 'upcoming') {
      return res.status(400).json({ message: 'Cannot update a challenge that has already started' });
    }

    await challenge.update(req.body);

    res.json(challenge);
  } catch (error) {
    console.error('Error updating challenge:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete a challenge (admin only)
 * @route DELETE /api/challenges/:id
 */
export const deleteChallenge = async (req: Request, res: Response) => {
  try {
    const challenge = await Challenge.findByPk(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Don't allow deletion if challenge has already started
    if (challenge.status !== 'upcoming') {
      return res.status(400).json({ message: 'Cannot delete a challenge that has already started' });
    }

    await challenge.destroy();

    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update challenge status (admin only)
 * @route PATCH /api/challenges/:id/status
 */
export const updateChallengeStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    if (!['upcoming', 'active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const challenge = await Challenge.findByPk(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    await challenge.update({ status });

    res.json(challenge);
  } catch (error) {
    console.error('Error updating challenge status:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 