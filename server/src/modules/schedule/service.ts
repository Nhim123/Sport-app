import { WeekEventModel } from './model.js';

// Lich tuan cua toi (docs: GET /me/schedule). Tham so week de loc theo tuan sau nay.
export async function mySchedule(userId: string, _week?: string) {
  const items = await WeekEventModel.find({ userId }).sort({ dayKey: 1 }).lean();
  return { items };
}
