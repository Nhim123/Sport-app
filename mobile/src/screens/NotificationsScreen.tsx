import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { useNotifications } from '../state/NotificationContext';
import { formatVnd } from '../utils/format';
import { RootStackParamList } from '../navigation/types';
import { AppNotification } from '../types';
import { color, font, radius, space, shadow } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function NotiRow({ n, onPay }: { n: AppNotification; onPay: (n: AppNotification) => void }) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}><Text style={styles.emoji}>{n.emoji}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>{n.title}</Text>
        <Text style={styles.body} numberOfLines={2}>{n.body}</Text>
        <Text style={styles.time}>{n.time}</Text>
        {n.due ? (
          <Pressable onPress={() => onPay(n)} accessibilityRole="button" style={styles.payBtn}>
            <Text style={styles.payTxt}>Nộp tiền · {formatVnd(n.due.amount)}</Text>
          </Pressable>
        ) : null}
      </View>
      {n.unread ? <View style={styles.dot} /> : null}
    </View>
  );
}

export default function NotificationsScreen() {
  const nav = useNavigation<Nav>();
  const { items } = useNotifications();
  const updates = items.filter(n => n.kind === 'update');
  const programs = items.filter(n => n.kind === 'program');

  // Bấm "Nộp tiền" → màn thanh toán (gián tiếp, chủ hội xác nhận).
  const pay = (n: AppNotification) => {
    if (!n.due) return;
    nav.navigate('DayPassPayment', {
      order: {
        purpose: 'club',
        title: 'Nộp quỹ: ' + n.due.label,
        brand: n.due.club,
        itemLabel: 'Khoản đóng',
        itemValue: n.due.label,
        date: 'Tháng này',
        priceLabel: formatVnd(n.due.amount),
        code: 'QUY-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
        collectionId: n.due.collectionId,
      },
    });
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: space.xl, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.section}>Cập nhật mới</Text>
        <View style={styles.card}>
          {updates.map(n => <NotiRow key={n.id} n={n} onPay={pay} />)}
        </View>

        <Text style={styles.section}>Chương trình câu lạc bộ</Text>
        <View style={styles.card}>
          {programs.map(n => <NotiRow key={n.id} n={n} onPay={pay} />)}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { ...font.section, color: color.ink, marginTop: 14, marginBottom: 12 },
  card: { backgroundColor: color.surface, borderRadius: radius.card, paddingHorizontal: 14, ...shadow.card },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#ECEAE5' },
  iconWrap: { width: 42, height: 42, borderRadius: 14, backgroundColor: color.bg, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 20 },
  title: { fontSize: 14, fontWeight: '800', color: color.ink },
  body: { ...font.sub, color: color.textMuted, marginTop: 2, lineHeight: 18 },
  time: { ...font.tiny, color: color.textFaint, marginTop: 4, fontWeight: '600' },
  payBtn: { alignSelf: 'flex-start', backgroundColor: color.ink, borderRadius: radius.chip, paddingHorizontal: 14, paddingVertical: 8, marginTop: 10 },
  payTxt: { color: color.volt, fontSize: 13, fontWeight: '800' },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: color.voltDark, marginLeft: 6, marginTop: 6 },
});
