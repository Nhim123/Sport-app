import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import * as controller from './controller.js';

// Mount tai /api/v1/polls. List theo ?clubId= (tuong ung /clubs/:id/polls trong docs).
const router = Router();
router.get('/', requireAuth, controller.list);
router.post('/', requireAuth, controller.create);
router.get('/:id', requireAuth, controller.detail);
router.post('/:id/votes', requireAuth, controller.vote);
export default router;
