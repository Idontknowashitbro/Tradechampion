import { Request, Response } from 'express';
import { Challenge } from '../models';
import leaderboardService from '../services/leaderboardService';

/**
 * Get leaderboard for a challenge
 * @route GET /api/leaderboards/:challengeId
 */
export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const { challengeId } = req.params;
    
    // Validate challenge ID
    if (!challengeId) {
      return res.status(400).json({ message: 'Challenge ID is required' });
    }
    
    // Generate leaderboard using the leaderboard service
    const leaderboard = await leaderboardService.generateLeaderboard(parseInt(challengeId));
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get top performers for a challenge
 * @route GET /api/leaderboards/:challengeId/top/:percentage
 */
export const getTopPerformers = async (req: Request, res: Response) => {
  try {
    const { challengeId, percentage } = req.params;
    
    // Validate params
    if (!challengeId) {
      return res.status(400).json({ message: 'Challenge ID is required' });
    }
    
    const topPercent = percentage ? parseFloat(percentage) / 100 : 0.3; // Default to top 30%
    
    // Get top performers
    const topPerformers = await leaderboardService.getTopPerformers(
      parseInt(challengeId),
      topPercent
    );
    
    res.json(topPerformers);
  } catch (error) {
    console.error('Error fetching top performers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Admin endpoint to manually update a challenge leaderboard
 * @route POST /api/leaderboards/:challengeId/update
 */
export const updateLeaderboard = async (req: Request, res: Response) => {
  try {
    const { challengeId } = req.params;
    
    // Validate challenge ID
    if (!challengeId) {
      return res.status(400).json({ message: 'Challenge ID is required' });
    }
    
    // Check if challenge exists
    const challenge = await Challenge.findByPk(parseInt(challengeId));
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    // Generate and update leaderboard
    const updatedLeaderboard = await leaderboardService.generateLeaderboard(parseInt(challengeId));
    
    res.json({ 
      message: 'Leaderboard updated successfully', 
      leaderboard: updatedLeaderboard 
    });
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get disqualified entries for a challenge
 * @route GET /api/leaderboards/:challengeId/disqualified
 */
export const getDisqualifiedEntries = async (req: Request, res: Response) => {
  try {
    const { challengeId } = req.params;
    
    // Validate challenge ID
    if (!challengeId) {
      return res.status(400).json({ message: 'Challenge ID is required' });
    }
    
    // Check if challenge exists
    const challenge = await Challenge.findByPk(parseInt(challengeId));
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    // Get disqualified entries
    const disqualifiedEntries = await leaderboardService.getDisqualifiedEntries(parseInt(challengeId));
    
    res.json({
      challengeId: parseInt(challengeId),
      challengeName: challenge.name,
      disqualifiedCount: disqualifiedEntries.length,
      entries: disqualifiedEntries
    });
  } catch (error) {
    console.error('Error fetching disqualified entries:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get entries at risk of disqualification
 * @route GET /api/leaderboards/:challengeId/at-risk/:threshold?
 */
export const getEntriesAtRisk = async (req: Request, res: Response) => {
  try {
    const { challengeId, threshold } = req.params;
    
    // Validate challenge ID
    if (!challengeId) {
      return res.status(400).json({ message: 'Challenge ID is required' });
    }
    
    // Check if challenge exists
    const challenge = await Challenge.findByPk(parseInt(challengeId));
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    // Parse threshold or use default (0.9 = 90% of limits)
    const thresholdValue = threshold ? parseFloat(threshold) / 100 : 0.9;
    
    // Get entries at risk
    const entriesAtRisk = await leaderboardService.getEntriesAtRisk(
      parseInt(challengeId),
      thresholdValue
    );
    
    res.json({
      challengeId: parseInt(challengeId),
      challengeName: challenge.name,
      thresholdPercentage: Math.round(thresholdValue * 100),
      atRiskCount: entriesAtRisk.length,
      entries: entriesAtRisk
    });
  } catch (error) {
    console.error('Error fetching entries at risk:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 