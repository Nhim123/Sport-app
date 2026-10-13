import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';
import { ApiError } from '../../middleware/errorHandler.js';
import * as service from './service.js';
import { createDayPassBody } from './schema.js';

export async function membership(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await service.getMyMembership(req.userId as string)); } catch (err) { next(err); }
}
export async function createDayPass(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const p = createDayPassBody.safeParse(req.body);
    if (!p.success) throw new ApiError(400, 'Du lieu khong hop le');
    res.status(201).json(await service.createDayPass(req.userId as string, p.data));
  } catch (err) { next(err); }
}
export async function getDayPass(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await service.getDayPass(req.userId as string, req.params.id)); } catch (err) { next(err); }
}
