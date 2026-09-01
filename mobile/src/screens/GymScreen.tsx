import { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { color, font, radius, space, shadow } from '../theme/tokens';
import { membership, dayPass, clubPass, gymClasses } from '../data/mock';
import { CLUB_CARD_PROPS } from '../data/passPresets';
import { MemberCard } from '../components/membership/MemberCard';
import { DayPassCard } from '../components/membership/DayPassCard';
import { ClassCard } from '../components/cards/ClassCard';
import { SegmentedTabs, SegOption } from '../components/chips/SegmentedTabs';
import { usePasses } from '../state/PassContext';
import { GymMode } from '../types';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Gym'>;

const MODES: SegOption<GymMode>[] = [
  { key: 'package', label: 'Gói tập' },
  { key: 'daypass', label: 'Vé ngày' },
];

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, last && styles.infoRowLast]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function GymScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<RouteProp<RootStackParamList, 'Gym'>>();
  const { active } = usePasses();
  const [mode, setMode] = useState<GymMode>(route.params?.mode ?? 'package');

  // Về từ luồng thanh toán với { mode: 'daypass' } → mở đúng tab vé ngày.
  useEffect(() => {
    if (route.params?.mode) setMode(route.params.mode);
  }, [route.params?.mode]);

  const isPackage = mode === 'package';

  // Vé ngày: hiển thị vé đã kích hoạt (ưu tiên cá nhân, kế đến CLB), nếu chưa mua thì trạng thái đặt vé.
  const showClub = active.club && !active.personal;
  const dpPass = showClub ? clubPass : dayPass;
  const dpActive = active.personal || active.club;
  const clubProps = showClub ? CLUB_CARD_PROPS : {};

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ padding: space.xl, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
      <SegmentedTabs value={mode} options={MODES} onChange={setMode} />
      <View style={{ height: 18 }} />

      {isPackage ? (
        <MemberCard membership={membership} />
      ) : (
        <DayPassCard
          pass={dpPass}
          status={dpActive ? 'active' : 'booking'}
          onBook={() => nav.navigate('DayPassPayment', { kind: 'personal' })}
          {...clubProps}
        />
      )}

      {isPackage ? (
        <>
          <Text style={styles.section}>Gói của bạn</Text>
          <View style={styles.infoCard}>
            <InfoRow label="Loại gói" value={membership.packageType} />
            <InfoRow label="Lượt check-in tháng này" value={membership.checkinsThisMonth + ' buổi'} />
            <InfoRow label="Chi nhánh" value={membership.branch} last />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.section}>Chi tiết vé</Text>
          <View style={styles.infoCard}>
            <InfoRow label="Loại vé" value={showClub ? 'Vé câu lạc bộ' : 'Vé ngày cá nhân'} />
            <InfoRow label="Trạng thái" value={dpActive ? 'Đã đăng ký' : 'Chưa đặt vé'} />
            <InfoRow label="Giá vé" value={dpPass.priceLabel} />
            <InfoRow label="Hiệu lực" value={'Trong ngày · ' + dpPass.validDate} />
            <InfoRow label={showClub ? 'Buổi tập' : 'Chi nhánh'} value={dpPass.branch} last />
          </View>
        </>
      )}

      <Text style={styles.section}>Lớp hôm nay</Text>
      {gymClasses.map(c => <ClassCard key={c.id} item={c} onRegister={() => {}} />)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  section: { ...font.section, color: color.ink, marginTop: 24, marginBottom: 12 },
  infoCard: { backgroundColor: color.surface, borderRadius: radius.card, padding: 16, ...shadow.card },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#ECEAE5' },
  infoRowLast: { borderBottomWidth: 0, paddingBottom: 0 },
  infoLabel: { ...font.sub, color: color.textMuted, fontWeight: '600' },
  infoValue: { fontSize: 13.5, fontWeight: '700', color: color.ink },
});
