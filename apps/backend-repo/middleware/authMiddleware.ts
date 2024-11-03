import { Request, Response, NextFunction } from 'express';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    return next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
