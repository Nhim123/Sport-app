import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';
import { ApiError } from '../../middleware/errorHandler.js';
import * as service from './service.js';
import { scheduleQuery } from './schema.js';

export async function mySchedule(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const p = scheduleQuery.safeParse(req.query);
    if (!p.success) throw new ApiError(400, 'Tham so khong hop le');
    res.json(await service.mySchedule(req.userId as string, p.data.week));
  } catch (err) { next(err); }
}
