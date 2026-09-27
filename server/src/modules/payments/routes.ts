import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import * as controller from './controller.js';

const router = Router();
router.post('/', requireAuth, controller.create);
router.get('/:id', requireAuth, controller.detail);
router.post('/:id/confirm', requireAuth, controller.confirm);
export default router;
