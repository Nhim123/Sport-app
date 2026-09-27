import type { Request, Response } from 'express';
import * as service from './service.js';

export function jwks(_req: Request, res: Response): void {
  res.json(service.jwks());
}
