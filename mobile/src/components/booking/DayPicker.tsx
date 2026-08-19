import { FlatList, Pressable, Text, StyleSheet } from 'react-native';
import { color, radius } from '../../theme/tokens';
import { DayItem } from '../../types';

interface Props { days: DayItem[]; value: string; onChange: (key: string) => void }
export function DayPicker({ days, value, onChange }: Props) {
  return (
    <FlatList
      data={days}
      horizontal
      keyExtractor={d => d.key}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10 }}
      renderItem={({ item }) => {
        const active = item.key === value;
        return (
          <Pressable
            onPress={() => onChange(item.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.cell, active ? styles.active : styles.idle]}
          >
            <Text style={[styles.dow, { color: active ? color.ink : color.textMuted }]}>{item.dow}</Text>
            <Text style={[styles.day, { color: color.ink }]}>{item.day}</Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  cell: { width: 60, height: 68, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  active: { backgroundColor: color.volt },
  idle: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.line },
  dow: { fontSize: 12, fontWeight: '600' },
  day: { fontSize: 18, fontWeight: '800', marginTop: 2 },
});
