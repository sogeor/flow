import winston from 'winston';
import { env } from './env';

export const logger = winston.createLogger({
    level: env.nodeEnv === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

if (env.nodeEnv !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}