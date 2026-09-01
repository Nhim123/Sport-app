import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { color, font, radius, space, shadow } from '../theme/tokens';
import { RootStackParamList } from '../navigation/types';
import { passOf, passLabel } from '../data/passPresets';
import { AvatarIcon } from '../components/primitives/Avatar';
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

export default function DayPassPaymentScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteProp<RootStackParamList, 'DayPassPayment'>>();
  const kind = route.params.kind;
  const pass = passOf(kind);
  const [method, setMethod] = useState('wallet');

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ padding: space.xl, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.section}>Thông tin sân</Text>
        <View style={styles.card}>
          <Row label="Loại vé" value={passLabel(kind)} />
          <Row label={kind === 'club' ? 'Sân' : 'Cơ sở'} value={pass.venue} />
          <Row label="Địa chỉ" value={pass.address} last />
        </View>

        <Text style={styles.section}>Giờ đặt</Text>
        <View style={styles.card}>
          <Row label="Thời gian" value={pass.bookingTime} />
          <Row label="Hiệu lực" value={'Trong ngày · ' + pass.validDate} last />
        </View>

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
          <Text style={styles.totalValue}>{pass.priceLabel}</Text>
        </View>
      </ScrollView>

      <BottomBar
        summary="Thanh toán an toàn"
        priceLabel={pass.priceLabel}
        ctaLabel="Thanh toán"
        onPress={() => nav.navigate('DayPassConfirm', { kind })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  section: { ...font.section, color: color.ink, marginTop: 8, marginBottom: 12 },
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
