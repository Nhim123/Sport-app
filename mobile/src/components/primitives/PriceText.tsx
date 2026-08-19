import { Text, StyleSheet } from 'react-native';
import { color } from '../../theme/tokens';

export function PriceText({ value, tone = 'volt', size = 15 }: { value: string; tone?: 'volt' | 'ink'; size?: number }) {
  return <Text style={[styles.txt, { fontSize: size, color: tone === 'volt' ? color.volt : color.ink }]}>{value}</Text>;
}

const styles = StyleSheet.create({
  txt: { fontWeight: '800' },
});
