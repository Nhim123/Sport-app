import { ApiError } from '../../middleware/errorHandler.js';
import { BookingModel } from './model.js';
import type { ListBookingsQuery, CreateBookingBody } from './schema.js';

export async function list(userId: string, q: ListBookingsQuery) {
  const filter: Record<string, unknown> = { userId };
  if (q.status) filter.status = q.status;
  const [items, total] = await Promise.all([
    BookingModel.find(filter).sort({ createdAt: -1 }).skip((q.page - 1) * q.limit).limit(q.limit).lean(),
    BookingModel.countDocuments(filter),
  ]);
  return { items, page: q.page, limit: q.limit, total };
}

export async function create(userId: string, data: CreateBookingBody) {
  const code = 'BK' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const doc = await BookingModel.create({ ...data, userId, code, status: 'upcoming' });
  return doc.toObject();
}

export async function getById(userId: string, id: string) {
  const b = await BookingModel.findOne({ _id: id, userId }).lean().catch(() => null);
  if (!b) throw new ApiError(404, 'Khong tim thay lich dat');
  return b;
}

export async function cancel(userId: string, id: string) {
  const b = await BookingModel.findOneAndDelete({ _id: id, userId }).lean().catch(() => null);
  if (!b) throw new ApiError(404, 'Khong tim thay lich dat');
  return { ok: true };
}
