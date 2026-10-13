import type { Request, Response, NextFunction } from 'express';
import * as service from './service.js';

// Controllers cho "users" — nhận req, gọi service, trả JSON.
export async function list(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await service.list());
  } catch (err) {
    next(err);
  }
}
