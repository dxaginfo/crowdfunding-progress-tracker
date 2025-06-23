import { Router } from 'express';
import { createCampaign, getUserCampaigns, getCampaign, updateCampaign, deleteCampaign } from '../controllers/campaignController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/', auth, createCampaign);
router.get('/user', auth, getUserCampaigns);
router.get('/:id', getCampaign);
router.put('/:id', auth, updateCampaign);
router.delete('/:id', auth, deleteCampaign);

export default router;
