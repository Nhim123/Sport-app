import { View, Pressable, Text, StyleSheet } from 'react-native';
import { color, radius } from '../../theme/tokens';
import { Slot } from '../../types';

interface Props { slots: Slot[]; selectedId: string | null; onSelect: (id: string) => void }
export function SlotGrid({ slots, selectedId, onSelect }: Props) {
  return (
    <View>
      <View style={styles.grid}>
        {slots.map(s => {
          const selected = s.id === selectedId;
          const booked = s.state === 'booked';
          return (
            <Pressable
              key={s.id}
              disabled={booked}
              onPress={() => onSelect(s.id)}
              accessibilityRole="button"
              accessibilityState={{ selected, disabled: booked }}
              style={[styles.slot, booked ? styles.booked : selected ? styles.selected : styles.free]}
            >
              <Text style={[styles.txt, { color: booked ? color.navIdle : color.ink }]}>{s.time}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.legend}>
        <Legend c={color.surface} b={color.line} label="Trống" />
        <Legend c={color.volt} b={color.voltDark} label="Đã chọn" />
        <Legend c="#ECEAE5" b="#ECEAE5" label="Hết chỗ" />
      </View>
    </View>
  );
}

function Legend({ c, b, label }: { c: string; b: string; label: string }) {
  return (
    <View style={styles.legItem}>
      <View style={[styles.dot, { backgroundColor: c, borderColor: b }]} />
      <Text style={styles.legTxt}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slot: { width: '31%', paddingVertical: 14, borderRadius: radius.sm, alignItems: 'center', borderWidth: 1 },
  free: { backgroundColor: color.surface, borderColor: color.line },
  selected: { backgroundColor: color.volt, borderColor: color.voltDark },
  booked: { backgroundColor: '#ECEAE5', borderColor: '#ECEAE5' },
  txt: { fontSize: 14, fontWeight: '700' },
  legend: { flexDirection: 'row', gap: 16, marginTop: 14 },
  legItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 14, height: 14, borderRadius: 4, borderWidth: 1 },
  legTxt: { fontSize: 12, color: color.textMuted },
});
