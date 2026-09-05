export type Sport = 'pickle' | 'gym' | 'football';
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

// Lịch chủ sân cấu hình (khung mở + các khung giờ) — nguồn của "giờ đặt"
export interface CourtSchedule {
  date: string;            // "Hôm nay" | "31/08/2026"
  openTime: string;        // "06:00"
  closeTime: string;       // "22:00"
  sessionMinutes: number;  // độ dài 1 lượt (vd 60)
  slots: Slot[];           // khung giờ chủ sân mở (free/booked)
}

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
  schedule: CourtSchedule;    // lịch chủ sân → suy ra giờ đặt (động)
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
export type ClubViewerRole = 'owner' | 'member';   // vai trò của mình trong CLB: chủ hội | hội viên

export interface Club {
  id: string;
  name: string;               // "Q7 Smashers 🏓"
  gradient: readonly [string, string];
  members: number;
  note: string;               // "buổi tiếp: T7 18:00" | "gần bạn 1.2km"
  joined?: boolean;
  myRole?: ClubViewerRole;    // chỉ có khi đã tham gia
}

// ---- Chức năng chi tiết CLB ----
export type ClubTab = 'fund' | 'members' | 'programs';

export interface ClubFundTx {
  id: string; label: string; amount: number; kind: 'in' | 'out'; date: string;
}
export interface ClubFund { balance: number; income: number; expense: number; txs: ClubFundTx[] }

export type ClubRole = 'Chủ nhiệm' | 'Quản lý' | 'Thành viên';
export interface ClubMember { id: string; name: string; initials: string; role: ClubRole; note?: string }

export interface ClubProgram {
  id: string; title: string; date: string; time: string; place: string;
  joined: number; capacity: number; fee?: string;
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

// ---- Thanh toán chung (mọi tính năng dồn về 1 màn) ----
export type PaymentPurpose = 'court' | 'daypass' | 'club';
/**
 * Đơn hàng gửi vào màn thanh toán chung. Nút ở mỗi tính năng tự dựng order rồi
 * điều hướng tới `DayPassPayment`. `fixedTime` = giờ đã chọn sẵn (đặt sân);
 * `schedule` = để chọn giờ ngay trên màn thanh toán (vé ngày/CLB).
 */
export interface PaymentOrder {
  purpose: PaymentPurpose;
  title: string;                           // "Đặt sân Pickleball Center Q7" | "Vé ngày cá nhân"
  brand: string;                           // đơn vị cung cấp — hiện ở biên nhận
  itemLabel: string;                       // "Sân" | "Cơ sở"
  itemValue: string;                       // "Sân 3" | "CityGym Q7"
  address?: string;
  date: string;                            // "Hôm nay" | "CN, 27"
  priceLabel: string;                      // "80.000₫"
  code: string;                            // mã đơn/vé — hiện ở biên nhận
  fixedTime?: string;                      // "18:00–19:00" khi đã chọn giờ trước
  schedule?: CourtSchedule;                // nguồn khung giờ khi chọn tại màn thanh toán
  passKind?: DayPassKind;                  // có = kích hoạt vé khi thanh toán xong
}
