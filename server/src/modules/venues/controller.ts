import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';
import { ApiError } from '../../middleware/errorHandler.js';
import * as service from './service.js';
import { listVenuesQuery, scheduleQuery } from './schema.js';

// Controllers "venues" — validate query bằng Zod, gọi service, trả JSON.
export async function list(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = listVenuesQuery.safeParse(req.query);
    if (!parsed.success) throw new ApiError(400, 'Tham số tìm kiếm không hợp lệ');
    res.json(await service.list(parsed.data));
  } catch (err) { next(err); }
}

export async function detail(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await service.getById(req.params.id));
  } catch (err) { next(err); }
}

export async function schedule(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = scheduleQuery.safeParse(req.query);
    if (!parsed.success) throw new ApiError(400, 'Tham số ngày không hợp lệ');
    res.json(await service.getSchedule(req.params.id, parsed.data.date));
  } catch (err) { next(err); }
}
