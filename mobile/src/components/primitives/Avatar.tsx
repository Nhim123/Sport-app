import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { grad, color } from '../../theme/tokens';

export function Avatar({ label, size = 46 }: { label: string; size?: number }) {
  return (
    <LinearGradient colors={grad.volt} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={[styles.box, { width: size, height: size, borderRadius: size * 0.33 }]}>
      <Text style={styles.txt}>{label}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
  txt: { color: color.ink, fontWeight: '800', fontSize: 16 },
});
