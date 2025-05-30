import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AccountModel } from '../models/Account';
import { BoardModel } from '../models/Board';
import { WorkflowModel } from '../models/Workflow';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { AuthRequest, Account } from '../types';

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
        const account = await AccountModel.findOne({ email });
        if (!account || !(await account.comparePassword(password))) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = jwt.sign({ id: account._id }, env.jwtSecret, { expiresIn: '24h' });
        res.cookie("token", token, {
            expires: new Date(Date.now() + 60 * 60 * 1000),
            sameSite: "strict",
            httpOnly: true,
            secure: false
        });
        res.status(200).json({ _id: account._id });
    } catch (error) {
        logger.error(`Login error: ${(error as Error).message}`);
        res.status(500).json({ error: 'Server error' });
    }
};

export const createAccount = async (req: Request, res: Response): Promise<void> => {
    const { email, password, username } = req.body;
    try {
        const account = await AccountModel.create({ email, password, username });
        const token = jwt.sign({ id: account._id }, env.jwtSecret, { expiresIn: '24h' });
        res.cookie("token", token, {
            expires: new Date(Date.now() + 60 * 60 * 1000),
            sameSite: "strict",
            httpOnly: true,
            secure: false
        });
        res.status(201).json({ _id: account._id });
    } catch (error) {
        logger.error(`Create account error: ${(error as Error).message}`);
        res.status(400).json({ error: 'Account creation failed' });
    }
};

export const getAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const account = await AccountModel.findById(req.params.id).select('-password');
        if (!account) {
            res.status(404).json({ error: 'Account not found' });
            return;
        }
        res.json(account);
    } catch (error) {
        logger.error(`Get account error: ${(error as Error).message}`);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getBoards = async (req: Request, res: Response): Promise<void> => {
    try {
        const boards = await BoardModel.find({ owner: req.params.id });
        res.json(boards);
    } catch (error) {
        logger.error(`Get boards error: ${(error as Error).message}`);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const account = await AccountModel.findById(req.params.id).select('settings');
        if (!account) {
            res.status(404).json({ error: 'Account not found' });
            return;
        }
        res.json(account.settings);
    } catch (error) {
        logger.error(`Get settings error: ${(error as Error).message}`);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const account = await AccountModel.findByIdAndUpdate(
            req.params.id,
            { settings: req.body },
            { new: true }
        ).select('settings');
        if (!account) {
            res.status(404).json({ error: 'Account not found' });
            return;
        }
        res.json(account.settings);
    } catch (error) {
        logger.error(`Update settings error: ${(error as Error).message}`);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const account = await AccountModel.findByIdAndDelete(req.params.id);
        if (!account) {
            res.status(404).json({ error: 'Account not found' });
            return;
        }
        await WorkflowModel.deleteMany({ board: { $in: await BoardModel.find({ owner: req.params.id }).distinct('_id') } });
        await BoardModel.deleteMany({ owner: req.params.id });
        res.json({ message: 'Account deleted' });
    } catch (error) {
        logger.error(`Delete account error: ${(error as Error).message}`);
        res.status(500).json({ error: 'Server error' });
    }
};