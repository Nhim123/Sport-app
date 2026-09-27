import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';
import { ApiError } from '../../middleware/errorHandler.js';
import * as service from './service.js';
import { listMatchesQuery, createMatchBody } from './schema.js';

export async function list(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const p = listMatchesQuery.safeParse(req.query);
    if (!p.success) throw new ApiError(400, 'Tham so khong hop le');
    res.json(await service.list(p.data));
  } catch (err) { next(err); }
}
export async function create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const p = createMatchBody.safeParse(req.body);
    if (!p.success) throw new ApiError(400, 'Du lieu khong hop le');
    res.status(201).json(await service.create(req.userId as string, p.data));
  } catch (err) { next(err); }
}
export async function join(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await service.join(req.params.id)); } catch (err) { next(err); }
}
