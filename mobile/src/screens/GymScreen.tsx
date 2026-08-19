import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { color, font, radius, space, shadow } from '../theme/tokens';
import { membership, gymClasses } from '../data/mock';
import { MemberCard } from '../components/membership/MemberCard';
import { ClassCard } from '../components/cards/ClassCard';
import { useCheckIn } from '../hooks/useCheckIn';

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, last && styles.infoRowLast]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function GymScreen() {
  const { checked, toggle } = useCheckIn();
  return (
    <ScrollView style={styles.root} contentContainerStyle={{ padding: space.xl, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
      <MemberCard membership={membership} />

      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ selected: checked }}
        style={[styles.checkin, checked ? styles.checkedBg : styles.idleBg]}
      >
        <Text style={[styles.checkinTxt, { color: checked ? '#5A7A10' : color.ink }]}>
          {checked ? '✓ Đã check-in · ' + membership.branch : 'Chạm để check-in vào phòng'}
        </Text>
      </Pressable>

      <Text style={styles.section}>Gói của bạn</Text>
      <View style={styles.infoCard}>
        <InfoRow label="Loại gói" value={membership.packageType} />
        <InfoRow label="Lượt check-in tháng này" value={membership.checkinsThisMonth + ' buổi'} />
        <InfoRow label="Chi nhánh" value={membership.branch} last />
      </View>

      <Text style={styles.section}>Lớp hôm nay</Text>
      {gymClasses.map(c => <ClassCard key={c.id} item={c} onRegister={() => {}} />)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  checkin: { borderRadius: radius.md, paddingVertical: 17, alignItems: 'center', marginTop: 22 },
  idleBg: { backgroundColor: color.volt },
  checkedBg: { backgroundColor: '#E7F4C4' },
  checkinTxt: { ...font.cardTitle, fontWeight: '800' },
  section: { ...font.section, color: color.ink, marginTop: 24, marginBottom: 12 },
  infoCard: { backgroundColor: color.surface, borderRadius: radius.card, padding: 16, ...shadow.card },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#ECEAE5' },
  infoRowLast: { borderBottomWidth: 0, paddingBottom: 0 },
  infoLabel: { ...font.sub, color: color.textMuted, fontWeight: '600' },
  infoValue: { fontSize: 13.5, fontWeight: '700', color: color.ink },
});
