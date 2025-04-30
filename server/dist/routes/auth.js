"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const User_1 = __importDefault(require("../models/User"));
const validate_1 = require("../middleware/validate");
const router = express_1.default.Router();
// Validation middleware
const signupValidation = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('discordUsername').optional(),
    validate_1.validate
];
const loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
    validate_1.validate
];
/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', signupValidation, async (req, res) => {
    try {
        const { name, email, password, discordUsername } = req.body;
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create user
        const user = await User_1.default.create({
            name,
            email,
            password,
            discordUsername,
            walletBalance: 0,
            status: 'active',
        });
        // Generate JWT token
        const token = (0, auth_1.generateToken)(user.id);
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                discordUsername: user.discordUsername,
                walletBalance: user.walletBalance,
            },
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', loginValidation, async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await User_1.default.findOne({ where: { email } });
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
        // Generate JWT token
        const token = (0, auth_1.generateToken)(user.id);
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                discordUsername: user.discordUsername,
                walletBalance: user.walletBalance,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
/**
 * @route   POST /api/auth/update-crypto-address
 * @desc    Update user's crypto address
 * @access  Private (will use auth middleware in index.js)
 */
router.post('/update-crypto-address', async (req, res) => {
    try {
        const { cryptoAddress } = req.body;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        // Find user
        const user = await User_1.default.findByPk(userId);
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
    }
    catch (error) {
        console.error('Update crypto address error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map