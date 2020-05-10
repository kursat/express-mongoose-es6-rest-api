import express from 'express';
import AuthRouter from './AuthRouter';
import RoleRouter from './RoleRouter';
import UserRouter from './UserRouter';

const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

router.use('/users', UserRouter);
router.use('/roles', RoleRouter);
router.use('/auth', AuthRouter);

export default router;
