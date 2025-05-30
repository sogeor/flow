import { Router } from 'express';
import { accountRouter } from './account';
import { boardRouter } from './board';

export const router = Router();

router.use('/account', accountRouter);
router.use('/board', boardRouter);