import { grad } from '../theme/tokens';
import type { Sport } from '../types';

// Giai thi dau cua CLB (thay cho "Tim ban choi").
export type TournamentStatus = 'open' | 'ongoing' | 'closed';
export interface Tournament {
  id: string;
  name: string;
  sport: Sport;
  venue: string;
  date: string;
  format: string;       // "San 7 · 8 doi"
  teams: number;        // da dang ky
  capacity: number;     // toi da
  feeLabel: string;     // "300K/doi"
  prize?: string;       // "5 trieu"
  gradient: readonly [string, string];
  status: TournamentStatus;
}

export const tournaments: Tournament[] = [
  { id: 'tn1', name: 'Giải phủi Quận 7 2026', sport: 'football', venue: 'Sân bóng Thành Đạt',
    date: 'T7–CN, 18–19/10', format: 'Sân 7 · 8 đội', teams: 5, capacity: 8, feeLabel: '300K/đội',
    prize: '5 triệu', gradient: grad.green, status: 'open' },
  { id: 'tn2', name: 'Giải đôi Pickleball mở rộng', sport: 'pickle', venue: 'Pickleball Center Q7',
    date: 'CN, 20/10', format: 'Đôi nam nữ · 16 cặp', teams: 11, capacity: 16, feeLabel: '150K/cặp',
    prize: '3 triệu', gradient: grad.dark, status: 'open' },
  { id: 'tn3', name: 'Cup giao hữu CLB', sport: 'pickle', venue: 'Smash Arena',
    date: 'Đang diễn ra', format: 'Vòng tròn · 6 đội', teams: 6, capacity: 6, feeLabel: '200K/đội',
    gradient: grad.olive, status: 'ongoing' },
];

export const getTournament = (id: string): Tournament | undefined =>
  tournaments.find(t => t.id === id);
