import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';
import { ApiError } from '../../middleware/errorHandler.js';
import * as service from './service.js';
import { listPollsQuery, createPollBody, voteBody } from './schema.js';

export async function list(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const p = listPollsQuery.safeParse(req.query);
    if (!p.success) throw new ApiError(400, 'Thieu clubId');
    res.json(await service.listByClub(p.data.clubId));
  } catch (err) { next(err); }
}
export async function create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const p = createPollBody.safeParse(req.body);
    if (!p.success) throw new ApiError(400, 'Du lieu khong hop le');
    res.status(201).json(await service.create(req.userId as string, p.data));
  } catch (err) { next(err); }
}
export async function detail(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await service.getById(req.params.id)); } catch (err) { next(err); }
}
export async function vote(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const p = voteBody.safeParse(req.body);
    if (!p.success) throw new ApiError(400, 'Du lieu khong hop le');
    res.json(await service.vote(req.userId as string, req.params.id, p.data));
  } catch (err) { next(err); }
}
