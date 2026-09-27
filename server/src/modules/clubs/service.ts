import { ApiError } from '../../middleware/errorHandler.js';
import { ClubModel, ClubMembershipModel } from './model.js';
import type { ListClubsQuery, CreateClubBody, JoinClubBody } from './schema.js';

export async function list(q: ListClubsQuery) {
  const filter: Record<string, unknown> = {};
  if (q.sport) filter.sports = q.sport;
  if (q.q) filter.name = new RegExp(q.q, 'i');
  const [items, total] = await Promise.all([
    ClubModel.find(filter).skip((q.page - 1) * q.limit).limit(q.limit).lean(),
    ClubModel.countDocuments(filter),
  ]);
  return { items, page: q.page, limit: q.limit, total };
}

export async function getById(id: string) {
  const c = await ClubModel.findById(id).lean().catch(() => null);
  if (!c) throw new ApiError(404, 'Khong tim thay CLB');
  return c;
}

export async function create(userId: string, data: CreateClubBody) {
  const code = 'CLB' + Math.random().toString(36).slice(2, 7).toUpperCase();
  const club = await ClubModel.create({ ...data, code, members: 1 });
  await ClubMembershipModel.create({ clubId: club.id, userId, role: 'owner' });
  return club.toObject();
}

export async function myClubs(userId: string) {
  const memberships = await ClubMembershipModel.find({ userId }).lean();
  const ids = memberships.map((m) => m.clubId);
  const clubs = await ClubModel.find({ _id: { $in: ids } }).lean();
  return { items: clubs };
}

export async function join(userId: string, body: JoinClubBody) {
  const club = await ClubModel.findOne({ code: body.code }).catch(() => null);
  if (!club) throw new ApiError(404, 'Ma CLB khong dung');
  const existed = await ClubMembershipModel.findOne({ clubId: club.id, userId });
  if (existed) throw new ApiError(409, 'Ban da o trong CLB nay');
  await ClubMembershipModel.create({ clubId: club.id, userId, role: 'member' });
  await ClubModel.updateOne({ _id: club.id }, { $inc: { members: 1 } });
  return club.toObject();
}
