import { View, Text, StyleSheet } from 'react-native';
import { color } from '../../theme/tokens';

export function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.cell}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cell: { flex: 1, alignItems: 'center' },
  value: { fontSize: 19, fontWeight: '800', color: color.ink },
  label: { fontSize: 12, fontWeight: '500', color: color.textMuted, marginTop: 2 },
});
