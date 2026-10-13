import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { color, font, radius, space, shadow } from '../theme/tokens';
import { RootStackParamList } from '../navigation/types';
import { usePasses } from '../state/PassContext';
import { useClubFund } from '../state/ClubFundContext';
import { PrimaryButton } from '../components/buttons/PrimaryButton';

type Nav = NativeStackNavigationProp<RootStackParamList, 'DayPassConfirm'>;

/**
 * Trạng thái đơn (thanh toán gián tiếp): đơn tạo ra ở trạng thái "Chờ xác nhận",
 * chủ sân/CLB xác nhận thủ công sau khi nhận tiền → mới có hiệu lực.
 */
export default function PaymentStatusScreen() {
  const nav = useNavigation<Nav>();
  const { order } = useRoute<RouteProp<RootStackParamList, 'DayPassConfirm'>>().params;
  const { purchase } = usePasses();
  const { setPaid } = useClubFund();
  const isPass = !!order.passKind;
  const methodLabel = order.payMethod === 'cash' ? 'Tiền mặt tại sân' : 'Chuyển khoản ngân hàng';

  const [confirmed, setConfirmed] = useState(false);

  const finish = () => {
    if (order.passKind) {
      purchase(order.passKind);                 // vé chỉ kích hoạt sau khi được xác nhận
      nav.navigate('Gym', { mode: 'daypass' });
    } else {
      nav.navigate('MainTabs', { screen: 'Bookings' });
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.center}>
        <View style={[styles.badge, confirmed ? styles.badgeDone : styles.badgePending]}>
          <Ionicons name={confirmed ? 'checkmark' : 'time-outline'} size={44} color={color.ink} />
        </View>
        <Text style={styles.title}>{confirmed ? 'Đã xác nhận' : 'Chờ xác nhận'}</Text>
        <Text style={styles.sub}>
          {confirmed
            ? `${order.title} đã được chủ sân/CLB xác nhận`
            : `${order.title} đang chờ chủ sân/CLB xác nhận thanh toán`}
        </Text>

        <View style={styles.card}>
          <Row label="Đơn vị" value={order.brand} />
          {order.fixedTime ? <Row label="Thời gian" value={`${order.date} · ${order.fixedTime}`} /> : null}
          <Row label="Hình thức" value={methodLabel} />
          <Row label={isPass ? 'Mã vé' : 'Mã đặt'} value={order.code} code />
          <Row label="Số tiền" value={order.priceLabel} />
          <Row
            label="Trạng thái"
            value={confirmed ? '✅ Đã xác nhận' : '⏳ Chờ xác nhận'}
            last
          />
        </View>
      </View>

      <View style={styles.footer}>
        {confirmed ? (
          <>
            <Text style={styles.hint}>
              {isPass ? 'Xem mã QR vào cửa ở mục “Vé ngày” trên thẻ hội viên.' : 'Xem chi tiết trong “Lịch đặt của tôi”.'}
            </Text>
            <PrimaryButton label={isPass ? 'Về thẻ hội viên' : 'Xem lịch đặt'} onPress={finish} />
          </>
        ) : (
          <>
            <Text style={styles.hint}>
              {order.payMethod === 'cash'
                ? 'Đến sân trả tiền mặt cho chủ sân/CLB; họ sẽ xác nhận để đơn có hiệu lực.'
                : 'Sau khi bạn chuyển khoản, chủ sân/CLB sẽ đối chiếu và xác nhận đơn.'}
            </Text>
            {/* Mô phỏng thao tác duyệt của chủ sân/CLB */}
            <PrimaryButton
              label="Chủ sân/CLB xác nhận (demo)"
              onPress={() => {
                // Nộp quỹ được xác nhận → đánh dấu người nộp (hiện tại: Minh Khang · u1) đã đóng.
                if (order.collectionId) setPaid(order.collectionId, 'u1', true);
                setConfirmed(true);
              }}
            />
            <Pressable onPress={() => nav.navigate('MainTabs', { screen: 'Home' })} accessibilityRole="button" style={styles.laterBtn}>
              <Text style={styles.laterTxt}>Để sau</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

function Row({ label, value, code, last }: { label: string; value: string; code?: boolean; last?: boolean }) {
  return (
    <View style={[styles.cardRow, last && styles.cardRowLast]}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={[styles.cardValue, code && styles.code]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg, padding: space.xl, justifyContent: 'space-between' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center' },
  badgePending: { backgroundColor: color.lineSoft, borderWidth: 2, borderColor: color.line },
  badgeDone: { backgroundColor: color.volt },
  title: { ...font.h1, color: color.ink, marginTop: 22 },
  sub: { ...font.body, color: color.textMuted, marginTop: 6, textAlign: 'center' },
  card: { alignSelf: 'stretch', backgroundColor: color.surface, borderRadius: radius.card, padding: 16, marginTop: 28, ...shadow.card },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#ECEAE5' },
  cardRowLast: { borderBottomWidth: 0 },
  cardLabel: { ...font.sub, color: color.textMuted, fontWeight: '600' },
  cardValue: { flex: 1, textAlign: 'right', marginLeft: 16, fontSize: 13.5, fontWeight: '700', color: color.ink },
  code: { letterSpacing: 1.5 },
  footer: { gap: 12 },
  hint: { ...font.sub, color: color.textFaint, textAlign: 'center' },
  laterBtn: { alignItems: 'center', paddingVertical: 6 },
  laterTxt: { ...font.sub, color: color.textMuted, fontWeight: '700' },
});
