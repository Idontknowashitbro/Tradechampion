import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/**
 * Authentication middleware
 * Verifies JWT token and sets userId in the request
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header or cookie
    const token = (
      req.headers.authorization?.split(' ')[1] ||
      req.cookies?.auth_token
    );

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };

    // Check if user exists
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ message: 'Your account has been suspended' });
    }

    // Set userId and userRole in the request
    req.userId = decoded.id;
    req.userRole = user.role; // Always use the role from the database

    console.log(`User authenticated: ${user.email}, Role: ${user.role}`);

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid token, access denied' });
  }
};

/**
 * Admin authorization middleware
 * Checks if the authenticated user has admin role
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(`Checking admin access for user with role: ${req.userRole}`);

    if (req.userRole !== 'admin') {
      console.log('Admin access denied: User does not have admin role');
      return res.status(403).json({ message: 'Admin access required' });
    }

    console.log('Admin access granted');
    next();
  } catch (error) {
    console.error('Admin authorization error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Generate JWT token
export const generateToken = (userId: string, role: string = 'user'): string => {
  // Include user role in the token
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'default_secret_key',
    { expiresIn: '24h' } as any
  );
};

// Export isAdmin as authorizeAdmin for backward compatibility
export const authorizeAdmin = isAdmin;