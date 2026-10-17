import type { Sport } from '../types';

// Thành tích thi đấu của người dùng tại các giải (mock).
// rank: 1 = vô địch, 2 = á quân, 3 = hạng ba, 0 = tham dự.
export type AchievementRank = 0 | 1 | 2 | 3;

export interface Achievement {
  id: string;
  tournament: string;
  sport: Sport;
  date: string;          // "T9/2026"
  rank: AchievementRank;
  note?: string;         // "Đôi nam" | "Đồng đội" | ...
}

export const achievements: Achievement[] = [
  { id: 'a1', tournament: 'Giải đôi Pickleball mở rộng', sport: 'pickle', date: 'T9/2026', rank: 1, note: 'Đôi nam' },
  { id: 'a2', tournament: 'Giải phủi Quận 7 2026', sport: 'football', date: 'T7/2026', rank: 2, note: 'Sân 7' },
  { id: 'a3', tournament: 'Cup giao hữu CLB', sport: 'pickle', date: 'T5/2026', rank: 3, note: 'Đồng đội' },
  { id: 'a4', tournament: 'Pickleball Center Q7 Open', sport: 'pickle', date: 'T3/2026', rank: 0, note: 'Vòng bảng' },
];
