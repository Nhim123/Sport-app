import { useCallback, useMemo, useState } from 'react';
import { FlatList, View, Text, StyleSheet, ListRenderItemInfo } from 'react-native';
import { Screen } from '../components/Screen';
import { FilterChipGroup, ChipOption } from '../components/chips/FilterChipGroup';
import { BookingCard } from '../components/cards/BookingCard';
import { bookings } from '../data/mock';
import { Booking, BookingStatus } from '../types';
import { color, font, space } from '../theme/tokens';

const SEGMENTS: ChipOption<BookingStatus>[] = [
  { key: 'upcoming', label: 'Sắp tới' },
  { key: 'past', label: 'Đã qua' },
];

const noop = () => {};
const keyOf = (b: Booking) => b.id;

export default function BookingsScreen() {
  const [seg, setSeg] = useState<BookingStatus>('upcoming');
  const data = useMemo(() => bookings.filter(b => b.status === seg), [seg]);
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Booking>) => <BookingCard booking={item} onShowQR={noop} onCancel={noop} />,
    [],
  );

  return (
    <Screen>
      <FlatList
        data={data}
        keyExtractor={keyOf}
        contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Lịch đặt của tôi</Text>
            <FilterChipGroup value={seg} options={SEGMENTS} onChange={setSeg} />
            <View style={{ height: 18 }} />
          </View>
        }
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có lịch đặt nào.</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...font.h1, color: color.ink, marginTop: 8 },
  empty: { ...font.body, color: color.textMuted, textAlign: 'center', marginTop: 40 },
});
