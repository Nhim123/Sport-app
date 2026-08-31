import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { grad, color } from '../../theme/tokens';
import { Membership } from '../../types';
import { QrReveal } from './QrReveal';

interface Props { membership: Membership; qrSeconds?: number }

/**
 * Thẻ hội viên (gói tập): loại thẻ · họ tên · mã hồ sơ · hết hạn.
 * QR ẩn tới khi bấm; ô QR nhỏ có đếm ngược, chạm để phóng to; tự ẩn khi hết giờ.
 */
export function MemberCard({ membership: m, qrSeconds = 30 }: Props) {
  return (
    <LinearGradient colors={grad.member} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
      <View style={styles.glow} />

      <View style={styles.headRow}>
        <Text style={styles.brand}>{m.brand}</Text>
        {m.active ? (
          <View style={styles.statusPill}><Text style={styles.statusTxt}>ĐANG HOẠT ĐỘNG</Text></View>
        ) : null}
      </View>

      {/* Họ và tên */}
      <Text style={styles.name}>{m.memberName}</Text>

      {/* Loại thẻ · Hết hạn */}
      <View style={styles.metaRow}>
        <View style={styles.metaCol}>
          <Text style={styles.metaLabel}>Loại thẻ</Text>
          <Text style={styles.metaValue}>{m.plan}</Text>
        </View>
        <View style={styles.metaCol}>
          <Text style={styles.metaLabel}>Hết hạn</Text>
          <Text style={styles.metaValue}>{m.expiry}</Text>
        </View>
      </View>

      {/* Mã hồ sơ thẻ (nếu có) */}
      {m.memberCode ? (
        <View style={styles.codeCol}>
          <Text style={styles.metaLabel}>Mã hồ sơ</Text>
          <Text style={[styles.metaValue, styles.codeValue]}>{m.memberCode}</Text>
        </View>
      ) : null}

      <QrReveal
        value={m.memberCode}
        modalName={m.memberName}
        modalSub={`${m.brand} · ${m.plan}`}
        code={m.memberCode}
        seconds={qrSeconds}
        miniTitle="Mã QR check-in"
        buttonLabel="Hiện mã QR check-in"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 26, padding: 24, overflow: 'hidden' },
  glow: { position: 'absolute', right: -30, top: -30, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(198,248,51,0.12)' },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { color: color.volt, fontSize: 12, fontWeight: '800', letterSpacing: 0.6 },
  statusPill: { backgroundColor: 'rgba(198,248,51,0.18)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100 },
  statusTxt: { color: color.volt, fontSize: 10.5, fontWeight: '800' },
  name: { color: '#FFFFFF', fontSize: 21, fontWeight: '800', marginTop: 14 },
  metaRow: { flexDirection: 'row', marginTop: 18 },
  metaCol: { flex: 1 },
  metaLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600', marginBottom: 3 },
  metaValue: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  codeCol: { marginTop: 14 },
  codeValue: { letterSpacing: 1.5 },
});
