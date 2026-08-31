import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { grad, color } from '../../theme/tokens';
import { DayPass, DayPassStatus } from '../../types';
import { QrReveal } from './QrReveal';

interface Props { pass: DayPass; status: DayPassStatus; onBook: () => void; qrSeconds?: number }

const BENEFITS = ['Vào cửa 1 lượt trong ngày', 'Dùng mọi thiết bị & khu tập', 'Không cần đăng ký gói tháng'];

/**
 * Thẻ vé ngày, 2 trạng thái:
 *  - 'booking': đang đặt vé → quyền lợi + giá + nút "Đặt vé ngày" (chưa có QR).
 *  - 'active' : đã hoàn tất đăng ký → thông tin vé + QR vào cửa có đếm ngước.
 */
export function DayPassCard({ pass: p, status, onBook, qrSeconds = 30 }: Props) {
  const active = status === 'active';

  return (
    <LinearGradient colors={grad.olive} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
      <View style={styles.glow} />

      <View style={styles.headRow}>
        <Text style={styles.brand}>{p.brand} · VÉ NGÀY</Text>
        <View style={[styles.statusPill, active ? styles.pillActive : styles.pillIdle]}>
          <Text style={[styles.statusTxt, active ? styles.statusTxtActive : styles.statusTxtIdle]}>
            {active ? 'ĐÃ KÍCH HOẠT' : 'CHƯA KÍCH HOẠT'}
          </Text>
        </View>
      </View>

      {active ? (
        <>
          {/* Trạng thái 2: đã hoàn tất đăng ký */}
          <Text style={styles.name}>{p.memberName}</Text>
          <Text style={styles.expiry}>Có hiệu lực trong ngày · {p.validDate}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{p.priceLabel}</Text>
            <Text style={styles.entries}>còn {p.entriesLeft} lượt vào</Text>
          </View>

          <QrReveal
            value={p.passCode}
            modalName={p.memberName}
            modalSub={`${p.brand} · VÉ NGÀY`}
            code={p.passCode}
            seconds={qrSeconds}
            miniTitle="Mã QR vào cửa"
            buttonLabel="Hiện mã QR vào cửa"
          />
        </>
      ) : (
        <>
          {/* Trạng thái 1: đang đặt vé */}
          <Text style={styles.title}>Vé vào cửa 1 ngày</Text>
          <View style={styles.benefits}>
            {BENEFITS.map(b => (
              <View key={b} style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={16} color={color.volt} />
                <Text style={styles.benefitTxt}>{b}</Text>
              </View>
            ))}
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{p.priceLabel}</Text>
            <Text style={styles.entries}>/ ngày · {p.branch}</Text>
          </View>

          <Pressable onPress={onBook} accessibilityRole="button" accessibilityLabel="Đặt vé ngày" style={styles.bookBtn}>
            <Ionicons name="ticket-outline" size={16} color={color.ink} />
            <Text style={styles.bookTxt}>Đặt vé ngày</Text>
          </Pressable>
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 26, padding: 24, overflow: 'hidden' },
  glow: { position: 'absolute', right: -30, top: -30, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(198,248,51,0.12)' },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { color: color.volt, fontSize: 12, fontWeight: '800', letterSpacing: 0.6 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100 },
  pillActive: { backgroundColor: 'rgba(198,248,51,0.18)' },
  pillIdle: { backgroundColor: 'rgba(255,255,255,0.14)' },
  statusTxt: { fontSize: 10.5, fontWeight: '800' },
  statusTxtActive: { color: color.volt },
  statusTxtIdle: { color: 'rgba(255,255,255,0.8)' },

  name: { color: '#FFFFFF', fontSize: 21, fontWeight: '800', marginTop: 14 },
  expiry: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginTop: 14 },

  benefits: { marginTop: 14, gap: 8 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  benefitTxt: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600' },

  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginTop: 16 },
  price: { color: color.volt, fontSize: 22, fontWeight: '800' },
  entries: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600' },

  bookBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
    backgroundColor: color.volt, borderRadius: 14, paddingVertical: 14, marginTop: 22,
  },
  bookTxt: { color: color.ink, fontSize: 14, fontWeight: '800' },
});
