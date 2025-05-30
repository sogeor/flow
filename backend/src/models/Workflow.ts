import mongoose, { Schema } from 'mongoose';
import { Workflow } from '../types';

const CardSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const WorkflowSchema = new Schema<Workflow>({
    board: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
    title: { type: String, required: true },
    cards: [CardSchema],
    createdAt: { type: Date, default: Date.now },
});

export const WorkflowModel = mongoose.model<Workflow>('Workflow', WorkflowSchema);