import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database';
import { env } from './config/env';
import { logger } from './config/logger';
import { router } from './routes';
import { errorHandler } from './middleware/error-handler';
import cookieParser from 'cookie-parser'

const createApp = (): Express => {
    const app = express();

    app.use(helmet());
    app.use(cors());
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            limit: env.nodeEnv === 'production' ? 100 : 1000,
        })
    );
    app.use(cookieParser())

    app.use(express.json());
    app.use('/api', router);
    app.use(errorHandler);

    return app;
};

const startServer = async (): Promise<void> => {
    await connectDB();
    const app = createApp();
    app.listen(env.port, () => {
        logger.info(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
    });
};

startServer();