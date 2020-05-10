import express from 'express';
import authRouter from './authRouter';
import roleRouter from './roleRouter';
import userRouter from './userRouter';

const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

router.use('/users', userRouter);
router.use('/roles', roleRouter);
router.use('/auth', authRouter);

export default router;
