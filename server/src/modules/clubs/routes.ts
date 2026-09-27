import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import * as controller from './controller.js';

const router = Router();
router.get('/', requireAuth, controller.list);
router.post('/', requireAuth, controller.create);
router.get('/me', requireAuth, controller.myClubs);
router.post('/join', requireAuth, controller.join);
router.get('/:id', requireAuth, controller.detail);
export default router;
