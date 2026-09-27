import { ApiError } from '../../middleware/errorHandler.js';
import { VenueModel } from './model.js';
import type { ListVenuesQuery } from './schema.js';

// Business logic "venues". Truy cập dữ liệu qua ./model, không import model domain khác.
export async function list(q: ListVenuesQuery) {
  const filter: Record<string, unknown> = {};
  if (q.sport) filter.sport = q.sport;
  if (q.district) filter.district = new RegExp(q.district, 'i');
  if (q.q) filter.name = new RegExp(q.q, 'i');

  const [items, total] = await Promise.all([
    VenueModel.find(filter).skip((q.page - 1) * q.limit).limit(q.limit).lean(),
    VenueModel.countDocuments(filter),
  ]);
  return { items, page: q.page, limit: q.limit, total };
}

export async function getById(id: string) {
  const venue = await VenueModel.findById(id).lean().catch(() => null);
  if (!venue) throw new ApiError(404, 'Không tìm thấy sân');
  return venue;
}

// Suy "giờ đặt" từ giờ mở/đóng của sân (CourtSchedule cho màn đặt sân/thanh toán).
export async function getSchedule(id: string, date?: string) {
  const venue = await getById(id);
  const openTime = venue.openTime || '06:00';
  const closeTime = venue.closeTime || '22:00';
  const sessionMinutes = 60;
  return { date: date || 'Hôm nay', openTime, closeTime, sessionMinutes, slots: buildSlots(openTime, closeTime, sessionMinutes) };
}

function buildSlots(open: string, close: string, mins: number) {
  const toMin = (h: string) => { const [a, b] = h.split(':').map(Number); return a * 60 + b; };
  const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
  const fmt = (m: number) => pad(Math.floor(m / 60)) + ':' + pad(m % 60);
  const slots: Array<{ id: string; time: string; state: 'free' | 'booked' }> = [];
  for (let m = toMin(open); m + mins <= toMin(close); m += mins) {
    slots.push({ id: 's' + fmt(m).replace(':', ''), time: fmt(m), state: 'free' });
  }
  return slots;
}
