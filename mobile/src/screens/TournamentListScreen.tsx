import { useMemo, useState } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { FilterChipGroup, ChipOption } from '../components/chips/FilterChipGroup';
import { TournamentCard } from '../components/cards/TournamentCard';
import { tournaments } from '../data/tournaments';
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

// Màn "xem tất cả" giải đấu: toàn bộ danh sách + lọc theo bộ môn.
export default function TournamentListScreen() {
  const nav = useNavigation<Nav>();
  const [sport, setSport] = useState<FilterTab>('all');
  const hits = useMemo(() => tournaments.filter(t => sport === 'all' || t.sport === sport), [sport]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <FilterChipGroup value={sport} options={SPORTS} onChange={setSport} />
        <Text style={styles.sub}>{hits.length} giải đấu</Text>
        {hits.map(t => (
          <TournamentCard key={t.id} tournament={t} onRegister={() => nav.navigate('TournamentRegister', { id: t.id })} />
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sub: { ...font.sub, color: color.textMuted, marginTop: 4, marginBottom: 12 },
});
