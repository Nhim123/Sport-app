import { Pressable, Text, StyleSheet } from 'react-native';
import { color, radius, font } from '../../theme/tokens';

type Variant = 'solid' | 'outline';
interface Props { label: string; onPress: () => void; variant?: Variant }

/** Chip hành động bo tròn ("Tham gia"). solid = nền ink/chữ volt, outline = viền ink/chữ ink. */
export function PillButton({ label, onPress, variant = 'solid' }: Props) {
  const outline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.pill, outline ? styles.outline : styles.solid]}
    >
      <Text style={[styles.txt, { color: outline ? color.ink : color.volt }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: { alignSelf: 'flex-start', paddingHorizontal: 18, paddingVertical: 9, borderRadius: radius.chip },
  solid: { backgroundColor: color.ink },
  outline: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.ink },
  txt: { ...font.tiny, fontSize: 12.5, fontWeight: '800' },
});
