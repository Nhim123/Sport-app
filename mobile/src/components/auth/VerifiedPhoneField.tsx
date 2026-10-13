import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../state/AuthContext';
import { color, font, radius, shadow } from '../../theme/tokens';

/**
 * Ô "Số điện thoại" dùng chung cho mọi màn đăng ký dịch vụ.
 * - Đã xác thực → hiện SĐT + huy hiệu "Đã xác thực".
 * - Chưa xác thực / chưa có số → nút mời xác thực (gọi `onVerify`).
 */
export function VerifiedPhoneField({ onVerify }: { onVerify: () => void }) {
  const { user } = useAuth();
  const verified = !!user?.phoneVerified && !!user?.phone;

  return (
    <View>
      <Text style={styles.label}>Số điện thoại</Text>
      <View style={[styles.row, verified && styles.rowOk]}>
        <Ionicons name="call-outline" size={18} color={color.textMuted} />
        <Text style={styles.value} numberOfLines={1}>{user?.phone || 'Chưa có số điện thoại'}</Text>
        {verified ? (
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={14} color={color.voltDark} />
            <Text style={styles.badgeTxt}>Đã xác thực</Text>
          </View>
        ) : (
          <Pressable onPress={onVerify} hitSlop={8} accessibilityRole="button">
            <Text style={styles.action}>{user?.phone ? 'Xác thực' : 'Thêm & xác thực'}</Text>
          </Pressable>
        )}
      </View>
      {!verified ? <Text style={styles.hint}>Cần xác thực SĐT qua OTP trước khi đăng ký dịch vụ.</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...font.sub, color: color.textMuted, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: color.surface,
    borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 13,
    borderWidth: 1.5, borderColor: 'transparent', ...shadow.card,
  },
  rowOk: { borderColor: color.voltDark },
  value: { flex: 1, ...font.body, color: color.ink },
  action: { ...font.sub, color: color.voltDark, fontWeight: '800' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  badgeTxt: { ...font.tiny, color: color.voltDark, fontWeight: '800' },
  hint: { ...font.sub, color: color.textMuted, marginTop: 8 },
});
