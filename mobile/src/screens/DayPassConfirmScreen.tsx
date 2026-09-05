import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { color, font, radius, space, shadow } from '../theme/tokens';
import { RootStackParamList } from '../navigation/types';
import { usePasses } from '../state/PassContext';
import { PrimaryButton } from '../components/buttons/PrimaryButton';

type Nav = NativeStackNavigationProp<RootStackParamList, 'DayPassConfirm'>;

/** Màn xác nhận thanh toán chung — điều hướng về đúng chỗ theo loại đơn. */
export default function PaymentSuccessScreen() {
  const nav = useNavigation<Nav>();
  const { order } = useRoute<RouteProp<RootStackParamList, 'DayPassConfirm'>>().params;
  const { purchase } = usePasses();
  const isPass = !!order.passKind;

  const finish = () => {
    if (order.passKind) {
      purchase(order.passKind);                 // đánh dấu vé đã mua
      nav.navigate('Gym', { mode: 'daypass' }); // vé → về thẻ hội viên, mở tab vé ngày
    } else {
      nav.navigate('MainTabs', { screen: 'Bookings' }); // đặt sân → về Lịch đặt
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.center}>
        <View style={styles.badge}>
          <Ionicons name="checkmark" size={44} color={color.ink} />
        </View>
        <Text style={styles.title}>Thanh toán thành công</Text>
        <Text style={styles.sub}>{order.title} đã được xác nhận</Text>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Đơn vị</Text>
            <Text style={styles.cardValue}>{order.brand}</Text>
          </View>
          {order.fixedTime ? (
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Thời gian</Text>
              <Text style={styles.cardValue}>{order.date} · {order.fixedTime}</Text>
            </View>
          ) : null}
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>{isPass ? 'Mã vé' : 'Mã đặt'}</Text>
            <Text style={[styles.cardValue, styles.code]}>{order.code}</Text>
          </View>
          <View style={[styles.cardRow, styles.cardRowLast]}>
            <Text style={styles.cardLabel}>Đã thanh toán</Text>
            <Text style={styles.cardValue}>{order.priceLabel}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.hint}>
          {isPass
            ? 'Xem mã QR vào cửa ở mục “Vé ngày” trên thẻ hội viên.'
            : 'Xem chi tiết trong mục “Lịch đặt của tôi”.'}
        </Text>
        <PrimaryButton label={isPass ? 'Về thẻ hội viên' : 'Xem lịch đặt'} onPress={finish} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg, padding: space.xl, justifyContent: 'space-between' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: { width: 84, height: 84, borderRadius: 42, backgroundColor: color.volt, alignItems: 'center', justifyContent: 'center' },
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
});
