import { useMemo, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { SearchBar } from '../components/home/SearchBar';
import { QrScanModal } from '../components/QrScanModal';
import { FilterChipGroup, ChipOption } from '../components/chips/FilterChipGroup';
import { VenueCard } from '../components/cards/VenueCard';
import { ClubRow } from '../components/cards/ClubRow';
import { venues, discoverClubs } from '../data/mock';
import { usePasses } from '../state/PassContext';
import { RootStackParamList } from '../navigation/types';
import { FilterTab, Venue, Club } from '../types';
import { color, font, space } from '../theme/tokens';

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
  const [sport, setSport] = useState<FilterTab>('all');
  const [query, setQuery] = useState('');
  const [scanOpen, setScanOpen] = useState(false);

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

  const openVenue = (v: Venue) => {
    if (v.sport === 'gym') nav.navigate('Gym');
    else nav.navigate('VenueDetail', { id: v.id, name: v.name });
  };

  const joinClubAndOpen = (c: Club) => {
    joinClub();
    nav.navigate('ClubDetail', { id: c.id, name: c.name });
  };

  // Giả lập quét QR: nhận diện CLB đầu tiên rồi mở chi tiết (mock, chưa gắn camera thật).
  const onScan = () => {
    setScanOpen(false);
    joinClubAndOpen(discoverClubs[0]);
  };

  const nothing = venueHits.length === 0 && clubHits.length === 0;

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
          placeholder="Tìm sân, phòng gym, câu lạc bộ…"
          onScanQr={() => setScanOpen(true)}
        />
        <FilterChipGroup value={sport} options={SPORTS} onChange={setSport} />

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
  empty: { alignItems: 'center', gap: 10, paddingVertical: 48 },
  emptyTxt: { ...font.body, color: color.textMuted, textAlign: 'center' },
});
