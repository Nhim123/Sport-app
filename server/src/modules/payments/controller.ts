import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';
import { ApiError } from '../../middleware/errorHandler.js';
import * as service from './service.js';
import { createPaymentBody } from './schema.js';

export async function create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const p = createPaymentBody.safeParse(req.body);
    if (!p.success) throw new ApiError(400, 'Du lieu khong hop le');
    res.status(201).json(await service.create(req.userId as string, p.data));
  } catch (err) { next(err); }
}
export async function detail(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await service.getById(req.userId as string, req.params.id)); } catch (err) { next(err); }
}
export async function confirm(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await service.confirm(req.userId as string, req.params.id)); } catch (err) { next(err); }
}
