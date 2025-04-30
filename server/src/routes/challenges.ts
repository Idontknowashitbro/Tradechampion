import express from 'express';
import { body, param } from 'express-validator';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  getChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  updateChallengeStatus
} from '../controllers/challengeController';

const router = express.Router();

// Validation middlewares
const challengeValidation = [
  body('type').isIn(['daily', 'weekly', 'monthly', 'micro']).withMessage('Invalid challenge type'),
  body('name').notEmpty().withMessage('Name is required'),
  body('startDate').isISO8601().toDate().withMessage('Start date must be valid'),
  body('endDate').isISO8601().toDate().withMessage('End date must be valid'),
  body('initialBalance').isNumeric().withMessage('Initial balance must be a number'),
  body('entryFee').isNumeric().withMessage('Entry fee must be a number'),
  body('maxDrawdown').isNumeric().withMessage('Maximum drawdown must be a number'),
  body('maxDailyDrawdown').isNumeric().withMessage('Maximum daily drawdown must be a number'),
  body('maxRiskPerTrade').isNumeric().withMessage('Maximum risk per trade must be a number'),
  body('minTrades').isInt({ min: 1 }).withMessage('Minimum trades must be a positive integer'),
  validate
];

const idValidation = [
  param('id').isInt().withMessage('Invalid challenge ID'),
  validate
];

// Public routes
router.get('/', getChallenges);
router.get('/:id', idValidation, getChallengeById);

// Admin routes (require authentication and admin privileges)
router.post('/', authenticate, authorizeAdmin, challengeValidation, createChallenge);
router.put('/:id', authenticate, authorizeAdmin, idValidation, challengeValidation, updateChallenge);
router.delete('/:id', authenticate, authorizeAdmin, idValidation, deleteChallenge);
router.patch('/:id/status', authenticate, authorizeAdmin, idValidation, 
  body('status').isIn(['upcoming', 'active', 'completed', 'cancelled']).withMessage('Invalid status'),
  validate,
  updateChallengeStatus
);

export default router; 