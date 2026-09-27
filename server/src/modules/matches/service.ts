import { ApiError } from '../../middleware/errorHandler.js';
import { MatchModel } from './model.js';
import type { ListMatchesQuery, CreateMatchBody } from './schema.js';

export async function list(q: ListMatchesQuery) {
  const [items, total] = await Promise.all([
    MatchModel.find().sort({ createdAt: -1 }).skip((q.page - 1) * q.limit).limit(q.limit).lean(),
    MatchModel.countDocuments(),
  ]);
  return { items, page: q.page, limit: q.limit, total };
}

export async function create(userId: string, data: CreateMatchBody) {
  const doc = await MatchModel.create({ ...data, createdBy: userId, joined: 1 });
  return doc.toObject();
}

export async function join(id: string) {
  const m = await MatchModel.findByIdAndUpdate(id, { $inc: { joined: 1 } }, { new: true }).lean().catch(() => null);
  if (!m) throw new ApiError(404, 'Khong tim thay keo');
  return m;
}
