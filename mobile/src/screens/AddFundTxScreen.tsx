import { useState } from 'react';
import { View, Text, TextInput, Switch, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SegmentedTabs } from '../components/chips/SegmentedTabs';
import { Avatar } from '../components/primitives/Avatar';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { useClubFund } from '../state/ClubFundContext';
import { useNotifications } from '../state/NotificationContext';
import { clubMembers } from '../data/mock';
import { formatVnd } from '../utils/format';
import { RootStackParamList } from '../navigation/types';
import { color, font, radius, space, shadow } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Kind = 'in' | 'out';

// Chỉ giữ chữ số → số nguyên VND.
const toAmount = (s: string) => parseInt(s.replace(/\D/g, ''), 10) || 0;
const groupVnd = (n: number) => n.toLocaleString('vi-VN');

export default function AddFundTxScreen() {
  const nav = useNavigation<Nav>();
  const { clubId, name } = useRoute<RouteProp<RootStackParamList, 'AddFundTx'>>().params;
  const { addTx, addCollection } = useClubFund();
  const { addNotification } = useNotifications();

  const [kind, setKind] = useState<Kind>('out');
  const [label, setLabel] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [split, setSplit] = useState(true);

  const amount = toAmount(amountStr);
  const memberCount = clubMembers.length;
  const perMember = memberCount > 0 ? Math.ceil(amount / memberCount / 1000) * 1000 : 0;  // làm tròn lên 1.000₫
  const canSave = label.trim().length >= 2 && amount > 0;

  const save = () => {
    if (!canSave) return;
    if (kind === 'in') {
      // Khoản THU → tạo đợt thu (theo dõi người đóng) + gửi thông báo kèm mức cần nộp.
      const due = split ? perMember : amount;
      const cid = addCollection({ clubId, label: label.trim(), amount, perMember: due });
      addNotification({
        kind: 'update',
        emoji: '💸',
        title: `Khoản thu mới · ${name}`,
        body: `${label.trim()} — mỗi hội viên nộp ${formatVnd(due)}`,
        time: 'Vừa xong',
        unread: true,
        due: { club: name, label: label.trim(), amount: due, collectionId: cid },
      });
    } else {
      addTx({ label: label.trim(), amount, kind: 'out' });
    }
    nav.goBack();
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ padding: space.xl, paddingBottom: 24 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.club}>{name}</Text>

        <Text style={styles.label}>Loại khoản</Text>
        <SegmentedTabs
          value={kind}
          options={[{ key: 'out', label: 'Khoản chi' }, { key: 'in', label: 'Khoản thu' }]}
          onChange={setKind}
        />

        <Text style={styles.label}>Nội dung</Text>
        <TextInput
          style={styles.input}
          value={label}
          onChangeText={setLabel}
          placeholder={kind === 'out' ? 'VD: Thuê sân giao lưu T7' : 'VD: Đóng quỹ tháng 9'}
          placeholderTextColor={color.textFaint}
          maxLength={60}
        />

        <Text style={styles.label}>Số tiền (₫)</Text>
        <TextInput
          style={styles.input}
          value={amountStr ? groupVnd(amount) : ''}
          onChangeText={setAmountStr}
          placeholder="0"
          placeholderTextColor={color.textFaint}
          keyboardType="number-pad"
        />

        {/* Tự chia mức dự kiến đóng cho hội viên */}
        <View style={styles.splitHead}>
          <View style={{ flex: 1 }}>
            <Text style={styles.splitTitle}>Chia đều cho hội viên</Text>
            <Text style={styles.splitSub}>Tính mức dự kiến mỗi hội viên đóng ({memberCount} người)</Text>
          </View>
          <Switch value={split} onValueChange={setSplit} trackColor={{ true: color.ink, false: color.line }} thumbColor={split ? color.volt : '#fff'} />
        </View>

        {split ? (
          <>
            <View style={styles.perCard}>
              <Text style={styles.perLabel}>Mỗi hội viên dự kiến đóng</Text>
              <Text style={styles.perValue}>{formatVnd(perMember)}</Text>
              <Text style={styles.perNote}>{formatVnd(amount)} ÷ {memberCount} người · làm tròn lên 1.000₫</Text>
            </View>

            <Text style={styles.label}>Danh sách dự kiến</Text>
            <View style={styles.card}>
              {clubMembers.map((m, i) => (
                <View key={m.id} style={[styles.row, i < clubMembers.length - 1 && styles.divider]}>
                  <Avatar label={m.initials} size={34} />
                  <Text style={styles.mName}>{m.name}</Text>
                  <Text style={styles.mAmt}>{formatVnd(perMember)}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label={kind === 'out' ? 'Lưu khoản chi' : 'Lưu khoản thu'}
          onPress={save}
          disabled={!canSave}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  club: { ...font.sub, color: color.textMuted, fontWeight: '700', marginTop: 4 },
  label: { ...font.section, color: color.ink, marginTop: 22, marginBottom: 10 },
  input: { backgroundColor: color.surface, borderRadius: radius.md, paddingHorizontal: 15, paddingVertical: 13, ...font.body, color: color.ink, ...shadow.card },

  splitHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 24 },
  splitTitle: { ...font.cardTitle, color: color.ink },
  splitSub: { ...font.sub, color: color.textMuted, marginTop: 2 },

  perCard: { backgroundColor: '#EEF7D0', borderRadius: radius.card, padding: 16, marginTop: 14 },
  perLabel: { ...font.sub, color: color.textMuted, fontWeight: '600' },
  perValue: { fontSize: 26, fontWeight: '800', color: color.ink, marginTop: 4 },
  perNote: { ...font.sub, color: color.textMuted, marginTop: 4 },

  card: { backgroundColor: color.surface, borderRadius: radius.card, paddingHorizontal: 16, ...shadow.card },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#ECEAE5' },
  mName: { flex: 1, fontSize: 14, fontWeight: '700', color: color.ink },
  mAmt: { fontSize: 14, fontWeight: '800', color: color.ink },

  footer: { paddingHorizontal: space.xl, paddingTop: 12, paddingBottom: 24, backgroundColor: color.surface, borderTopWidth: 1, borderTopColor: color.line },
});
