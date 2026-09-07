import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, radius, font } from '../../theme/tokens';

// onPress: biến thanh tìm kiếm thành nút — chạm để chuyển sang màn Tìm kiếm (dùng ở Trang chủ).
// onScanQr: hiện nút quét mã QR ở cuối thanh.
interface Props {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  onPress?: () => void;
  onScanQr?: () => void;
}
export function SearchBar({ value, onChangeText, placeholder, onPress, onScanQr }: Props) {
  const inner = (
    <>
      <Ionicons name="search" size={20} color={color.textMuted} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={color.textFaint}
        editable={!onPress}
        pointerEvents={onPress ? 'none' : 'auto'}
      />
      {onScanQr && (
        <>
          <View style={styles.sep} />
          <Pressable
            onPress={onScanQr}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Quét mã QR"
            style={styles.qrBtn}
          >
            <Ionicons name="qr-code-outline" size={20} color={color.ink} />
          </Pressable>
        </>
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable style={styles.wrap} onPress={onPress} accessibilityRole="button" accessibilityLabel={placeholder}>
        {inner}
      </Pressable>
    );
  }
  return <View style={styles.wrap}>{inner}</View>;
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: color.surface,
    borderRadius: 17, paddingHorizontal: 15, paddingVertical: 13, marginTop: 20 },
  input: { flex: 1, ...font.body, color: color.ink, padding: 0 },
  sep: { width: 1, alignSelf: 'stretch', marginVertical: 2, backgroundColor: color.line },
  qrBtn: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: color.bg },
});
