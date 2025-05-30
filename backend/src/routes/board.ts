import { Router } from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as boardController from '../controllers/board';
import * as workflowController from '../controllers/workflow';

export const boardRouter = Router();

boardRouter.post(
    '/',
    [body('title').notEmpty().withMessage('Title is required'), validate],
    auth,
    boardController.createBoard
);

boardRouter.get('/:id/settings', auth, boardController.getBoardSettings);
boardRouter.put('/:id/settings', auth, boardController.updateBoardSettings);
boardRouter.delete('/:id', auth, boardController.deleteBoard);

boardRouter.get('/:id/workflow', auth, workflowController.getWorkflow);
boardRouter.post(
    '/:id/workflow',
    [body('title').notEmpty().withMessage('Title is required'), validate],
    auth,
    workflowController.createWorkflow
);

boardRouter.post(
    '/:bid/workflow/:fid/card',
    [body('title').notEmpty().withMessage('Title is required'), validate],
    auth,
    workflowController.createCard
);

boardRouter.delete('/:bid/workflow/:fid', auth, workflowController.deleteWorkflow);
boardRouter.delete('/:bid/workflow/:fid/card/:cid', auth, workflowController.deleteCard);