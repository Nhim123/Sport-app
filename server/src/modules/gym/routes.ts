import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import * as controller from './controller.js';

// Mount tai /api/v1/gym: /gym/membership, /gym/day-passes, /gym/day-passes/:id
const router = Router();
router.get('/membership', requireAuth, controller.membership);
router.post('/day-passes', requireAuth, controller.createDayPass);
router.get('/day-passes/:id', requireAuth, controller.getDayPass);
export default router;
