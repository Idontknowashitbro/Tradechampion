import { Request, Response } from 'express';
import Challenge from '../models/Challenge';
import ChallengeEntry from '../models/ChallengeEntry';
import challengeRulesService from '../services/challengeRulesService';

/**
 * Get default challenge rules by type
 * @route GET /api/challenge-rules/defaults/:type
 */
export const getDefaultRules = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    
    if (!type || !['daily', 'weekly', 'monthly', 'micro'].includes(type)) {
      return res.status(400).json({ message: 'Invalid challenge type' });
    }
    
    const defaultRules = Challenge.getDefaultRules(type as any);
    
    res.json(defaultRules);
  } catch (error) {
    console.error('Error getting default rules:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Validate rules for a challenge entry
 * @route GET /api/challenge-rules/validate/:challengeEntryId
 */
export const validateRules = async (req: Request, res: Response) => {
  try {
    const { challengeEntryId } = req.params;
    const userId = req.userId;
    
    if (!challengeEntryId) {
      return res.status(400).json({ message: 'Challenge entry ID is required' });
    }
    
    // Convert to number
    const entryId = parseInt(challengeEntryId, 10);
    if (isNaN(entryId)) {
      return res.status(400).json({ message: 'Invalid challenge entry ID' });
    }
    
    // Verify user has access to this entry
    const entry = await ChallengeEntry.findByPk(entryId, {
      include: ['challenge']
    });
    
    if (!entry) {
      return res.status(404).json({ message: 'Challenge entry not found' });
    }
    
    // Check if user owns the entry or is an admin
    if (entry.userId !== userId && !(req.user && req.user.role === 'admin')) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Validate rules
    const validationResult = await challengeRulesService.validateRules(entryId);
    
    res.json(validationResult);
  } catch (error) {
    console.error('Error validating rules:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update challenge rule settings
 * @route PUT /api/challenge-rules/:challengeId
 */
export const updateRules = async (req: Request, res: Response) => {
  try {
    // Admin only endpoint
    if (!(req.user && req.user.role === 'admin')) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { challengeId } = req.params;
    
    if (!challengeId) {
      return res.status(400).json({ message: 'Challenge ID is required' });
    }
    
    // Convert to number
    const id = parseInt(challengeId, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid challenge ID' });
    }
    
    // Find challenge
    const challenge = await Challenge.findByPk(id);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    // Extract rule fields from request body
    const {
      maxDrawdown,
      maxDailyDrawdown,
      maxRiskPerTrade,
      minTradeDuration,
      minTrades,
      minTradingDays,
      allowHedging,
      allowMartingale,
      allowScalping,
      swingTradingRequired,
      consistencyRuleEnabled
    } = req.body;
    
    // Update challenge rules
    await challenge.update({
      maxDrawdown: maxDrawdown !== undefined ? maxDrawdown : challenge.maxDrawdown,
      maxDailyDrawdown: maxDailyDrawdown !== undefined ? maxDailyDrawdown : challenge.maxDailyDrawdown,
      maxRiskPerTrade: maxRiskPerTrade !== undefined ? maxRiskPerTrade : challenge.maxRiskPerTrade,
      minTradeDuration: minTradeDuration !== undefined ? minTradeDuration : challenge.minTradeDuration,
      minTrades: minTrades !== undefined ? minTrades : challenge.minTrades,
      minTradingDays: minTradingDays !== undefined ? minTradingDays : challenge.minTradingDays,
      allowHedging: allowHedging !== undefined ? allowHedging : challenge.allowHedging,
      allowMartingale: allowMartingale !== undefined ? allowMartingale : challenge.allowMartingale,
      allowScalping: allowScalping !== undefined ? allowScalping : challenge.allowScalping,
      swingTradingRequired: swingTradingRequired !== undefined ? swingTradingRequired : challenge.swingTradingRequired,
      consistencyRuleEnabled: consistencyRuleEnabled !== undefined ? consistencyRuleEnabled : challenge.consistencyRuleEnabled
    });
    
    res.json({
      message: 'Challenge rules updated successfully',
      challenge: {
        id: challenge.id,
        name: challenge.name,
        type: challenge.type,
        maxDrawdown: challenge.maxDrawdown,
        maxDailyDrawdown: challenge.maxDailyDrawdown,
        maxRiskPerTrade: challenge.maxRiskPerTrade,
        minTradeDuration: challenge.minTradeDuration,
        minTrades: challenge.minTrades,
        minTradingDays: challenge.minTradingDays,
        allowHedging: challenge.allowHedging,
        allowMartingale: challenge.allowMartingale,
        allowScalping: challenge.allowScalping,
        swingTradingRequired: challenge.swingTradingRequired,
        consistencyRuleEnabled: challenge.consistencyRuleEnabled
      }
    });
  } catch (error) {
    console.error('Error updating challenge rules:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create new challenge with rules
 * @route POST /api/challenge-rules
 */
export const createChallengeWithRules = async (req: Request, res: Response) => {
  try {
    // Admin only endpoint
    if (!(req.user && req.user.role === 'admin')) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const {
      name,
      description,
      type,
      startDate,
      endDate,
      initialBalance,
      entryFee,
      prizePool,
      maxDrawdown,
      maxDailyDrawdown,
      maxRiskPerTrade,
      minTradeDuration,
      minTrades,
      minTradingDays,
      allowHedging,
      allowMartingale,
      allowScalping,
      swingTradingRequired,
      consistencyRuleEnabled
    } = req.body;
    
    // Validate required fields
    if (!name || !type || !startDate || !endDate || !initialBalance || !entryFee || !prizePool) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validate challenge type
    if (!['daily', 'weekly', 'monthly', 'micro'].includes(type)) {
      return res.status(400).json({ message: 'Invalid challenge type' });
    }
    
    // Get default rules for this type
    const defaultRules = Challenge.getDefaultRules(type as any);
    
    // Create challenge with merged rules (defaults + provided values)
    const challenge = await Challenge.create({
      name,
      description: description || `${type.charAt(0).toUpperCase() + type.slice(1)} Trading Challenge`,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      initialBalance,
      entryFee,
      prizePool,
      status: new Date() > new Date(startDate) ? 'active' : 'upcoming',
      maxDrawdown: maxDrawdown !== undefined ? maxDrawdown : defaultRules.maxDrawdown,
      maxDailyDrawdown: maxDailyDrawdown !== undefined ? maxDailyDrawdown : defaultRules.maxDailyDrawdown,
      maxRiskPerTrade: maxRiskPerTrade !== undefined ? maxRiskPerTrade : defaultRules.maxRiskPerTrade,
      minTradeDuration: minTradeDuration !== undefined ? minTradeDuration : defaultRules.minTradeDuration,
      minTrades: minTrades !== undefined ? minTrades : defaultRules.minTrades,
      minTradingDays: minTradingDays !== undefined ? minTradingDays : defaultRules.minTradingDays,
      allowHedging: allowHedging !== undefined ? allowHedging : defaultRules.allowHedging,
      allowMartingale: allowMartingale !== undefined ? allowMartingale : defaultRules.allowMartingale,
      allowScalping: allowScalping !== undefined ? allowScalping : defaultRules.allowScalping,
      swingTradingRequired: swingTradingRequired !== undefined ? swingTradingRequired : defaultRules.swingTradingRequired,
      consistencyRuleEnabled: consistencyRuleEnabled !== undefined ? consistencyRuleEnabled : defaultRules.consistencyRuleEnabled
    });
    
    res.status(201).json({
      message: 'Challenge created successfully',
      challenge
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export controller as an object with all methods
const challengeRulesController = {
  getDefaultRules,
  validateRules,
  updateRules,
  createChallengeWithRules
};

export default challengeRulesController; 