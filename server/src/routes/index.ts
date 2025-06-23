import { Router } from 'express';
import userRoutes from './userRoutes';
import campaignRoutes from './campaignRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/campaigns', campaignRoutes);

export default router;
