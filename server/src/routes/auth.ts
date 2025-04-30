import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth';
import { authenticateJWT } from '../middleware/authMiddleware';
import User from '../models/User';
import { validate } from '../middleware/validate';

const router = express.Router();

// Validation middleware
const signupValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('discordUsername').optional(),
  validate
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', signupValidation, async (req: Request, res: Response) => {
  try {
    const { name, email, password, discordUsername } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password, // Will be hashed by the model hooks
      discordUsername,
      walletBalance: 0,
      status: 'active',
    });

    // Generate JWT token with user role
    const token = generateToken(user.id, user.role);

    console.log(`User registered: ${user.email}, Role: ${user.role}`);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        discordUsername: user.discordUsername,
        walletBalance: user.walletBalance,
        role: user.role, // Include role in the response
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', loginValidation, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is banned
    if (user.status === 'banned') {
      return res.status(403).json({ message: 'Your account has been banned' });
    }

    // Check password
    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Special case for admin@example.com - force set role to admin
    if (email === 'admin@example.com') {
      user.role = 'admin';
      await user.save();
      console.log(`Admin user role updated: ${user.email}, Role: ${user.role}`);
    }

    // Generate JWT token with user role
    const token = generateToken(user.id, user.role);

    console.log(`User logged in: ${user.email}, Role: ${user.role}`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        discordUsername: user.discordUsername,
        walletBalance: user.walletBalance,
        role: user.role, // Include role in the response
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/auth/update-crypto-address
 * @desc    Update user's crypto address
 * @access  Private (will use auth middleware in index.js)
 */
router.post('/update-crypto-address', async (req: Request, res: Response) => {
  try {
    const { cryptoAddress } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update crypto address
    user.cryptoAddress = cryptoAddress;
    await user.save();

    res.json({
      message: 'Crypto address updated successfully',
      cryptoAddress: user.cryptoAddress,
    });
  } catch (error) {
    console.error('Update crypto address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Special route to check admin status
router.get('/check-admin', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    // Find user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`Admin check for user: ${user.email}, Role: ${user.role}, UserRole from req: ${req.userRole}`);

    // Check if user is admin
    const isAdmin = user.role === 'admin';

    res.json({
      isAdmin,
      role: user.role,
      reqUserRole: req.userRole,
      email: user.email
    });
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;