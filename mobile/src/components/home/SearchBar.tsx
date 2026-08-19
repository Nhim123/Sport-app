import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, radius, font } from '../../theme/tokens';

interface Props { value: string; onChangeText: (t: string) => void; placeholder?: string }
export function SearchBar({ value, onChangeText, placeholder }: Props) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="search" size={20} color={color.textMuted} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={color.textFaint}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: color.surface,
    borderRadius: 17, paddingHorizontal: 15, paddingVertical: 13, marginTop: 20 },
  input: { flex: 1, ...font.body, color: color.ink, padding: 0 },
});
