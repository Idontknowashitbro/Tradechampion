import express from 'express';
import challengeRulesController from '../controllers/challengeRulesController';
import { authenticate } from '../middleware/auth';
import { validateAdmin } from '../middleware/validateAdmin';

const router = express.Router();

// Public routes
router.get('/defaults/:type', challengeRulesController.getDefaultRules);

// Protected routes (require authentication)
router.get('/validate/:challengeEntryId', authenticate, challengeRulesController.validateRules);

// Admin routes
router.put('/:challengeId', authenticate, validateAdmin, challengeRulesController.updateRules);
router.post('/', authenticate, validateAdmin, challengeRulesController.createChallengeWithRules);

export default router; 