import { useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { color, font, radius, space } from '../theme/tokens';

interface Props {
  visible: boolean;
  onClose: () => void;
  onScan: (data?: string) => void;  // data = nội dung mã QR quét được; không có = giả lập
  title?: string;
  hint?: string;
}

/** Bottom-sheet quét QR bằng camera thật (expo-camera), có nút giả lập làm fallback. */
export function QrScanModal({ visible, onClose, onScan, title = 'Quét mã QR', hint }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const granted = permission?.granted === true;

  const handleBarcode = ({ data }: { data: string }) => {
    if (scanned) return;      // chỉ nhận 1 lần cho tới khi mở lại
    setScanned(true);
    onScan(data);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      onShow={() => setScanned(false)}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.head}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8} accessibilityRole="button" accessibilityLabel="Đóng">
              <Ionicons name="close" size={24} color={color.ink} />
            </Pressable>
          </View>

          <View style={styles.viewfinder}>
            {granted ? (
              <CameraView
                style={StyleSheet.absoluteFill}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                onBarcodeScanned={scanned ? undefined : handleBarcode}
              />
            ) : (
              <LinearGradient colors={['#1C1F16', '#3A4029']} style={StyleSheet.absoluteFill} />
            )}
            <View style={styles.frame}>
              <View style={[styles.corner, styles.tl]} />
              <View style={[styles.corner, styles.tr]} />
              <View style={[styles.corner, styles.bl]} />
              <View style={[styles.corner, styles.br]} />
              {!granted ? <Ionicons name="qr-code-outline" size={54} color="rgba(198,248,51,0.5)" /> : null}
            </View>
          </View>

          {granted ? (
            <Text style={styles.hint}>{hint ?? 'Đưa mã QR vào khung để quét.'}</Text>
          ) : (
            <>
              <Text style={styles.hint}>Cần quyền camera để quét mã QR của CLB.</Text>
              <Pressable onPress={requestPermission} accessibilityRole="button" style={styles.btn}>
                <Ionicons name="camera-outline" size={18} color={color.volt} />
                <Text style={styles.btnTxt}>Cho phép camera</Text>
              </Pressable>
            </>
          )}

          <Pressable onPress={() => onScan()} accessibilityRole="button" style={styles.btnGhost}>
            <Ionicons name="scan-outline" size={16} color={color.ink} />
            <Text style={styles.btnGhostTxt}>Giả lập quét mã</Text>
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
  viewfinder: { height: 240, borderRadius: radius.card, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  frame: { width: 150, height: 150, alignItems: 'center', justifyContent: 'center' },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: color.volt },
  tl: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
  tr: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
  br: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
  hint: { ...font.sub, color: color.textMuted, textAlign: 'center', marginTop: 18, marginBottom: 16 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: color.ink, borderRadius: radius.md, paddingVertical: 15 },
  btnTxt: { color: color.volt, fontSize: 14, fontWeight: '800' },
  btnGhost: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 12, marginTop: 8 },
  btnGhostTxt: { color: color.ink, fontSize: 13, fontWeight: '700' },
});
