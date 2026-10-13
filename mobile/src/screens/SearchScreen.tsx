import { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { SearchBar } from '../components/home/SearchBar';
import { QrScanModal } from '../components/QrScanModal';
import { FilterChipGroup, ChipOption } from '../components/chips/FilterChipGroup';
import { VenueCard } from '../components/cards/VenueCard';
import { ClubRow } from '../components/cards/ClubRow';
import { TournamentCard } from '../components/cards/TournamentCard';
import { venues, discoverClubs } from '../data/mock';
import { tournaments } from '../data/tournaments';
import { usePasses } from '../state/PassContext';
import { useClubRequests } from '../state/ClubRequestContext';
import { RootStackParamList } from '../navigation/types';
import { FilterTab, Venue, Club } from '../types';
import { color, font, radius, space } from '../theme/tokens';
import * as Location from 'expo-location';
import { VenueMap, MapPoint } from '../components/map/VenueMap';
import { offsetCoord, angleFromId, DEFAULT_CENTER } from '../utils/geo';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// Bộ môn: lọc đồng thời cả sân bãi lẫn câu lạc bộ theo môn đang chọn.
const SPORTS: ChipOption<FilterTab>[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pickle', label: '🏓 Pickleball' },
  { key: 'football', label: '⚽ Bóng đá' },
  { key: 'gym', label: '🏋️ Gym' },
];

export default function SearchScreen() {
  const nav = useNavigation<Nav>();
  const { joinClub } = usePasses();
  const { requestJoin } = useClubRequests();
  const [sport, setSport] = useState<FilterTab>('all');
  const [query, setQuery] = useState('');
  const [scanOpen, setScanOpen] = useState(false);
  const [mode, setMode] = useState<'list' | 'map'>('list');
  const [center, setCenter] = useState(DEFAULT_CENTER);

  // Lấy vị trí hiện tại để đặt tâm bản đồ (không được cấp quyền → dùng vị trí mặc định).
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

  const q = query.trim().toLowerCase();

  const venueHits = useMemo(
    () => venues
      .filter(v => sport === 'all' || v.sport === sport)
      .filter(v => !q || v.name.toLowerCase().includes(q) || v.district?.toLowerCase().includes(q)),
    [sport, q],
  );
  const clubHits = useMemo(
    () => discoverClubs
      .filter(c => sport === 'all' || c.sports.includes(sport))
      .filter(c => !q || c.name.toLowerCase().includes(q) || c.note?.toLowerCase().includes(q)),
    [sport, q],
  );
  const tournamentHits = useMemo(
    () => tournaments
      .filter(t => sport === 'all' || t.sport === sport)
      .filter(t => !q || t.name.toLowerCase().includes(q) || t.venue.toLowerCase().includes(q)),
    [sport, q],
  );
  // Rải sân khớp bộ lọc thành marker quanh vị trí người dùng.
  const mapPoints: MapPoint[] = useMemo(
    () => venueHits.map(v => {
      const pos = offsetCoord(center.lat, center.lng, v.distanceKm, angleFromId(v.id));
      return { id: v.id, name: v.name, lat: pos.lat, lng: pos.lng, priceLabel: v.priceLabel };
    }),
    [venueHits, center],
  );

  const openVenue = (v: Venue) => {
    if (v.sport === 'gym') nav.navigate('Gym');
    else nav.navigate('VenueDetail', { id: v.id, name: v.name });
  };
  const openVenueById = (id: string) => {
    const v = venues.find(x => x.id === id);
    if (v) openVenue(v);
  };

  const joinClubAndOpen = (c: Club) => {
    if (c.privacy === 'approval') {
      requestJoin(c.id);
      nav.navigate('ClubPending', { id: c.id, name: c.name });
      return;
    }
    joinClub();
    nav.navigate('ClubDetail', { id: c.id, name: c.name });
  };

  // Giả lập quét QR: nhận diện CLB đầu tiên rồi mở chi tiết (mock, chưa gắn camera thật).
  const onScan = () => {
    setScanOpen(false);
    joinClubAndOpen(discoverClubs[0]);
  };

  const nothing = venueHits.length === 0 && clubHits.length === 0 && tournamentHits.length === 0;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Tìm kiếm</Text>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Tìm sân, câu lạc bộ, giải đấu…"
          onScanQr={() => setScanOpen(true)}
        />
        <FilterChipGroup value={sport} options={SPORTS} onChange={setSport} />

        <View style={styles.viewToggle}>
          <Pressable style={[styles.toggleBtn, mode === 'list' && styles.toggleBtnOn]} onPress={() => setMode('list')} accessibilityRole="button">
            <Ionicons name="list" size={16} color={mode === 'list' ? color.ink : color.textMuted} />
            <Text style={[styles.toggleTxt, mode === 'list' && styles.toggleTxtOn]}>Danh sách</Text>
          </Pressable>
          <Pressable style={[styles.toggleBtn, mode === 'map' && styles.toggleBtnOn]} onPress={() => setMode('map')} accessibilityRole="button">
            <Ionicons name="map-outline" size={16} color={mode === 'map' ? color.ink : color.textMuted} />
            <Text style={[styles.toggleTxt, mode === 'map' && styles.toggleTxtOn]}>Bản đồ</Text>
          </Pressable>
        </View>

        {mode === 'map' ? (
          venueHits.length > 0 ? (
            <>
              <VenueMap center={center} points={mapPoints} onSelect={openVenueById} />
              <Text style={styles.mapHint}>{venueHits.length} sân gần bạn · chạm marker để xem chi tiết</Text>
            </>
          ) : (
            <Text style={styles.none}>Không có sân gần đây để hiển thị trên bản đồ.</Text>
          )
        ) : null}

        {nothing ? (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={26} color={color.textMuted} />
            <Text style={styles.emptyTxt}>Không tìm thấy kết quả{q ? ` cho “${query.trim()}”` : ''}.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.section}>Sân bãi</Text>
            {venueHits.length > 0
              ? venueHits.map(v => <VenueCard key={v.id} venue={v} onPress={openVenue} />)
              : <Text style={styles.none}>Chưa có sân bãi phù hợp.</Text>}

            <Text style={styles.section}>Câu lạc bộ</Text>
            {clubHits.length > 0
              ? clubHits.map(c => <ClubRow key={c.id} club={c} onJoin={() => joinClubAndOpen(c)} />)
              : <Text style={styles.none}>Chưa có câu lạc bộ phù hợp.</Text>}

            <Text style={styles.section}>Giải đấu</Text>
            {tournamentHits.length > 0
              ? tournamentHits.map(t => <TournamentCard key={t.id} tournament={t} onRegister={() => nav.navigate('TournamentRegister', { id: t.id })} />)
              : <Text style={styles.none}>Chưa có giải đấu phù hợp.</Text>}
          </>
        )}
      </ScrollView>

      <QrScanModal
        visible={scanOpen}
        onClose={() => setScanOpen(false)}
        onScan={onScan}
        title="Quét mã QR CLB"
        hint="Đưa mã QR của CLB vào khung để tham gia."
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...font.h1, color: color.ink, marginTop: 8 },
  section: { ...font.section, color: color.ink, marginTop: 22, marginBottom: 12 },
  none: { ...font.sub, color: color.textFaint, marginBottom: 8 },
  viewToggle: { flexDirection: 'row', gap: 8, marginTop: 4 },
  toggleBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 14, borderRadius: radius.chip, backgroundColor: color.surface, borderWidth: 1, borderColor: color.line },
  toggleBtnOn: { backgroundColor: color.volt, borderColor: color.voltDark },
  toggleTxt: { ...font.sub, color: color.textMuted, fontWeight: '700' },
  toggleTxtOn: { color: color.ink },
  mapHint: { ...font.sub, color: color.textMuted, marginTop: 8, marginBottom: 4 },
  empty: { alignItems: 'center', gap: 10, paddingVertical: 48 },
  emptyTxt: { ...font.body, color: color.textMuted, textAlign: 'center' },
});
