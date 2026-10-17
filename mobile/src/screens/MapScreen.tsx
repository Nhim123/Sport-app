import { useEffect, useMemo, useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { Screen } from '../components/Screen';
import { FilterChipGroup, ChipOption } from '../components/chips/FilterChipGroup';
import { VenueMap, MapPoint } from '../components/map/VenueMap';
import { venues } from '../data/mock';
import { offsetCoord, angleFromId, DEFAULT_CENTER } from '../utils/geo';
import { RootStackParamList } from '../navigation/types';
import { FilterTab } from '../types';
import { color, font, space } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SPORTS: ChipOption<FilterTab>[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pickle', label: '🏓 Pickleball' },
  { key: 'football', label: '⚽ Bóng đá' },
  { key: 'gym', label: '🏋️ Gym' },
];
const MAP_H = Math.max(360, Dimensions.get('window').height - 300);

/** Màn Bản đồ (tab riêng): sân gần bạn trên bản đồ, lọc theo bộ môn, chạm marker → chi tiết. */
export default function MapScreen() {
  const nav = useNavigation<Nav>();
  const [sport, setSport] = useState<FilterTab>('all');
  const [center, setCenter] = useState(DEFAULT_CENTER);

  // Lấy vị trí hiện tại làm tâm bản đồ (không cấp quyền → dùng vị trí mặc định).
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      } catch {
        // giữ vị trí mặc định
      }
    })();
  }, []);

  const venueHits = useMemo(() => venues.filter(v => sport === 'all' || v.sport === sport), [sport]);
  const points: MapPoint[] = useMemo(
    () => venueHits.map(v => {
      const pos = offsetCoord(center.lat, center.lng, v.distanceKm, angleFromId(v.id));
      return { id: v.id, name: v.name, lat: pos.lat, lng: pos.lng, priceLabel: v.priceLabel };
    }),
    [venueHits, center],
  );

  const openVenueById = (id: string) => {
    const v = venues.find(x => x.id === id);
    if (!v) return;
    if (v.sport === 'gym') nav.navigate('Gym');
    else nav.navigate('VenueDetail', { id: v.id, name: v.name });
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Bản đồ sân</Text>
        <FilterChipGroup value={sport} options={SPORTS} onChange={setSport} />
      </View>
      <View style={styles.body}>
        {venueHits.length > 0 ? (
          <>
            <VenueMap center={center} points={points} onSelect={openVenueById} height={MAP_H} />
            <Text style={styles.hint}>{venueHits.length} sân gần bạn · chạm marker để xem chi tiết</Text>
          </>
        ) : (
          <Text style={styles.none}>Không có sân phù hợp để hiển thị trên bản đồ.</Text>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: space.xl, paddingTop: 8 },
  title: { ...font.h1, color: color.ink, marginTop: 8 },
  body: { paddingHorizontal: space.xl },
  hint: { ...font.sub, color: color.textMuted, marginTop: 8 },
  none: { ...font.sub, color: color.textFaint, marginTop: 20, textAlign: 'center' },
});
