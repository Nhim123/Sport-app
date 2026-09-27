import { Router } from 'express';
import * as controller from './controller.js';

// Routes cho "auth" — dự kiến mount tại /api/v1/auth trong app.ts.
const router = Router();

router.get('/', controller.list);

export default router;
