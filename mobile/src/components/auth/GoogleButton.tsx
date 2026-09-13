import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, radius, font } from '../../theme/tokens';

/** Nút đăng nhập qua Gmail (Google). */
export function GoogleButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={styles.btn}>
      <Ionicons name="logo-google" size={18} color="#EA4335" />
      <Text style={styles.txt}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: color.surface, borderWidth: 1, borderColor: color.line,
    borderRadius: radius.md, paddingVertical: 15,
  },
  txt: { ...font.cardTitle, color: color.ink, fontWeight: '700' },
});
