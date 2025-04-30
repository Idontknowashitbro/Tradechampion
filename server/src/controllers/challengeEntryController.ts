import { Request, Response } from 'express';
import { ChallengeEntry, Challenge, User } from '../models';
import { socketService } from '../index';

/**
 * Enter a challenge
 * @route POST /api/challenge-entries
 */
export const enterChallenge = async (req: Request, res: Response) => {
  try {
    const { challengeId, ctraderAccountId, ctraderAccessToken, ctraderRefreshToken } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if challenge exists
    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Check if challenge is open for entry
    if (challenge.status !== 'upcoming' && challenge.status !== 'active') {
      return res.status(400).json({ message: 'Challenge is not open for entry' });
    }

    // Check if user already has an entry for this challenge
    const existingEntry = await ChallengeEntry.findOne({
      where: {
        userId,
        challengeId
      }
    });

    if (existingEntry) {
      return res.status(400).json({ message: 'You have already entered this challenge' });
    }

    // Create challenge entry
    const entry = await ChallengeEntry.create({
      userId,
      challengeId,
      ctraderAccountId,
      ctraderAccessToken,
      ctraderRefreshToken,
      status: 'pending'
    });

    // Notify user via socket
    socketService.to(userId).emit('notification', {
      title: 'Challenge Entry',
      message: `You have successfully entered the ${challenge.name} challenge`,
      type: 'challenge'
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error('Error entering challenge:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get challenge entry by ID
 * @route GET /api/challenge-entries/:id
 */
export const getEntryById = async (req: Request, res: Response) => {
  try {
    const entry = await ChallengeEntry.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'discordUsername']
        },
        {
          model: Challenge,
          as: 'challenge'
        }
      ]
    });

    if (!entry) {
      return res.status(404).json({ message: 'Challenge entry not found' });
    }

    // Check if the user is requesting their own entry or is an admin
    if (entry.userId !== req.userId && req.user?.status !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(entry);
  } catch (error) {
    console.error('Error fetching challenge entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get user's challenge entries
 * @route GET /api/challenge-entries/user
 */
export const getUserEntries = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const entries = await ChallengeEntry.findAll({
      where: { userId },
      include: [
        {
          model: Challenge,
          as: 'challenge',
          attributes: ['id', 'name', 'type', 'startDate', 'endDate', 'status', 'initialBalance']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(entries);
  } catch (error) {
    console.error('Error fetching user entries:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update cTrader connection status
 * @route PATCH /api/challenge-entries/:id/connect
 */
export const updateConnection = async (req: Request, res: Response) => {
  try {
    const { connectStatus } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find entry
    const entry = await ChallengeEntry.findByPk(req.params.id);
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
    socketService.to(userId).emit('notification', {
      title: 'Connection Status',
      message: `Your connection status has been updated to ${connectStatus}`,
      type: 'connection'
    });

    res.json({
      message: 'Connection status updated successfully',
      connectStatus: entry.connectStatus
    });
  } catch (error) {
    console.error('Error updating connection status:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 