import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(env.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions);
        logger.info('MongoDB connected successfully');
    } catch (error) {
        logger.error(`MongoDB connection error: ${(error as Error).message}`);
        process.exit(1);
    }
};