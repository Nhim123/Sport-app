import { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { color, font, space } from '../theme/tokens';
import { RootStackParamList } from '../navigation/types';
import { getVenue, slots, days, myClubs } from '../data/mock';
import { addMinutes } from '../utils/format';
import { useBookingSelection } from '../hooks/useBookingSelection';
import { SegmentedTabs } from '../components/chips/SegmentedTabs';
import { DayPicker } from '../components/booking/DayPicker';
import { SlotGrid } from '../components/booking/SlotGrid';
import { CourtPicker } from '../components/booking/CourtPicker';
import { BottomBar } from '../components/booking/BottomBar';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Booking'>;
type BookFor = 'personal' | 'club';

export default function BookingScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'Booking'>>();
  const venue = getVenue(params.venueId);
  const b = useBookingSelection(slots, days, venue?.pricePerHour ?? 80000);

  const [bookFor, setBookFor] = useState<BookFor>('personal');
  // Đặt thay cho CLB: ưu tiên CLB cùng bộ môn với sân, nếu không có thì lấy CLB đầu tiên của tôi.
  const myClub = useMemo(
    () => myClubs.find(c => venue != null && c.sports.includes(venue.sport)) ?? myClubs[0],
    [venue?.sport],
  );
  const forLabel = bookFor === 'club' ? (myClub?.name ?? 'CLB') : 'Cá nhân';
  const summary = b.summary ? `${b.summary} · ${forLabel}` : undefined;

  const goPay = () => {
    const slot = slots.find(s => s.id === b.slotId);
    const day = days.find(d => d.key === b.dayKey);
    if (!venue || !slot || !day || b.court == null) return;
    nav.navigate('DayPassPayment', {
      order: {
        purpose: 'court',
        title: 'Đặt sân ' + venue.name,
        brand: venue.name,
        itemLabel: 'Sân',
        itemValue: 'Sân ' + b.court + ' · ' + forLabel,
        date: day.dow + ', ' + day.day,
        priceLabel: b.priceLabel,
        code: 'PB' + Math.random().toString(36).slice(2, 7).toUpperCase(),
        fixedTime: slot.time + '–' + addMinutes(slot.time, 60),
      },
    });
  };

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: space.xl, paddingBottom: 24 }}>
        <Text style={styles.section}>Đặt sân cho</Text>
        <SegmentedTabs
          value={bookFor}
          options={[{ key: 'personal', label: 'Cá nhân' }, { key: 'club', label: 'Câu lạc bộ' }]}
          onChange={setBookFor}
        />
        {bookFor === 'club' && (
          <Text style={styles.forNote}>Đặt thay cho CLB: {myClub?.name ?? '—'}</Text>
        )}

        <Text style={styles.section}>Chọn ngày</Text>
        <DayPicker days={days} value={b.dayKey} onChange={b.setDayKey} />

        <Text style={styles.section}>Chọn giờ</Text>
        <SlotGrid slots={slots} selectedId={b.slotId} onSelect={b.selectSlot} />

        <Text style={styles.section}>Chọn sân</Text>
        <CourtPicker count={venue?.courts ?? 6} value={b.court} onChange={b.setCourt} />
      </ScrollView>

      <BottomBar
        summary={summary}
        priceLabel={b.priceLabel}
        ctaLabel="Thanh toán qua QR"
        ctaDisabled={!b.canPay}
        onPress={goPay}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  section: { ...font.section, color: color.ink, marginTop: 20, marginBottom: 12 },
  forNote: { ...font.sub, color: color.textMuted, marginTop: 10, fontWeight: '600' },
});
