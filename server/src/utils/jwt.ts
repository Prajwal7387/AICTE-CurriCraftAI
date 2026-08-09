import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User.model';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_curricraft_ai_2026';
const JWT_EXPIRES_IN = '7d';

export interface JwtPayload {
  userId: string;
  role: UserRole;
  email: string;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
