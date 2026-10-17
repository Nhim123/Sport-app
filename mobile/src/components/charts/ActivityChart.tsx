import { View, Text, StyleSheet } from 'react-native';
import { color, font } from '../../theme/tokens';

export interface ActivityPoint { label: string; value: number }

/** Biểu đồ cột thời gian hoạt động (giờ). Cột cao nhất tô đậm volt, còn lại nhạt. */
export function ActivityChart({ data, unit = 'h' }: { data: ActivityPoint[]; unit?: string }) {
  const max = Math.max(1, ...data.map(d => d.value));
  return (
    <View style={styles.row}>
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        const peak = d.value === max && d.value > 0;
        return (
          <View key={i} style={styles.col}>
            <Text style={styles.val}>{d.value > 0 ? `${d.value}${unit}` : ''}</Text>
            <View style={styles.track}>
              <View style={[styles.bar, peak ? styles.barPeak : styles.barDim, { height: `${d.value > 0 ? Math.max(6, pct) : 0}%` }]} />
            </View>
            <Text style={styles.label} numberOfLines={1}>{d.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 8 },
  col: { flex: 1, alignItems: 'center', gap: 5 },
  val: { ...font.tiny, color: color.textMuted, fontWeight: '700', height: 14 },
  track: { width: 20, height: 96, borderRadius: 7, backgroundColor: color.bg, justifyContent: 'flex-end', overflow: 'hidden' },
  bar: { width: '100%', borderRadius: 7 },
  barPeak: { backgroundColor: color.volt },
  barDim: { backgroundColor: color.lineSoft },
  label: { ...font.tiny, color: color.textMuted, fontWeight: '600' },
});
