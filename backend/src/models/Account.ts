import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { Account } from '../types';

const AccountSchema = new Schema<Account>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    settings: {
        theme: { type: String, default: 'light' },
        notifications: { type: Boolean, default: true },
    },
    createdAt: { type: Date, default: Date.now },
});

AccountSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

AccountSchema.methods.comparePassword = async function (password: string) {
    return bcrypt.compare(password, this.password);
};

export const AccountModel = mongoose.model<Account>('Account', AccountSchema);