import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { color, font, radius, space, shadow } from '../theme/tokens';
import { RootStackParamList } from '../navigation/types';
import { addMinutes, formatOpenWindow } from '../utils/format';
import { AvatarIcon } from '../components/primitives/Avatar';
import { SlotGrid } from '../components/booking/SlotGrid';
import { BottomBar } from '../components/booking/BottomBar';

type Nav = NativeStackNavigationProp<RootStackParamList, 'DayPassPayment'>;

interface Method { key: string; label: string; icon: AvatarIcon }
const METHODS: Method[] = [
  { key: 'wallet', label: 'Ví điện tử (MoMo/ZaloPay)', icon: 'wallet-outline' },
  { key: 'card', label: 'Thẻ ngân hàng', icon: 'card-outline' },
  { key: 'counter', label: 'Thanh toán tại quầy', icon: 'cash-outline' },
];

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

/** Màn thanh toán chung cho mọi tính năng (đặt sân / vé ngày / vé CLB). */
export default function PaymentScreen() {
  const nav = useNavigation<Nav>();
  const { order } = useRoute<RouteProp<RootStackParamList, 'DayPassPayment'>>().params;
  const [method, setMethod] = useState('wallet');

  const sched = order.schedule;
  const needPick = !order.fixedTime && !!sched;   // vé: chọn giờ tại đây; đặt sân: giờ cố định
  const [slotId, setSlotId] = useState<string | null>(
    () => (needPick ? sched!.slots.find(s => s.state === 'free')?.id ?? null : null),
  );

  const selectedSlot = sched?.slots.find(s => s.id === slotId);
  const chosenRange =
    order.fixedTime ??
    (selectedSlot ? `${selectedSlot.time}–${addMinutes(selectedSlot.time, sched!.sessionMinutes)}` : null);
  const canPay = !!chosenRange;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ padding: space.xl, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{order.title}</Text>

        <Text style={styles.section}>Thông tin</Text>
        <View style={styles.card}>
          <Row label={order.itemLabel} value={order.itemValue} last={!order.address} />
          {order.address ? <Row label="Địa chỉ" value={order.address} last /> : null}
        </View>

        <Text style={styles.section}>Giờ đặt</Text>
        <View style={styles.card}>
          <Row label="Ngày" value={order.date} />
          {needPick ? (
            <>
              <Row label="Khung mở" value={formatOpenWindow(sched!)} />
              <Row label="Đã chọn" value={chosenRange ? order.date + ' · ' + chosenRange : 'Chưa chọn giờ'} last />
            </>
          ) : (
            <Row label="Giờ" value={order.fixedTime ?? '—'} last />
          )}
        </View>
        {needPick ? (
          <>
            <Text style={styles.pickCaption}>Chọn khung giờ theo giờ sân quy định</Text>
            <View style={styles.slotWrap}>
              <SlotGrid slots={sched!.slots} selectedId={slotId} onSelect={setSlotId} />
            </View>
          </>
        ) : null}

        <Text style={styles.section}>Phương thức thanh toán</Text>
        <View style={styles.card}>
          {METHODS.map((m, i) => {
            const selected = m.key === method;
            return (
              <Pressable
                key={m.key}
                onPress={() => setMethod(m.key)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={[styles.method, i < METHODS.length - 1 && styles.methodDivider]}
              >
                <Ionicons name={m.icon} size={20} color={color.ink} />
                <Text style={styles.methodTxt}>{m.label}</Text>
                <Ionicons
                  name={selected ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={selected ? color.voltDark : color.navIdle}
                />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Tổng thanh toán</Text>
          <Text style={styles.totalValue}>{order.priceLabel}</Text>
        </View>
      </ScrollView>

      <BottomBar
        summary={chosenRange ? order.date + ' · ' + chosenRange : 'Chọn khung giờ'}
        priceLabel={order.priceLabel}
        ctaLabel="Thanh toán"
        ctaDisabled={!canPay}
        onPress={() => nav.navigate('DayPassConfirm', { order: { ...order, fixedTime: chosenRange ?? undefined } })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  title: { ...font.h2, color: color.ink, marginTop: 4 },
  section: { ...font.section, color: color.ink, marginTop: 22, marginBottom: 12 },
  pickCaption: { ...font.sub, color: color.textMuted, fontWeight: '600', marginTop: 14, marginBottom: 10 },
  slotWrap: { backgroundColor: color.surface, borderRadius: radius.card, padding: 16, ...shadow.card },
  card: { backgroundColor: color.surface, borderRadius: radius.card, paddingHorizontal: 16, ...shadow.card },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#ECEAE5' },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: { ...font.sub, color: color.textMuted, fontWeight: '600' },
  rowValue: { flex: 1, textAlign: 'right', marginLeft: 16, fontSize: 13.5, fontWeight: '700', color: color.ink },
  method: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  methodDivider: { borderBottomWidth: 1, borderBottomColor: '#ECEAE5' },
  methodTxt: { flex: 1, fontSize: 14, fontWeight: '700', color: color.ink },
  totalCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#EEF7D0', borderRadius: radius.card, padding: 16, marginTop: 20,
  },
  totalLabel: { ...font.cardTitle, color: color.ink },
  totalValue: { fontSize: 20, fontWeight: '800', color: color.ink },
});
