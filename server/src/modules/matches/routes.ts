import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import * as controller from './controller.js';

const router = Router();
router.get('/', requireAuth, controller.list);
router.post('/', requireAuth, controller.create);
router.post('/:id/join', requireAuth, controller.join);
export default router;
