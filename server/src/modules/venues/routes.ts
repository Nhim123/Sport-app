import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import * as controller from './controller.js';

// Routes "venues" — mount tại /api/v1/venues. Tất cả yêu cầu đăng nhập (role auth).
const router = Router();

router.get('/', requireAuth, controller.list);
router.get('/:id', requireAuth, controller.detail);
router.get('/:id/schedule', requireAuth, controller.schedule);

export default router;
