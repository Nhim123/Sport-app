import { ApiError } from '../../middleware/errorHandler.js';
import { MembershipModel, DayPassModel } from './model.js';
import type { CreateDayPassBody } from './schema.js';

export async function getMyMembership(userId: string) {
  const m = await MembershipModel.findOne({ userId }).lean();
  if (!m) throw new ApiError(404, 'Chua co the hoi vien');
  return m;
}

export async function createDayPass(userId: string, data: CreateDayPassBody) {
  const passCode = 'DP' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const doc = await DayPassModel.create({ ...data, userId, passCode, entriesLeft: 1, status: 'active' });
  return doc.toObject();
}

export async function getDayPass(userId: string, id: string) {
  const p = await DayPassModel.findOne({ _id: id, userId }).lean().catch(() => null);
  if (!p) throw new ApiError(404, 'Khong tim thay ve ngay');
  return p;
}
