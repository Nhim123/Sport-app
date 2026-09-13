import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Avatar } from '../components/primitives/Avatar';
import { StatCell } from '../components/primitives/StatCell';
import { MenuRow } from '../components/primitives/MenuRow';
import { profileStats, profileMenu } from '../data/mock';
import { useAuth } from '../state/AuthContext';
import { color, font, radius, space, shadow } from '../theme/tokens';

// Viết tắt tên → 2 chữ cái cho avatar (vd "Minh Khang" → "MK").
const initialsOf = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('') || 'B';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const name = user?.name ?? 'Bạn';

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: space.xl, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <Avatar label={initialsOf(name)} size={70} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{user?.email ?? ''}</Text>
            {user?.provider === 'google' ? (
              <View style={styles.badge}>
                <Ionicons name="logo-google" size={12} color="#EA4335" />
                <Text style={styles.badgeTxt}>Đăng nhập qua Google</Text>
              </View>
            ) : null}
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

        <Pressable accessibilityRole="button" style={styles.logout} onPress={signOut}>
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
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  badgeTxt: { ...font.tiny, color: color.textMuted, fontWeight: '700' },
  stats: { flexDirection: 'row', gap: 11, marginTop: 20 },
  statCard: { flex: 1, backgroundColor: color.surface, borderRadius: radius.card, paddingVertical: 16 },
  menuCard: { backgroundColor: color.surface, borderRadius: radius.card, paddingHorizontal: 8, paddingVertical: 6, marginTop: 24, ...shadow.card },
  logout: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.line, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 20 },
  logoutTxt: { ...font.body, fontWeight: '700', color: color.danger },
});
