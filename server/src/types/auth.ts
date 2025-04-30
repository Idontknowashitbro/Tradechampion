import { Request } from 'express';
import User from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
} 