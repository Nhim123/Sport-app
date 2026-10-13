import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.js';
import { ApiError } from './errorHandler.js';
import { ClubMembershipModel } from '../modules/clubs/model.js';

// Cross-cutting authz: chi cho phep khi user co role phu hop trong CLB.
// clubId lay tu body (POST) hoac params. KHONG tin role do client gui.
export function requireClubRole(...roles: Array<'owner' | 'admin' | 'member'>) {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const clubId = (req.body?.clubId ?? req.params.clubId) as string | undefined;
      if (!clubId) throw new ApiError(400, 'Thieu clubId');
      const membership = await ClubMembershipModel.findOne({ clubId, userId: req.userId }).lean();
      if (!membership || !roles.includes(membership.role as 'owner' | 'admin' | 'member')) {
        throw new ApiError(403, 'Chi quan tri vien CLB moi duoc thao tac');
      }
      next();
    } catch (err) { next(err); }
  };
}
