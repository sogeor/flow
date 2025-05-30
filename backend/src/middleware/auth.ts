import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { AuthRequest, UserPayload } from '../types';

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new Error('Authentication required');
        }
        const decoded = jwt.verify(token, env.jwtSecret) as UserPayload;
        (req as AuthRequest).user = decoded;
        if (req.params.id === 'me') req.params.id = decoded.id;
        next();
    } catch (error) {
        logger.error(`Auth error: ${(error as Error).message}`);
        res.status(401).json({ error: 'Please authenticate' });
    }
};