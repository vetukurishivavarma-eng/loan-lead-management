import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  admin?: { username: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  console.log('Auth middleware - JWT_SECRET exists:', !!process.env.JWT_SECRET);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { username: string };
    req.admin = decoded;
    next();
  } catch (err: any) {
    console.error('JWT verify error:', err?.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};
