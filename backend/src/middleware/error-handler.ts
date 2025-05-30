import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`Error: ${err.message}, Stack: ${err.stack}`);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
    });
};