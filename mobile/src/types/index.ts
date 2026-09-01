export type Sport = 'pickle' | 'gym';
export type FilterTab = 'all' | Sport;

export interface Venue {
  id: string;
  name: string;
  sport: Sport;
  gradient: readonly [string, string];
  district: string;
  distanceKm: number;
  rating: number;
  reviews: number;
  priceLabel: string;
  heroTag?: string;
  pricePerHour?: number;
  courts?: number;
  openTime?: string;
  amenities?: string[];
  about?: string;
}

export type SlotState = 'free' | 'booked';
export interface Slot { id: string; time: string; state: SlotState }
export interface DayItem { key: string; dow: string; day: number }

// ---- Bookings ----
export type BookingStatus = 'upcoming' | 'past';
export interface Booking {
  id: string;
  code: string;               // "PB7X29"
  sport: Sport;
  venueName: string;          // "Pickleball Center Q7 · Sân 3"
  date: string;               // "CN, 27/07"
  time: string;               // "18:00–19:00"
  priceLabel?: string;        // "80.000₫" (pickle) | undefined (lớp gym)
  coach?: string;             // "Trâm" (lớp gym)
  status: BookingStatus;
}

// ---- Gym / membership ----
export interface GymClass {
  id: string;
  time: string;               // "18:00"
  name: string;               // "Yoga Flow"
  coach: string;              // "HLV Trâm"
  durationMin: number;        // 60
  slotsLeft: number;          // 4
  highlighted?: boolean;      // ô giờ nền volt vs xám
}

export type GymMode = 'package' | 'daypass';        // thẻ hội viên: gói tập | vé ngày
export type DayPassStatus = 'booking' | 'active';   // vé ngày: đang đặt | đã hoàn tất đăng ký
export type DayPassKind = 'personal' | 'club';      // loại vé: cá nhân | câu lạc bộ

export interface DayPass {
  brand: string;              // "CITYGYM"
  memberName: string;         // "Minh Khang"
  passCode: string;           // "DP-2026-0831"
  priceLabel: string;         // "60.000₫"
  validDate: string;          // "31/08/2026" (hiệu lực trong ngày)
  branch: string;             // "CityGym Q7"
  entriesLeft: number;        // 1 lượt vào
  venue: string;              // tên sân/cơ sở — "CityGym Q7"
  address: string;            // địa chỉ cơ sở
  bookingTime: string;        // giờ đặt — "Hôm nay · 18:00–19:00"
}

export interface Membership {
  brand: string;              // "CITYGYM"
  plan: string;               // "GÓI THÁNG"
  memberName: string;         // "Minh Khang"
  memberCode: string;         // "MK-2026-0714"
  daysLeft: number;           // 18
  expiry: string;             // "14/08/2026"
  active: boolean;
  packageType: string;        // "Không giới hạn · 1 tháng"
  checkinsThisMonth: number;  // 12
  branch: string;             // "CityGym Q7"
}

// ---- Club ----
export type MatchLevel = 'Trung cấp' | 'Mọi trình độ' | 'Nâng cao';
export interface Club {
  id: string;
  name: string;               // "Q7 Smashers 🏓"
  gradient: readonly [string, string];
  members: number;
  note: string;               // "buổi tiếp: T7 18:00" | "gần bạn 1.2km"
  joined?: boolean;
}
export interface Match {
  id: string;
  title: string;              // "Cần 2 người · Đôi nam nữ"
  venue: string;              // "Pickleball Center Q7 · Hôm nay 18:00"
  gradient: readonly [string, string];
  level: MatchLevel;
  joined: number;             // 2
  capacity: number;           // 4
  note?: string;              // "chia sân 20K/người"
}

// ---- Profile ----
export interface MenuItem { key: string; icon: string; label: string }
export interface ProfileStat { value: string; label: string }

// ---- Promo (thanh quảng cáo Home) ----
export interface Promo {
  id: string;
  tab: FilterTab;                          // bộ môn áp dụng; 'all' = hiện ở mọi tab
  badge?: string;                          // "ƯU ĐÃI" | "MỚI" | "-30%"
  title: string;                           // "Giảm 30% khung giờ vàng"
  subtitle: string;                        // dòng mô tả ngắn
  ctaLabel: string;                        // "Nhận ưu đãi"
  gradient: readonly [string, string];     // nền banner
  emoji?: string;                          // trang trí góc phải
}
