import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { grad, color } from '../../theme/tokens';
import { Membership } from '../../types';
import { QrCode } from '../primitives/QrCode';

interface Props { membership: Membership }

/** Thẻ hội viên gradient tối + mã QR động. */
export function MemberCard({ membership: m }: Props) {
  return (
    <LinearGradient colors={grad.member} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
      <View style={styles.glow} />
      <View style={styles.headRow}>
        <Text style={styles.brand}>{m.brand} · {m.plan}</Text>
        {m.active ? (
          <View style={styles.statusPill}><Text style={styles.statusTxt}>ĐANG HOẠT ĐỘNG</Text></View>
        ) : null}
      </View>
      <Text style={styles.name}>{m.memberName}</Text>
      <Text style={styles.expiry}>Còn {m.daysLeft} ngày · hết hạn {m.expiry}</Text>
      <View style={styles.qrWrap}>
        <View style={styles.qrBox}><QrCode value={m.memberCode} /></View>
      </View>
      <Text style={styles.code}>{m.memberCode}</Text>
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
  expiry: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
  qrWrap: { alignItems: 'center', marginTop: 20 },
  qrBox: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 18 },
  code: { textAlign: 'center', color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 10, letterSpacing: 2 },
});
