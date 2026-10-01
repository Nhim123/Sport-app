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

type PayMethod = 'bank' | 'cash';
interface Method { key: PayMethod; label: string; sub: string; icon: AvatarIcon }
const METHODS: Method[] = [
  { key: 'bank', label: 'Chuyển khoản ngân hàng', sub: 'Chuyển tới tài khoản của chủ sân/CLB', icon: 'card-outline' },
  { key: 'cash', label: 'Tiền mặt tại sân', sub: 'Trả trực tiếp khi đến sân/buổi sinh hoạt', icon: 'cash-outline' },
];
// Thông tin nhận chuyển khoản (demo). Backend thật sẽ trả theo từng sân/CLB.
const BANK = { name: 'Vietcombank', account: '0071000456789' };

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
  const [method, setMethod] = useState<PayMethod>('bank');

  const sched = order.schedule;
  const needPick = !order.fixedTime && !!sched;   // vé: chọn giờ tại đây; đặt sân: giờ cố định
  const [slotId, setSlotId] = useState<string | null>(
    () => (needPick ? sched!.slots.find(s => s.state === 'free')?.id ?? null : null),
  );

  const selectedSlot = sched?.slots.find(s => s.id === slotId);
  const chosenRange =
    order.fixedTime ??
    (selectedSlot ? `${selectedSlot.time}–${addMinutes(selectedSlot.time, sched!.sessionMinutes)}` : null);
  const hasTime = !!order.fixedTime || !!sched;     // đơn có khái niệm "giờ" (đặt sân/vé) hay không (đóng quỹ)
  const canPay = needPick ? !!chosenRange : true;   // đóng quỹ: không cần chọn giờ → cho phép luôn

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ padding: space.xl, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{order.title}</Text>

        <Text style={styles.section}>Thông tin</Text>
        <View style={styles.card}>
          <Row label={order.itemLabel} value={order.itemValue} last={!order.address} />
          {order.address ? <Row label="Địa chỉ" value={order.address} last /> : null}
        </View>

        {hasTime ? (
        <>
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
        </>
        ) : null}
        {needPick ? (
          <>
            <Text style={styles.pickCaption}>Chọn khung giờ theo giờ sân quy định</Text>
            <View style={styles.slotWrap}>
              <SlotGrid slots={sched!.slots} selectedId={slotId} onSelect={setSlotId} />
            </View>
          </>
        ) : null}

        <Text style={styles.section}>Hình thức thanh toán</Text>
        <Text style={styles.leadNote}>
          Thanh toán gián tiếp — chủ sân/CLB sẽ xác nhận thủ công sau khi nhận được tiền.
        </Text>
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
                <View style={{ flex: 1 }}>
                  <Text style={styles.methodTxt}>{m.label}</Text>
                  <Text style={styles.methodSub}>{m.sub}</Text>
                </View>
                <Ionicons
                  name={selected ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={selected ? color.voltDark : color.navIdle}
                />
              </Pressable>
            );
          })}
        </View>

        {/* Chi tiết theo hình thức */}
        {method === 'bank' ? (
          <View style={[styles.card, { marginTop: 12 }]}>
            <Row label="Ngân hàng" value={BANK.name} />
            <Row label="Số tài khoản" value={BANK.account} />
            <Row label="Chủ tài khoản" value={order.brand} />
            <Row label="Nội dung CK" value={order.code} />
            <Row label="Số tiền" value={order.priceLabel} last />
          </View>
        ) : (
          <View style={[styles.noteCard, { marginTop: 12 }]}>
            <Ionicons name="cash-outline" size={18} color={color.ink} />
            <Text style={styles.noteTxt}>
              Trả trực tiếp cho chủ sân/CLB khi đến. Đơn có hiệu lực sau khi được xác nhận.
            </Text>
          </View>
        )}

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Tổng thanh toán</Text>
          <Text style={styles.totalValue}>{order.priceLabel}</Text>
        </View>
      </ScrollView>

      <BottomBar
        summary={chosenRange ? order.date + ' · ' + chosenRange : (needPick ? 'Chọn khung giờ' : order.itemValue)}
        priceLabel={order.priceLabel}
        ctaLabel={method === 'bank' ? 'Tôi đã chuyển khoản' : 'Gửi yêu cầu'}
        ctaDisabled={!canPay}
        onPress={() => nav.navigate('DayPassConfirm', { order: { ...order, fixedTime: chosenRange ?? undefined, payMethod: method } })}
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
  leadNote: { ...font.sub, color: color.textMuted, marginTop: -4, marginBottom: 12, lineHeight: 18 },
  method: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 },
  methodDivider: { borderBottomWidth: 1, borderBottomColor: '#ECEAE5' },
  methodTxt: { fontSize: 14, fontWeight: '700', color: color.ink },
  methodSub: { ...font.sub, color: color.textMuted, marginTop: 2 },
  noteCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#EEF7D0', borderRadius: radius.card, padding: 14 },
  noteTxt: { flex: 1, ...font.sub, color: color.ink, lineHeight: 18 },
  totalCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#EEF7D0', borderRadius: radius.card, padding: 16, marginTop: 20,
  },
  totalLabel: { ...font.cardTitle, color: color.ink },
  totalValue: { fontSize: 20, fontWeight: '800', color: color.ink },
});
