import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, font, shadow } from '../../theme/tokens';
import { Avatar, AvatarIcon } from '../primitives/Avatar';

interface Props {
  greeting: string;
  name: string;
  avatarIcon?: AvatarIcon;
  onPressBell?: () => void;   // mở màn thông báo
  unread?: number;            // số thông báo chưa đọc → badge
}

export function HomeHeader({ greeting, name, avatarIcon = 'person', onPressBell, unread = 0 }: Props) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.greet}>{greeting}</Text>
        <Text style={styles.name}>{name}</Text>
      </View>

      <Pressable onPress={onPressBell} accessibilityRole="button" accessibilityLabel="Thông báo" style={styles.bell} hitSlop={8}>
        <Ionicons name="notifications-outline" size={22} color={color.ink} />
        {unread > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeTxt}>{unread > 9 ? '9+' : unread}</Text>
          </View>
        ) : null}
      </Pressable>

      <Avatar icon={avatarIcon} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  greet: { ...font.sub, color: color.textMuted },
  name: { ...font.h1, color: color.ink, marginTop: 2 },
  bell: { width: 44, height: 44, borderRadius: 22, backgroundColor: color.surface, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  badge: { position: 'absolute', top: 6, right: 6, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: color.danger, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, borderWidth: 2, borderColor: color.bg },
  badgeTxt: { color: '#fff', fontSize: 10, fontWeight: '800' },
});
