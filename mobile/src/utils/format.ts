import { CourtSchedule } from '../types';

export function formatVnd(n: number): string {
  return n.toLocaleString('vi-VN') + '₫';
}

const pad2 = (n: number) => (n < 10 ? '0' + n : '' + n);

/** Cộng phút vào "HH:MM", trả "HH:MM" (bọc vòng 24h). */
export function addMinutes(hhmm: string, mins: number): string {
  const [h, m] = hhmm.split(':').map(Number);
  const total = (((h * 60 + m + mins) % 1440) + 1440) % 1440;
  return pad2(Math.floor(total / 60)) + ':' + pad2(total % 60);
}

/** Giờ đặt suy từ lịch chủ sân: khung trống kế tiếp + độ dài buổi. */
export function formatBookingTime(s: CourtSchedule): string {
  const slot = s.slots.find(x => x.state === 'free') ?? s.slots[0];
  if (!slot) return s.date;
  return `${s.date} · ${slot.time}–${addMinutes(slot.time, s.sessionMinutes)}`;
}

/** Khung giờ chủ sân mở cửa. */
export function formatOpenWindow(s: CourtSchedule): string {
  return `${s.openTime}–${s.closeTime}`;
}
