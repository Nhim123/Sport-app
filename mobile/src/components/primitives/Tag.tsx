import { View, Text, StyleSheet } from 'react-native';
import { color, radius, font } from '../../theme/tokens';

type Variant = 'volt' | 'soft' | 'dark';
export function Tag({ label, variant = 'volt' }: { label: string; variant?: Variant }) {
  return (
    <View style={[styles.base, styles[variant]]}>
      <Text style={[styles.txt, variant === 'volt' ? styles.txtDark : styles.txtLight]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.chip },
  volt: { backgroundColor: color.volt },
  soft: { backgroundColor: '#EEF7D0' },
  dark: { backgroundColor: 'rgba(0,0,0,0.55)' },
  txt: { ...font.tiny, letterSpacing: 0.3 },
  txtDark: { color: color.ink },
  txtLight: { color: '#FFFFFF' },
});
