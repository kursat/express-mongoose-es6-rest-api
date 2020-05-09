import express from 'express';
import { authRouter } from './server/routers/authRouter';
import { roleRouter } from './server/routers/roleRouter';
import { userRouter } from './server/routers/userRouter';

const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

router.use('/users', userRouter);
router.use('/roles', roleRouter);
router.use('/auth', authRouter);

module.exports = router;
