import { View, Text, Pressable, StyleSheet } from 'react-native';
import { color, font } from '../../theme/tokens';

interface Props { icon: string; label: string; onPress?: () => void; last?: boolean }

/** 1 dòng menu hồ sơ: ô icon + nhãn + chevron. `last` bỏ đường kẻ dưới. */
export function MenuRow({ icon, label, onPress, last }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.row, last && styles.last]}
    >
      <View style={styles.iconBox}><Text style={styles.icon}>{icon}</Text></View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.chev}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 15, paddingHorizontal: 12,
    borderBottomWidth: 1, borderBottomColor: color.lineSoft },
  last: { borderBottomWidth: 0 },
  iconBox: { width: 38, height: 38, borderRadius: 11, backgroundColor: color.bg, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 17 },
  label: { flex: 1, ...font.body, fontSize: 14.5, fontWeight: '600', color: color.ink },
  chev: { color: '#C7CCBF', fontSize: 20 },
});
