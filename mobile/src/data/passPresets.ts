import { grad } from '../theme/tokens';
import { DayPass, DayPassKind } from '../types';
import { dayPass, clubPass } from './mock';

export const CLUB_BENEFITS = [
  'Tham gia 1 buổi sinh hoạt CLB',
  'Chơi cùng thành viên câu lạc bộ',
  'Bao gồm sân & trang thiết bị buổi tập',
];

/** Props bổ sung cho DayPassCard khi hiển thị vé câu lạc bộ (dùng chung Gym + trang đặt vé). */
export const CLUB_CARD_PROPS = {
  gradient: grad.dark,
  brandSuffix: 'VÉ CLB',
  title: 'Vé sinh hoạt câu lạc bộ',
  benefits: CLUB_BENEFITS,
  qrNoun: 'tham gia',
  ctaLabel: 'Đặt vé CLB',
  priceUnit: 'buổi',
} as const;

export const passOf = (kind: DayPassKind): DayPass => (kind === 'club' ? clubPass : dayPass);
export const passLabel = (kind: DayPassKind) => (kind === 'club' ? 'Vé câu lạc bộ' : 'Vé ngày cá nhân');
