import { Pressable, Text, StyleSheet } from 'react-native';
import { color, radius, font } from '../../theme/tokens';

interface Props { label: string; active: boolean; onPress: () => void }
export function FilterChip({ label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[styles.chip, active ? styles.active : styles.idle]}
    >
      <Text style={[styles.txt, { color: active ? color.volt : color.ink }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.chip, marginRight: 8 },
  active: { backgroundColor: color.ink },
  idle: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.line },
  txt: { ...font.body, fontWeight: '700' },
});
