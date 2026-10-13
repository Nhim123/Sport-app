import { Router } from 'express';
import * as controller from './controller.js';

// Routes cho "users" — dự kiến mount tại /api/v1/users trong app.ts.
const router = Router();

router.get('/', controller.list);

export default router;
