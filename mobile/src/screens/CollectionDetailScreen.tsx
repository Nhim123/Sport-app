import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Avatar } from '../components/primitives/Avatar';
import { useClubFund } from '../state/ClubFundContext';
import { formatVnd } from '../utils/format';
import { RootStackParamList } from '../navigation/types';
import { color, font, radius, space, shadow } from '../theme/tokens';

/** Chi tiết đợt thu: danh sách ai đã/chưa đóng; chủ hội chạm để đánh dấu. */
export default function CollectionDetailScreen() {
  const { collectionId } = useRoute<RouteProp<RootStackParamList, 'CollectionDetail'>>().params;
  const { collectionById, setPaid } = useClubFund();
  const col = collectionById(collectionId);

  if (!col) {
    return (
      <Screen><View style={styles.empty}><Text style={styles.emptyTxt}>Không tìm thấy đợt thu.</Text></View></Screen>
    );
  }

  const paid = col.payers.filter(p => p.paid);
  const collected = paid.length * col.perMember;
  const target = col.payers.length * col.perMember;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: space.xl, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{col.label}</Text>
        <Text style={styles.sub}>Mức mỗi hội viên: {formatVnd(col.perMember)}</Text>

        <View style={styles.summary}>
          <View style={styles.sumCol}>
            <Text style={styles.sumValue}>{paid.length}/{col.payers.length}</Text>
            <Text style={styles.sumLabel}>Đã đóng</Text>
          </View>
          <View style={styles.sumDivider} />
          <View style={styles.sumCol}>
            <Text style={styles.sumValue}>{formatVnd(collected)}</Text>
            <Text style={styles.sumLabel}>Đã thu / {formatVnd(target)}</Text>
          </View>
        </View>

        <Text style={styles.section}>Danh sách hội viên</Text>
        <Text style={styles.hint}>Chạm để đánh dấu đã đóng / chưa đóng</Text>
        <View style={styles.card}>
          {col.payers.map((p, i) => (
            <Pressable
              key={p.memberId}
              onPress={() => setPaid(col.id, p.memberId, !p.paid)}
              style={[styles.row, i < col.payers.length - 1 && styles.divider]}
            >
              <Avatar label={p.initials} size={38} />
              <Text style={styles.name}>{p.name}</Text>
              {p.paid ? (
                <View style={styles.paidTag}>
                  <Ionicons name="checkmark-circle" size={16} color={color.ink} />
                  <Text style={styles.paidTxt}>Đã đóng</Text>
                </View>
              ) : (
                <Text style={styles.unpaidTxt}>Chưa đóng</Text>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...font.h2, color: color.ink, marginTop: 4 },
  sub: { ...font.sub, color: color.textMuted, marginTop: 4, fontWeight: '600' },
  summary: { flexDirection: 'row', alignItems: 'center', backgroundColor: color.surface, borderRadius: radius.card, padding: 16, marginTop: 18, ...shadow.card },
  sumCol: { flex: 1, alignItems: 'center' },
  sumDivider: { width: 1, alignSelf: 'stretch', backgroundColor: color.line, marginVertical: 2 },
  sumValue: { fontSize: 20, fontWeight: '800', color: color.ink },
  sumLabel: { ...font.sub, color: color.textMuted, marginTop: 3 },
  section: { ...font.section, color: color.ink, marginTop: 24, marginBottom: 4 },
  hint: { ...font.sub, color: color.textFaint, marginBottom: 12 },
  card: { backgroundColor: color.surface, borderRadius: radius.card, paddingHorizontal: 16, ...shadow.card },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#ECEAE5' },
  name: { flex: 1, fontSize: 14, fontWeight: '700', color: color.ink },
  paidTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: color.volt, borderRadius: radius.chip, paddingHorizontal: 10, paddingVertical: 5 },
  paidTxt: { fontSize: 12, fontWeight: '800', color: color.ink },
  unpaidTxt: { ...font.sub, color: color.textMuted, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTxt: { ...font.body, color: color.textMuted },
});
