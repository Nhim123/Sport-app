import { useCallback, useMemo, useState } from 'react';
import { Slot, DayItem } from '../types';
import { formatVnd } from '../utils/format';

export function useBookingSelection(slots: Slot[], days: DayItem[], pricePerHour: number) {
  const [dayKey, setDayKey] = useState<string>(days[0]?.key ?? '');
  const [slotId, setSlotId] = useState<string | null>(null);
  const [court, setCourt] = useState<number | null>(null);

  const selectSlot = useCallback((id: string) => {
    const s = slots.find(x => x.id === id);
    if (!s || s.state === 'booked') return;
    setSlotId(prev => (prev === id ? null : id));
  }, [slots]);

  const canPay = slotId !== null && court !== null;
  const priceLabel = formatVnd(pricePerHour);
  const summary = useMemo(() => {
    if (!canPay) return undefined;
    const d = days.find(x => x.key === dayKey);
    const t = slots.find(x => x.id === slotId)?.time;
    return 'Sân ' + court + ' - ' + t + ', ' + d?.dow + ' ' + d?.day;
  }, [canPay, days, dayKey, slots, slotId, court]);

  return { dayKey, setDayKey, slotId, selectSlot, court, setCourt, canPay, priceLabel, summary };
}
