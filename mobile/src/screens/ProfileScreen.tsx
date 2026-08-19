import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Screen } from '../components/Screen';
import { Avatar } from '../components/primitives/Avatar';
import { StatCell } from '../components/primitives/StatCell';
import { MenuRow } from '../components/primitives/MenuRow';
import { profileStats, profileMenu } from '../data/mock';
import { color, font, radius, space, shadow } from '../theme/tokens';

export default function ProfileScreen() {
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: space.xl, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <Avatar label="MK" size={70} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Minh Khang</Text>
            <Text style={styles.email}>khang.minh@email.com</Text>
          </View>
        </View>

        <View style={styles.stats}>
          {profileStats.map(s => (
            <View key={s.label} style={styles.statCard}>
              <StatCell value={s.value} label={s.label} />
            </View>
          ))}
        </View>

        <View style={styles.menuCard}>
          {profileMenu.map((m, i) => (
            <MenuRow key={m.key} icon={m.icon} label={m.label} onPress={() => {}} last={i === profileMenu.length - 1} />
          ))}
        </View>

        <Pressable accessibilityRole="button" style={styles.logout} onPress={() => {}}>
          <Text style={styles.logoutTxt}>Đăng xuất</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8 },
  name: { ...font.h2, color: color.ink },
  email: { ...font.sub, color: color.textMuted, marginTop: 2 },
  stats: { flexDirection: 'row', gap: 11, marginTop: 20 },
  statCard: { flex: 1, backgroundColor: color.surface, borderRadius: radius.card, paddingVertical: 16 },
  menuCard: { backgroundColor: color.surface, borderRadius: radius.card, paddingHorizontal: 8, paddingVertical: 6, marginTop: 24, ...shadow.card },
  logout: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.line, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 20 },
  logoutTxt: { ...font.body, fontWeight: '700', color: color.danger },
});
