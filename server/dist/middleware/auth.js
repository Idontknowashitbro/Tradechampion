"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = exports.generateToken = exports.isAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
/**
 * Authentication middleware
 * Verifies JWT token and sets userId in the request
 */
const authenticate = async (req, res, next) => {
    var _a, _b;
    try {
        // Get token from header or cookie
        const token = (((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) ||
            ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.auth_token));
        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Check if user exists
        const user = await models_1.User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        if (user.status === 'banned') {
            return res.status(403).json({ message: 'Your account has been suspended' });
        }
        // Set userId and userRole in the request
        req.userId = decoded.id;
        req.userRole = decoded.role || user.role;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid token, access denied' });
    }
};
exports.authenticate = authenticate;
/**
 * Admin authorization middleware
 * Checks if the authenticated user has admin role
 */
const isAdmin = (req, res, next) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.isAdmin = isAdmin;
// Generate JWT token
const generateToken = (userId) => {
    // Use any to bypass strict TypeScript checks
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET || 'default_secret_key', { expiresIn: '24h' });
};
exports.generateToken = generateToken;
// Export isAdmin as authorizeAdmin for backward compatibility
exports.authorizeAdmin = exports.isAdmin;
//# sourceMappingURL=auth.js.map