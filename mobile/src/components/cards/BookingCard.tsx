import { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { color, radius, font, shadow } from '../../theme/tokens';
import { Booking } from '../../types';

interface Props { booking: Booking; onShowQR?: () => void; onCancel?: () => void }

function BookingCardBase({ booking, onShowQR, onCancel }: Props) {
  const isPickle = booking.sport === 'pickle';
  const headerBg = isPickle ? color.ink : '#2F3720';
  const sportLabel = isPickle ? '🏓 PICKLEBALL' : '🏋️ GYM · LỚP';
  const cols: { label: string; value: string }[] = [
    { label: 'Ngày', value: booking.date },
    { label: 'Giờ', value: booking.time },
    isPickle
      ? { label: 'Giá', value: booking.priceLabel ?? '' }
      : { label: 'HLV', value: booking.coach ?? '' },
  ];
  const showActions = isPickle && booking.status === 'upcoming';

  return (
    <View style={styles.card}>
      <View style={[styles.header, { backgroundColor: headerBg }]}>
        <Text style={styles.sport}>{sportLabel}</Text>
        <Text style={styles.code}>Mã: {booking.code}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.venue}>{booking.venueName}</Text>
        <View style={styles.cols}>
          {cols.map(c => (
            <View key={c.label}>
              <Text style={styles.colLabel}>{c.label}</Text>
              <Text style={styles.colValue}>{c.value}</Text>
            </View>
          ))}
        </View>
        {showActions ? (
          <View style={styles.actions}>
            <Pressable onPress={onShowQR} accessibilityRole="button" style={[styles.btn, styles.btnQr]}>
              <Text style={styles.btnQrTxt}>Xem mã QR vào sân</Text>
            </Pressable>
            <Pressable onPress={onCancel} accessibilityRole="button" style={[styles.btn, styles.btnCancel]}>
              <Text style={styles.btnCancelTxt}>Hủy</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: color.surface, borderRadius: radius.card, overflow: 'hidden', marginBottom: 14, ...shadow.card },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 14 },
  sport: { color: color.volt, fontSize: 12, fontWeight: '800' },
  code: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600' },
  body: { padding: 18 },
  venue: { ...font.section, color: color.ink },
  cols: { flexDirection: 'row', gap: 20, marginTop: 12 },
  colLabel: { ...font.tiny, color: color.textMuted, fontWeight: '600' },
  colValue: { fontSize: 14, fontWeight: '700', color: color.ink, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  btn: { borderRadius: radius.sm, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  btnQr: { flex: 1, backgroundColor: color.volt },
  btnQrTxt: { fontSize: 13, fontWeight: '800', color: color.ink },
  btnCancel: { paddingHorizontal: 16, backgroundColor: color.surface, borderWidth: 1, borderColor: color.line },
  btnCancelTxt: { fontSize: 13, fontWeight: '700', color: color.ink },
});

export const BookingCard = memo(BookingCardBase);
