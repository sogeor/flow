import { Request, Response } from 'express';
import { BoardModel } from '../models/Board';
import { WorkflowModel } from '../models/Workflow';
import { logger } from '../config/logger';
import { AuthRequest } from '../types';

export const createBoard = async (req: AuthRequest, res: Response): Promise<void> => {
    const { title, settings } = req.body;
    try {
        const board = await BoardModel.create({ title, settings, owner: req.user?.id });
        res.status(201).json(board);
    } catch (error) {
        logger.error(`Create board error: ${(error as Error).message}`);
        res.status(400).json({ error: 'Board creation failed' });
    }
};

export const getBoardSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const board = await BoardModel.findById(req.params.id).select('settings');
        if (!board) {
            res.status(404).json({ error: 'Board not found' });
            return;
        }
        res.json(board.settings);
    } catch (error) {
        logger.error(`Get board settings error: ${(error as Error).message}`);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateBoardSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const board = await BoardModel.findByIdAndUpdate(
            req.params.id,
            { settings: req.body },
            { new: true }
        ).select('settings');
        if (!board) {
            res.status(404).json({ error: 'Board not found' });
            return;
        }
        res.json(board.settings);
    } catch (error) {
        logger.error(`Update board settings error: ${(error as Error).message}`);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteBoard = async (req: Request, res: Response): Promise<void> => {
    try {
        const board = await BoardModel.findByIdAndDelete(req.params.id);
        if (!board) {
            res.status(404).json({ error: 'Board not found' });
            return;
        }
        await WorkflowModel.deleteMany({ board: req.params.id });
        res.json({ message: 'Board deleted' });
    } catch (error) {
        logger.error(`Delete board error: ${(error as Error).message}`);
        res.status(500).json({ error: 'Server error' });
    }
};