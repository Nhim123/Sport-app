import { View, Text, Pressable, StyleSheet } from 'react-native';
import { color, radius, font } from '../../theme/tokens';

export interface SegOption<T extends string> { key: T; label: string }
interface Props<T extends string> { value: T; options: SegOption<T>[]; onChange: (key: T) => void }

/**
 * Thanh chuyển trạng thái (segmented control): 1 track, nhiều đoạn, đúng 1 đoạn active.
 * Compound — group giữ "đoạn nào active", màn hình chỉ cần value/onChange.
 */
export function SegmentedTabs<T extends string>({ value, options, onChange }: Props<T>) {
  return (
    <View style={styles.track}>
      {options.map(o => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.seg, active && styles.segActive]}
          >
            <Text style={[styles.txt, { color: active ? color.volt : color.textMuted }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', backgroundColor: color.lineSoft, borderRadius: radius.chip, padding: 4, gap: 4 },
  seg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: radius.chip },
  segActive: { backgroundColor: color.ink },
  txt: { ...font.cardTitle, fontWeight: '800', fontSize: 13.5 },
});
