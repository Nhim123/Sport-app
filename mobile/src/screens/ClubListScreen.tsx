import { useMemo, useState } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { FilterChipGroup, ChipOption } from '../components/chips/FilterChipGroup';
import { ClubRow } from '../components/cards/ClubRow';
import { discoverClubs } from '../data/mock';
import { usePasses } from '../state/PassContext';
import { useClubRequests } from '../state/ClubRequestContext';
import { RootStackParamList } from '../navigation/types';
import { FilterTab, Club } from '../types';
import { color, font, space } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SPORTS: ChipOption<FilterTab>[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pickle', label: '🏓 Pickleball' },
  { key: 'football', label: '⚽ Bóng đá' },
  { key: 'gym', label: '🏋️ Gym' },
];

// Màn "xem tất cả" câu lạc bộ: toàn bộ CLB khám phá + lọc theo bộ môn.
export default function ClubListScreen() {
  const nav = useNavigation<Nav>();
  const { joinClub } = usePasses();
  const { requestJoin } = useClubRequests();
  const [sport, setSport] = useState<FilterTab>('all');
  const hits = useMemo(() => discoverClubs.filter(c => sport === 'all' || c.sports.includes(sport)), [sport]);

  const joinClubAndOpen = (c: Club) => {
    if (c.privacy === 'approval') {
      requestJoin(c.id);
      nav.navigate('ClubPending', { id: c.id, name: c.name });
      return;
    }
    joinClub();
    nav.navigate('ClubDetail', { id: c.id, name: c.name });
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <FilterChipGroup value={sport} options={SPORTS} onChange={setSport} />
        <Text style={styles.sub}>{hits.length} câu lạc bộ</Text>
        {hits.map(c => <ClubRow key={c.id} club={c} onJoin={() => joinClubAndOpen(c)} />)}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sub: { ...font.sub, color: color.textMuted, marginTop: 4, marginBottom: 12 },
});
