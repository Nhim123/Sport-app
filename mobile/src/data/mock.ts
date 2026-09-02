import { grad } from '../theme/tokens';
import {
  Venue, FilterTab, Slot, DayItem,
  Booking, GymClass, Membership, DayPass, CourtSchedule, Club, Match, MenuItem, ProfileStat, Promo,
} from '../types';

// ---- Promo (thanh quảng cáo Home) — đổi theo bộ môn đang chọn ----
export const promos: Promo[] = [
  // Pickleball
  { id: 'pk-promo1', tab: 'pickle', badge: 'ƯU ĐÃI', title: 'Giảm 30% khung giờ vàng',
    subtitle: 'Đặt sân pickleball 12h–15h các ngày trong tuần', ctaLabel: 'Nhận ưu đãi',
    gradient: grad.dark, emoji: '🏓' },
  { id: 'pk-promo2', tab: 'pickle', badge: 'GIẢI ĐẤU', title: 'Giải đôi nam nữ Q7 mở đăng ký',
    subtitle: 'Thi đấu Chủ nhật này — giải thưởng đến 5 triệu', ctaLabel: 'Đăng ký ngay',
    gradient: grad.olive, emoji: '🏆' },
  // Gym
  { id: 'gy-promo1', tab: 'gym', badge: 'MỚI', title: 'Gói gym 3 tháng chỉ 1.499K',
    subtitle: 'Tiết kiệm 300K khi đăng ký tại CityGym Q7', ctaLabel: 'Xem gói',
    gradient: grad.green, emoji: '🏋️' },
  { id: 'gy-promo2', tab: 'gym', badge: 'FREE', title: 'Buổi tập thử cùng PT miễn phí',
    subtitle: 'Đặt lịch với huấn luyện viên cá nhân tuần đầu', ctaLabel: 'Đặt lịch',
    gradient: grad.dark, emoji: '💪' },
  // Chung (hiện ở mọi tab)
  { id: 'all-promo1', tab: 'all', badge: 'FREE', title: 'Rủ bạn — tặng 1 buổi chơi',
    subtitle: 'Mời bạn mới, cả hai nhận voucher 50K', ctaLabel: 'Mời bạn',
    gradient: grad.olive, emoji: '🎁' },
];

/** Lọc quảng cáo theo bộ môn: 'all' xem tất cả; tab cụ thể = promo bộ môn đó + promo chung. */
export function filterPromos(tab: FilterTab): Promo[] {
  if (tab === 'all') return promos;
  return promos.filter(p => p.tab === tab || p.tab === 'all');
}

export const venues: Venue[] = [
  { id: 'pk1', name: 'Pickleball Center Q7', sport: 'pickle', gradient: grad.dark,
    district: 'Nhà Bè', distanceKm: 1.2, rating: 4.9, reviews: 326, priceLabel: '80K/giờ', heroTag: 'CÒN 4 SÂN TRỐNG',
    pricePerHour: 80000, courts: 6, openTime: '5:00',
    amenities: ['🚿 Phòng tắm', '🅿️ Bãi xe', '💧 Nước', '🏸 Cho thuê vợt', '❄️ Điều hòa'],
    about: 'Cụm sân pickleball tiêu chuẩn thi đấu, mặt sân cao su giảm chấn, đèn LED ban đêm. Đặt nhanh theo khung giờ trống.' },
  { id: 'pk2', name: 'Smash Arena', sport: 'pickle', gradient: grad.olive,
    district: 'Quận 7', distanceKm: 2.4, rating: 4.7, reviews: 158, priceLabel: '90K/giờ',
    pricePerHour: 90000, courts: 4, openTime: '6:00',
    amenities: ['🚿 Phòng tắm', '🅿️ Bãi xe', '💧 Nước', '❄️ Điều hòa'],
    about: 'Sân trong nhà mát mẻ, phù hợp chơi buổi trưa. Có khu chờ và căng tin nhỏ.' },
  { id: 'gy1', name: 'CityGym Fitness Q7', sport: 'gym', gradient: grad.green,
    district: 'Quận 7', distanceKm: 0.9, rating: 4.8, reviews: 512, priceLabel: '599K/tháng', heroTag: 'GÓI THÁNG 599K' },
  { id: 'gy2', name: 'Flex Zone Gym', sport: 'gym', gradient: grad.olive,
    district: 'Quận 4', distanceKm: 3.1, rating: 4.6, reviews: 203, priceLabel: '499K/tháng' },
];

const byId = (id: string) => venues.find(v => v.id === id)!;
export const getVenue = (id: string): Venue | undefined => venues.find(v => v.id === id);

export function pickHero(tab: FilterTab): Venue {
  if (tab === 'gym') return byId('gy1');
  return byId('pk1');
}
export function filterVenues(tab: FilterTab): Venue[] {
  if (tab === 'pickle') return [byId('pk1'), byId('pk2')];
  if (tab === 'gym') return [byId('gy1'), byId('gy2')];
  return [byId('gy1'), byId('pk2')];
}
export function listTitle(tab: FilterTab): string {
  return tab === 'gym' ? 'Phòng gym gần bạn' : 'Sân gần bạn';
}

export const days: DayItem[] = [
  { key: 'd0', dow: 'T2', day: 11 }, { key: 'd1', dow: 'T3', day: 12 },
  { key: 'd2', dow: 'T4', day: 13 }, { key: 'd3', dow: 'T5', day: 14 },
  { key: 'd4', dow: 'T6', day: 15 }, { key: 'd5', dow: 'T7', day: 16 },
  { key: 'd6', dow: 'CN', day: 17 },
];

const RAW = ['06:00', '07:00', '08:00', '09:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
const BOOKED = new Set([1, 3, 7]);
export const slots: Slot[] = RAW.map((time, i) => ({ id: 's' + i, time, state: BOOKED.has(i) ? 'booked' : 'free' }));

// ---- Bookings ----
export const bookings: Booking[] = [
  { id: 'bk1', code: 'PB7X29', sport: 'pickle', venueName: 'Pickleball Center Q7 · Sân 3',
    date: 'CN, 27/07', time: '18:00–19:00', priceLabel: '80.000₫', status: 'upcoming' },
  { id: 'bk2', code: 'GY4410', sport: 'gym', venueName: 'Yoga Flow · CityGym Q7',
    date: 'CN, 27/07', time: '18:00–19:00', coach: 'Trâm', status: 'upcoming' },
  { id: 'bk3', code: 'PB5501', sport: 'pickle', venueName: 'Smash Arena · Sân 1',
    date: 'T5, 24/07', time: '19:00–20:00', priceLabel: '90.000₫', status: 'past' },
];

// ---- Gym ----
export const membership: Membership = {
  brand: 'CITYGYM', plan: 'GÓI THÁNG', memberName: 'Minh Khang', memberCode: 'MK-2026-0714',
  daysLeft: 18, expiry: '14/08/2026', active: true,
  packageType: 'Không giới hạn · 1 tháng', checkinsThisMonth: 12, branch: 'CityGym Q7',
};

// Lịch chủ sân (dữ liệu chủ sân cấu hình) — nguồn suy ra "giờ đặt" ở màn thanh toán
const gymSchedule: CourtSchedule = {
  date: 'Hôm nay', openTime: '06:00', closeTime: '22:00', sessionMinutes: 60,
  slots: [
    { id: 'g0', time: '06:00', state: 'booked' },
    { id: 'g1', time: '07:00', state: 'booked' },
    { id: 'g2', time: '18:00', state: 'free' },
    { id: 'g3', time: '19:00', state: 'free' },
    { id: 'g4', time: '20:00', state: 'free' },
  ],
};

const clubSchedule: CourtSchedule = {
  date: 'Hôm nay', openTime: '17:00', closeTime: '21:00', sessionMinutes: 60,
  slots: [
    { id: 'c0', time: '17:00', state: 'booked' },
    { id: 'c1', time: '18:00', state: 'free' },
    { id: 'c2', time: '19:00', state: 'free' },
    { id: 'c3', time: '20:00', state: 'booked' },
  ],
};

// Vé ngày cá nhân
export const dayPass: DayPass = {
  brand: 'CITYGYM', memberName: 'Minh Khang', passCode: 'DP-2026-0831',
  priceLabel: '60.000₫', validDate: '31/08/2026', branch: 'CityGym Q7', entriesLeft: 1,
  venue: 'CityGym Q7', address: '123 Nguyễn Thị Thập, Quận 7, TP.HCM',
  schedule: gymSchedule,
};

// Vé sinh hoạt câu lạc bộ
export const clubPass: DayPass = {
  brand: 'Q7 SMASHERS', memberName: 'Minh Khang', passCode: 'CLB-2026-0831',
  priceLabel: '40.000₫', validDate: '31/08/2026', branch: 'Sân Q7 · buổi 18:00', entriesLeft: 1,
  venue: 'Pickleball Center Q7 · Sân 3', address: 'Khu Him Lam, Quận 7, TP.HCM',
  schedule: clubSchedule,
};

export const gymClasses: GymClass[] = [
  { id: 'gc1', time: '18:00', name: 'Yoga Flow', coach: 'HLV Trâm', durationMin: 60, slotsLeft: 4, highlighted: true },
  { id: 'gc2', time: '19:30', name: 'HIIT Burn', coach: 'HLV Long', durationMin: 45, slotsLeft: 2 },
];

// ---- Club ----
export const myClubs: Club[] = [
  { id: 'cl1', name: 'Q7 Smashers 🏓', gradient: grad.dark, members: 48, note: 'buổi tiếp: T7 18:00', joined: true },
  { id: 'cl2', name: 'Sáng Sớm Gym 🏋️', gradient: grad.green, members: 32, note: '5:30 mỗi sáng', joined: true },
];
export const discoverClubs: Club[] = [
  { id: 'cl3', name: 'Nhà Bè Pickleball', gradient: grad.green, members: 120, note: 'gần bạn 1.2km' },
  { id: 'cl4', name: 'Gym Buddies Q7', gradient: grad.olive, members: 86, note: 'tập nhóm buổi tối' },
];
export const matches: Match[] = [
  { id: 'm1', title: 'Cần 2 người · Đôi nam nữ', venue: 'Pickleball Center Q7 · Hôm nay 18:00',
    gradient: grad.volt, level: 'Trung cấp', joined: 2, capacity: 4, note: 'chia sân 20K/người' },
  { id: 'm2', title: 'Giao lưu tối T5', venue: 'Smash Arena · 20:00 · vui là chính',
    gradient: grad.olive, level: 'Mọi trình độ', joined: 6, capacity: 8 },
];

// ---- Profile ----
export const profileStats: ProfileStat[] = [
  { value: '42', label: 'Buổi chơi' },
  { value: '18', label: 'Ngày gói gym' },
  { value: '4.9', label: 'Điểm uy tín' },
];
export const profileMenu: MenuItem[] = [
  { key: 'pay', icon: '💳', label: 'Phương thức thanh toán' },
  { key: 'promo', icon: '🎟️', label: 'Ưu đãi & mã giảm giá' },
  { key: 'history', icon: '🏆', label: 'Lịch sử hoạt động' },
  { key: 'noti', icon: '🔔', label: 'Thông báo' },
  { key: 'settings', icon: '⚙️', label: 'Cài đặt' },
  { key: 'help', icon: '❓', label: 'Trợ giúp & hỗ trợ' },
];
