import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Screen } from '../components/Screen';
import { IconButton } from '../components/primitives/IconButton';
import { ClubCard } from '../components/cards/ClubCard';
import { ClubRow } from '../components/cards/ClubRow';
import { MatchCard } from '../components/cards/MatchCard';
import { myClubs, discoverClubs, matches } from '../data/mock';
import { color, font, space } from '../theme/tokens';

export default function ClubScreen() {
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Câu lạc bộ</Text>
          <IconButton name="add" onPress={() => {}} bg={color.ink} iconColor={color.volt} size={42} iconSize={22} />
        </View>

        <Text style={[styles.section, styles.gutter]}>CLB của tôi</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 13, paddingHorizontal: space.xl }}
        >
          {myClubs.map(c => <ClubCard key={c.id} club={c} onPress={() => {}} />)}
        </ScrollView>

        <View style={styles.gutter}>
          <View style={styles.sectionRow}>
            <Text style={styles.section}>Tìm bạn chơi</Text>
            <Text style={styles.sub}>Trình độ của bạn: Trung cấp</Text>
          </View>
          {matches.map(m => <MatchCard key={m.id} match={m} onJoin={() => {}} />)}
        </View>

        <View style={styles.gutter}>
          <Text style={styles.section}>Khám phá CLB</Text>
          {discoverClubs.map(c => <ClubRow key={c.id} club={c} onJoin={() => {}} />)}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gutter: { paddingHorizontal: space.xl },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.xl, marginTop: 8 },
  title: { ...font.h1, color: color.ink },
  section: { ...font.section, color: color.ink, marginTop: 26, marginBottom: 12 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sub: { ...font.sub, color: color.textMuted, fontWeight: '600' },
});
