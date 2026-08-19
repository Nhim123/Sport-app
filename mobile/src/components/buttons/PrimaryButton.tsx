import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { color, radius, font } from '../../theme/tokens';

interface Props { label: string; onPress: () => void; disabled?: boolean; loading?: boolean }
export function PrimaryButton({ label, onPress, disabled, loading }: Props) {
  return (
    <Pressable
      onPress={disabled || loading ? undefined : onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={[styles.btn, disabled && styles.disabled]}
    >
      {loading ? <ActivityIndicator color={color.volt} />
        : <Text style={[styles.txt, disabled && styles.txtDisabled]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: color.ink, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  disabled: { backgroundColor: '#D8D8D2' },
  txt: { ...font.cardTitle, color: color.volt, fontWeight: '800' },
  txtDisabled: { color: '#9A9F92' },
});
