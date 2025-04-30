"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAdmin = void 0;
/**
 * Middleware to validate if the authenticated user is an admin
 */
const validateAdmin = async (req, res, next) => {
    try {
        // Check if user exists in request (set by authenticate middleware)
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }
        // Check if user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access forbidden. Admin privileges required.' });
        }
        // User is an admin, proceed to the next middleware or route handler
        next();
    }
    catch (error) {
        console.error('Error in admin validation middleware:', error);
        res.status(500).json({ error: 'Internal server error during admin validation' });
    }
};
exports.validateAdmin = validateAdmin;
//# sourceMappingURL=validateAdmin.js.map