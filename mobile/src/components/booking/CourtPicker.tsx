import { View, Pressable, Text, StyleSheet } from 'react-native';
import { color, radius } from '../../theme/tokens';

interface Props { count: number; value: number | null; onChange: (court: number) => void }
export function CourtPicker({ count, value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }, (_, i) => i + 1).map(n => {
        const active = n === value;
        return (
          <Pressable
            key={n}
            onPress={() => onChange(n)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.btn, active ? styles.active : styles.idle]}
          >
            <Text style={[styles.txt, { color: active ? color.volt : color.ink }]}>Sân {n}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  btn: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: radius.sm },
  active: { backgroundColor: color.ink },
  idle: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.line },
  txt: { fontSize: 14, fontWeight: '700' },
});
