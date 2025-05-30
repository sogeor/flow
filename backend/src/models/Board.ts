import mongoose, { Schema } from 'mongoose';
import { Board } from '../types';

const BoardSchema = new Schema<Board>({
    owner: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    title: { type: String, required: true },
    settings: {
        visibility: { type: String, enum: ['public', 'private'], default: 'private' },
        color: { type: String, default: '#ffffff' },
    },
    createdAt: { type: Date, default: Date.now },
});

export const BoardModel = mongoose.model<Board>('Board', BoardSchema);