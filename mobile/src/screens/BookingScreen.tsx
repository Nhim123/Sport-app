import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { color, font, space } from '../theme/tokens';
import { RootStackParamList } from '../navigation/types';
import { getVenue, slots, days } from '../data/mock';
import { addMinutes } from '../utils/format';
import { useBookingSelection } from '../hooks/useBookingSelection';
import { DayPicker } from '../components/booking/DayPicker';
import { SlotGrid } from '../components/booking/SlotGrid';
import { CourtPicker } from '../components/booking/CourtPicker';
import { BottomBar } from '../components/booking/BottomBar';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Booking'>;

export default function BookingScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'Booking'>>();
  const venue = getVenue(params.venueId);
  const b = useBookingSelection(slots, days, venue?.pricePerHour ?? 80000);

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
        itemValue: 'Sân ' + b.court,
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
        <Text style={styles.section}>Chọn ngày</Text>
        <DayPicker days={days} value={b.dayKey} onChange={b.setDayKey} />

        <Text style={styles.section}>Chọn giờ</Text>
        <SlotGrid slots={slots} selectedId={b.slotId} onSelect={b.selectSlot} />

        <Text style={styles.section}>Chọn sân</Text>
        <CourtPicker count={venue?.courts ?? 6} value={b.court} onChange={b.setCourt} />
      </ScrollView>

      <BottomBar
        summary={b.summary}
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
});
