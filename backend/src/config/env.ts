import dotenv from 'dotenv';

dotenv.config();

export const env = {
    port: Number(process.env.PORT) || 3000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/kanban',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    nodeEnv: process.env.NODE_ENV || 'development',
};