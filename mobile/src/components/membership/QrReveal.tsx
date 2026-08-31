import { useEffect, useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color } from '../../theme/tokens';
import { QrCode } from '../primitives/QrCode';
import { useCountdown } from '../../hooks/useCountdown';

const pad = (n: number) => (n < 10 ? '0' + n : '' + n);

interface Props {
  value: string;              // nội dung QR
  modalName: string;          // tên lớn ở màn phóng to
  modalSub?: string;          // dòng phụ (brand · loại)
  code?: string;              // mã hiển thị dưới QR
  seconds?: number;           // thời hạn đếm ngược, mặc định 30s
  miniTitle?: string;         // tiêu đề ô QR nhỏ
  buttonLabel?: string;       // nhãn nút hiện QR
}

/**
 * Khối QR dùng chung (dùng trên nền gradient tối): nút → ô QR nhỏ + đếm ngược → phóng to toàn màn.
 * Tự giữ đồng hồ đếm ngược; hết giờ tự ẩn và đóng màn phóng to.
 */
export function QrReveal({
  value, modalName, modalSub, code, seconds = 30,
  miniTitle = 'Mã QR', buttonLabel = 'Hiện mã QR',
}: Props) {
  const { secondsLeft, running, start } = useCountdown(seconds);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => { if (!running) setExpanded(false); }, [running]);

  return (
    <>
      {running ? (
        <Pressable
          onPress={() => setExpanded(true)}
          accessibilityRole="button"
          accessibilityLabel={`Phóng to ${miniTitle}`}
          style={styles.qrMini}
        >
          <View style={styles.qrMiniBox}><QrCode value={value} size={56} /></View>
          <View style={styles.qrMiniText}>
            <Text style={styles.qrMiniTitle} numberOfLines={1}>{miniTitle}</Text>
            <Text style={styles.countdown} numberOfLines={1}>Tự ẩn sau 0:{pad(secondsLeft)} · chạm để phóng to</Text>
          </View>
          <Ionicons name="expand-outline" size={18} color={color.volt} />
        </Pressable>
      ) : (
        <Pressable
          onPress={start}
          accessibilityRole="button"
          accessibilityLabel={buttonLabel}
          style={styles.qrBtn}
        >
          <Ionicons name="qr-code-outline" size={16} color={color.ink} />
          <Text style={styles.qrBtnTxt}>{buttonLabel}</Text>
        </Pressable>
      )}

      <Modal visible={expanded} transparent animationType="fade" onRequestClose={() => setExpanded(false)}>
        <Pressable style={styles.overlay} onPress={() => setExpanded(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetName}>{modalName}</Text>
            {modalSub ? <Text style={styles.sheetPlan}>{modalSub}</Text> : null}
            <View style={styles.qrLargeBox}><QrCode value={value} size={236} /></View>
            {code ? <Text style={styles.sheetCode}>{code}</Text> : null}
            <Text style={styles.sheetCountdown}>Mã tự ẩn sau 0:{pad(secondsLeft)}</Text>
            <Pressable onPress={() => setExpanded(false)} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel="Đóng">
              <Text style={styles.closeTxt}>Đóng</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  qrBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
    backgroundColor: color.volt, borderRadius: 14, paddingVertical: 14, marginTop: 22,
  },
  qrBtnTxt: { color: color.ink, fontSize: 14, fontWeight: '800' },

  qrMini: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 22,
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 10,
  },
  qrMiniBox: { backgroundColor: '#FFFFFF', padding: 6, borderRadius: 10 },
  qrMiniText: { flex: 1 },
  qrMiniTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  countdown: { color: color.volt, fontSize: 12, fontWeight: '600', marginTop: 3 },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.78)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  sheet: { backgroundColor: color.surface, borderRadius: 28, padding: 26, alignItems: 'center', maxWidth: 340, width: '100%' },
  sheetName: { color: color.ink, fontSize: 18, fontWeight: '800' },
  sheetPlan: { color: color.textMuted, fontSize: 12.5, fontWeight: '600', marginTop: 2 },
  qrLargeBox: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 20, marginTop: 20, borderWidth: 1, borderColor: color.line },
  sheetCode: { color: color.textMuted, fontSize: 12, letterSpacing: 2, marginTop: 14 },
  sheetCountdown: { color: color.ink, fontSize: 13, fontWeight: '800', marginTop: 6 },
  closeBtn: { backgroundColor: color.ink, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 40, marginTop: 20 },
  closeTxt: { color: color.volt, fontSize: 14, fontWeight: '800' },
});
