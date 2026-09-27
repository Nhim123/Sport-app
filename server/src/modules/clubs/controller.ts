import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';
import { ApiError } from '../../middleware/errorHandler.js';
import * as service from './service.js';
import { listClubsQuery, createClubBody, joinClubBody } from './schema.js';

export async function list(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const p = listClubsQuery.safeParse(req.query);
    if (!p.success) throw new ApiError(400, 'Tham so khong hop le');
    res.json(await service.list(p.data));
  } catch (err) { next(err); }
}
export async function create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const p = createClubBody.safeParse(req.body);
    if (!p.success) throw new ApiError(400, 'Du lieu khong hop le');
    res.status(201).json(await service.create(req.userId as string, p.data));
  } catch (err) { next(err); }
}
export async function myClubs(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await service.myClubs(req.userId as string)); } catch (err) { next(err); }
}
export async function join(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const p = joinClubBody.safeParse(req.body);
    if (!p.success) throw new ApiError(400, 'Du lieu khong hop le');
    res.json(await service.join(req.userId as string, p.data));
  } catch (err) { next(err); }
}
export async function detail(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await service.getById(req.params.id)); } catch (err) { next(err); }
}
