import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { color, font, radius, space } from '../theme/tokens';

interface Props {
  visible: boolean;
  onClose: () => void;
  onScan: () => void;               // gọi khi người dùng "giả lập quét mã" (demo, chưa gắn camera thật)
  title?: string;
  hint?: string;
}

/** Bottom-sheet quét mã QR (mock). Dùng chung cho màn Tìm kiếm và Tham gia CLB. */
export function QrScanModal({ visible, onClose, onScan, title = 'Quét mã QR', hint }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.head}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8} accessibilityLabel="Đóng">
              <Ionicons name="close" size={24} color={color.ink} />
            </Pressable>
          </View>

          <LinearGradient colors={['#1C1F16', '#3A4029']} style={styles.viewfinder}>
            <View style={styles.frame}>
              <View style={[styles.corner, styles.tl]} />
              <View style={[styles.corner, styles.tr]} />
              <View style={[styles.corner, styles.bl]} />
              <View style={[styles.corner, styles.br]} />
              <Ionicons name="qr-code-outline" size={54} color="rgba(198,248,51,0.5)" />
            </View>
          </LinearGradient>

          <Text style={styles.hint}>{hint ?? 'Đưa mã QR vào khung để quét.'}</Text>
          <Pressable onPress={onScan} accessibilityRole="button" style={styles.btn}>
            <Ionicons name="scan-outline" size={18} color={color.volt} />
            <Text style={styles.btnTxt}>Giả lập quét mã</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: color.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: space.xl, paddingBottom: 34 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  title: { ...font.h2, color: color.ink },
  viewfinder: { height: 240, borderRadius: radius.card, alignItems: 'center', justifyContent: 'center' },
  frame: { width: 150, height: 150, alignItems: 'center', justifyContent: 'center' },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: color.volt },
  tl: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
  tr: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
  br: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
  hint: { ...font.sub, color: color.textMuted, textAlign: 'center', marginTop: 18, marginBottom: 16 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: color.ink, borderRadius: radius.md, paddingVertical: 15 },
  btnTxt: { color: color.volt, fontSize: 14, fontWeight: '800' },
});
