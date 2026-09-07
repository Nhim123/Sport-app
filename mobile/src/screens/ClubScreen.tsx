import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
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
import { color, font, radius, space, shadow } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ClubScreen() {
  const nav = useNavigation<Nav>();
  const { active, joinedClub, joinClub } = usePasses();
  // Chuyển sang tab Tìm kiếm để tìm câu lạc bộ.
  const goSearch = () => nav.navigate('MainTabs', { screen: 'Search' });
  // Tài khoản mời truy cập: chưa có câu lạc bộ → hiện 2 lựa chọn Tạo / Tham gia.

  if (!joinedClub) {
    return (
      <Screen>
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Câu lạc bộ</Text>
            <IconButton name="search" onPress={goSearch} bg={color.ink} iconColor={color.volt} size={42} iconSize={22} />
          </View>
          <View style={styles.gutter}>
            <Text style={styles.lead}>Bạn chưa tham gia câu lạc bộ nào. Bắt đầu bằng cách:</Text>

            <Pressable style={styles.optCard} onPress={() => nav.navigate('CreateClub')} accessibilityRole="button" accessibilityLabel="Tạo Club">
              <View style={[styles.optIcon, { backgroundColor: color.ink }]}>
                <Ionicons name="add" size={24} color={color.volt} />
              </View>
              <View style={styles.optMid}>
                <Text style={styles.optTitle}>Tạo Club</Text>
                <Text style={styles.optSub}>Làm chủ hội — mời thành viên, quản lý quỹ & chương trình</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={color.navIdle} />
            </Pressable>

            <Pressable style={styles.optCard} onPress={() => nav.navigate('JoinClub')} accessibilityRole="button" accessibilityLabel="Tham gia Club">
              <View style={[styles.optIcon, { backgroundColor: color.volt }]}>
                <Ionicons name="people" size={22} color={color.ink} />
              </View>
              <View style={styles.optMid}>
                <Text style={styles.optTitle}>Tham gia Club</Text>
                <Text style={styles.optSub}>Tìm và tham gia câu lạc bộ gần bạn</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={color.navIdle} />
            </Pressable>

            <Text style={styles.section}>Khám phá CLB</Text>
            {discoverClubs.map(c => <ClubRow key={c.id} club={c} onJoin={() => nav.navigate('JoinClub')} />)}
          </View>
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Câu lạc bộ</Text>
          <View style={styles.headerActions}>
            <IconButton name="search" onPress={goSearch} bg={color.ink} iconColor={color.volt} size={42} iconSize={22} />
            <IconButton name="add" onPress={() => nav.navigate('JoinClub')} bg={color.ink} iconColor={color.volt} size={42} iconSize={22} />
          </View>
        </View>

        <Text style={[styles.section, styles.gutter]}>CLB của tôi</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 13, paddingHorizontal: space.xl }}
        >
          {myClubs.map(c => <ClubCard key={c.id} club={c} onPress={() => nav.navigate('ClubDetail', { id: c.id, name: c.name })} />)}
        </ScrollView>

        <View style={styles.gutter}>
          <Text style={styles.section}>Vé sinh hoạt CLB</Text>
          <DayPassCard
            pass={clubPass}
            status={active.club ? 'active' : 'booking'}
            onBook={() => nav.navigate('DayPassPayment', { kind: 'club' })}
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
          {discoverClubs.map(c => <ClubRow key={c.id} club={c} onJoin={() => nav.navigate('JoinClub')} />)}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gutter: { paddingHorizontal: space.xl },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.xl, marginTop: 8 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { ...font.h1, color: color.ink },
  section: { ...font.section, color: color.ink, marginTop: 26, marginBottom: 12 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sub: { ...font.sub, color: color.textMuted, fontWeight: '600' },

  // Empty state (tài khoản mời truy cập)
  lead: { ...font.body, color: color.textMuted, marginTop: 12, marginBottom: 4 },
  optCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 12,
    backgroundColor: color.surface, borderRadius: radius.card, padding: 16, ...shadow.card,
  },
  optIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  optMid: { flex: 1 },
  optTitle: { ...font.cardTitle, color: color.ink },
  optSub: { ...font.sub, color: color.textMuted, marginTop: 3, lineHeight: 17 },
});
