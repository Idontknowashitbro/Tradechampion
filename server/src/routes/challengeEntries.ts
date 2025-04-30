import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  enterChallenge,
  getEntryById,
  getUserEntries,
  updateConnection
} from '../controllers/challengeEntryController';

const router = express.Router();

// Routes
router.post('/', authenticate, enterChallenge);
router.get('/user', authenticate, getUserEntries);
router.get('/:id', authenticate, getEntryById);
router.patch('/:id/connect', authenticate, updateConnection);

export default router;