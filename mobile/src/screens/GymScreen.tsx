import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { color, font, radius, space, shadow } from '../theme/tokens';
import { membership, dayPass, gymClasses } from '../data/mock';
import { MemberCard } from '../components/membership/MemberCard';
import { DayPassCard } from '../components/membership/DayPassCard';
import { ClassCard } from '../components/cards/ClassCard';
import { SegmentedTabs, SegOption } from '../components/chips/SegmentedTabs';
import { GymMode, DayPassStatus } from '../types';

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
  const [mode, setMode] = useState<GymMode>('package');
  const [passStatus, setPassStatus] = useState<DayPassStatus>('booking');
  const isPackage = mode === 'package';

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ padding: space.xl, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
      <SegmentedTabs value={mode} options={MODES} onChange={setMode} />
      <View style={{ height: 18 }} />

      {isPackage ? (
        <MemberCard membership={membership} />
      ) : (
        <DayPassCard pass={dayPass} status={passStatus} onBook={() => setPassStatus('active')} />
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
            <InfoRow label="Trạng thái" value={passStatus === 'active' ? 'Đã đăng ký' : 'Chưa đặt vé'} />
            <InfoRow label="Giá vé" value={dayPass.priceLabel} />
            <InfoRow label="Hiệu lực" value={'Trong ngày · ' + dayPass.validDate} />
            <InfoRow label="Lượt vào" value={dayPass.entriesLeft + ' lượt'} />
            <InfoRow label="Chi nhánh" value={dayPass.branch} last />
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
