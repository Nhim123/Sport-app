import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { IconButton } from '../components/primitives/IconButton';
import { ClubCard } from '../components/cards/ClubCard';
import { ClubRow } from '../components/cards/ClubRow';
import { MatchCard } from '../components/cards/MatchCard';
import { DayPassCard } from '../components/membership/DayPassCard';
import { myClubs, discoverClubs, matches, clubPass } from '../data/mock';
import { CLUB_CARD_PROPS } from '../data/passPresets';
import { usePasses } from '../state/PassContext';
import { RootStackParamList } from '../navigation/types';
import { color, font, space } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ClubScreen() {
  const nav = useNavigation<Nav>();
  const { active } = usePasses();

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
          <Text style={styles.section}>Vé sinh hoạt CLB</Text>
          <DayPassCard
            pass={clubPass}
            status={active.club ? 'active' : 'booking'}
            onBook={() => nav.navigate('DayPassPayment', {
              order: {
                purpose: 'club',
                title: 'Vé sinh hoạt câu lạc bộ',
                brand: clubPass.brand,
                itemLabel: 'Sân',
                itemValue: clubPass.venue,
                address: clubPass.address,
                date: clubPass.schedule.date,
                priceLabel: clubPass.priceLabel,
                code: clubPass.passCode,
                schedule: clubPass.schedule,
                passKind: 'club',
              },
            })}
            {...CLUB_CARD_PROPS}
          />
        </View>

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
