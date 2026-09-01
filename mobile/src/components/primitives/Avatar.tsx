import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { grad, color } from '../../theme/tokens';

export type AvatarIcon = keyof typeof Ionicons.glyphMap;
interface Props { label?: string; icon?: AvatarIcon; size?: number }

/** Ô đại diện gradient volt. Ưu tiên icon nếu có, ngược lại hiện chữ viết tắt. */
export function Avatar({ label, icon, size = 46 }: Props) {
  return (
    <LinearGradient colors={grad.volt} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={[styles.box, { width: size, height: size, borderRadius: size * 0.33 }]}>
      {icon ? (
        <Ionicons name={icon} size={size * 0.5} color={color.ink} />
      ) : (
        <Text style={styles.txt}>{label}</Text>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
  txt: { color: color.ink, fontWeight: '800', fontSize: 16 },
});
