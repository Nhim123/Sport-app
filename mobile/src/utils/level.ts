import { achievements } from '../data/achievements';
import type { Sport } from '../types';

// Điểm theo thứ hạng tại giải: vô địch 4, á quân 3, hạng ba 2, tham dự 1.
const RANK_POINTS: Record<number, number> = { 1: 4, 2: 3, 3: 2, 0: 1 };

// Bậc trình độ theo tổng điểm tích luỹ của một bộ môn.
const TIERS = [
  { min: 0, label: 'Chưa xếp hạng' },
  { min: 1, label: 'Người mới' },
  { min: 4, label: 'Trung cấp' },
  { min: 8, label: 'Khá' },
  { min: 13, label: 'Chuyên nghiệp' },
];
export const MAX_TIER = TIERS.length - 1;

const SPORT_ORDER: Sport[] = ['pickle', 'football', 'gym'];

export interface SportLevel {
  sport: Sport;
  points: number;
  tierIndex: number;           // 0..MAX_TIER
  tier: string;
  gold: number; silver: number; bronze: number;
  next?: { tier: string; remaining: number };   // điểm còn thiếu để lên bậc kế
}

export function sportLevel(sport: Sport): SportLevel {
  const items = achievements.filter(a => a.sport === sport);
  const points = items.reduce((s, a) => s + (RANK_POINTS[a.rank] ?? 0), 0);
  let ti = 0;
  for (let i = 0; i < TIERS.length; i++) if (points >= TIERS[i].min) ti = i;
  const next = TIERS[ti + 1];
  return {
    sport,
    points,
    tierIndex: ti,
    tier: TIERS[ti].label,
    gold: items.filter(a => a.rank === 1).length,
    silver: items.filter(a => a.rank === 2).length,
    bronze: items.filter(a => a.rank === 3).length,
    next: next ? { tier: next.label, remaining: Math.max(0, next.min - points) } : undefined,
  };
}

// Các bộ môn người dùng đã tham gia thi đấu (có thành tích).
export function playedSports(): Sport[] {
  return SPORT_ORDER.filter(sp => achievements.some(a => a.sport === sp));
}
