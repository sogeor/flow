import { Request, Response } from 'express';
import { WorkflowModel } from '../models/Workflow';
import { logger } from '../config/logger';

export const getWorkflow = async (req: Request, res: Response): Promise<void> => {
    try {
        const workflows = await WorkflowModel.find({ board: req.params.id });
        res.json(workflows);
    } catch (error) {
        logger.error(`Get workflow error: ${(error as Error).message}`);
        res.status(500).json({ error: 'Server error' });
    }
};

export const createWorkflow = async (req: Request, res: Response): Promise<void> => {
    const { title } = req.body;
    try {
        const workflow = await WorkflowModel.create({ title, board: req.params.id });
        res.status(201).json(workflow);
    } catch (error) {
        logger.error(`Create workflow error: ${(error as Error).message}`);
        res.status(400).json({ error: 'Workflow creation failed' });
    }
};

export const createCard = async (req: Request, res: Response): Promise<void> => {
    const { title, description } = req.body;
    try {
        const workflow = await WorkflowModel.findById(req.params.fid);
        if (!workflow) {
            res.status(404).json({ error: 'Workflow not found' });
            return;
        }
        const updatedWorkflow = await WorkflowModel.findByIdAndUpdate(
            req.params.fid,
            { $push: { cards: { title, description } } },
            { new: true }
        );
        res.status(201).json(updatedWorkflow?.cards[updatedWorkflow.cards.length - 1]);
    } catch (error) {
        logger.error(`Create card error: ${(error as Error).message}`);
        res.status(400).json({ error: 'Card creation failed' });
    }
};

export const deleteWorkflow = async (req: Request, res: Response): Promise<void> => {
    try {
        const workflow = await WorkflowModel.findByIdAndDelete(req.params.fid);
        if (!workflow) {
            res.status(404).json({ error: 'Workflow not found' });
            return;
        }
        res.json({ message: 'Workflow deleted' });
    } catch (error) {
        logger.error(`Delete workflow error: ${(error as Error).message}`);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteCard = async (req: Request, res: Response): Promise<void> => {
    try {
        const workflow = await WorkflowModel.findByIdAndUpdate(
            req.params.fid,
            { $pull: { cards: { _id: req.params.cid } } },
            { new: true }
        );
        if (!workflow) {
            res.status(404).json({ error: 'Workflow not found' });
            return;
        }
        res.json({ message: 'Card deleted' });
    } catch (error) {
        logger.error(`Delete card error: ${(error as Error).message}`);
        res.status(500).json({ error: 'Server error' });
    }
};