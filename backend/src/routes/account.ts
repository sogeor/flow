import { Router } from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as accountController from '../controllers/account';

export const accountRouter = Router();

accountRouter.post(
    '/login',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').notEmpty().withMessage('Password is required'),
        validate,
    ],
    accountController.login
);

accountRouter.post(
    '/create',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('username').notEmpty().withMessage('Username is required'),
        validate,
    ],
    accountController.createAccount
);

accountRouter.get('/:id/about', auth, accountController.getAccount);
accountRouter.get('/:id/boards', auth, accountController.getBoards);
accountRouter.get('/:id/settings', auth, accountController.getSettings);
accountRouter.put('/:id/settings', auth, accountController.updateSettings);
accountRouter.delete('/:id', auth, accountController.deleteAccount);