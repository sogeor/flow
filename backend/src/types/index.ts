import { Request } from 'express';
import { Document, Types } from 'mongoose';

export interface UserPayload {
    id: string;
}

export interface AuthRequest extends Request {
    user?: UserPayload;
}

export interface Account extends Document {
    email: string;
    password: string;
    username: string;
    settings: {
        theme: string;
        notifications: boolean;
    };
    createdAt: Date;
    comparePassword: (password: string) => Promise<boolean>;
}

export interface Board extends Document {
    owner: Types.ObjectId;
    title: string;
    settings: {
        visibility: 'public' | 'private';
        color: string;
    };
    createdAt: Date;
}

export interface Card {
    _id: Types.ObjectId;
    title: string;
    description?: string;
    createdAt: Date;
}

export interface Workflow extends Document {
    board: Types.ObjectId;
    title: string;
    cards: Card[];
    createdAt: Date;
}