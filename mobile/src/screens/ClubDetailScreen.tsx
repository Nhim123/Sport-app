import { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { color, grad, font, radius, space, shadow } from '../theme/tokens';
import { RootStackParamList } from '../navigation/types';
import { SegmentedTabs, SegOption } from '../components/chips/SegmentedTabs';
import { Avatar } from '../components/primitives/Avatar';
import { Tag } from '../components/primitives/Tag';
import { formatVnd } from '../utils/format';
import { getClub, clubFund, clubMembers, clubPrograms } from '../data/mock';
import { ClubTab, ClubViewerRole } from '../types';

const TABS: SegOption<ClubTab>[] = [
  { key: 'fund', label: 'Quỹ CLB' },
  { key: 'members', label: 'Thành viên' },
  { key: 'programs', label: 'Chương trình' },
];

export default function ClubDetailScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'ClubDetail'>>();
  const role: ClubViewerRole = getClub(params.id)?.myRole ?? 'member';
  const isOwner = role === 'owner';
  const [tab, setTab] = useState<ClubTab>('fund');

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ padding: space.xl, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
      <View style={[styles.roleChip, isOwner ? styles.roleOwner : styles.roleMember]}>
        <Ionicons name={isOwner ? 'shield-checkmark' : 'person'} size={14} color={isOwner ? color.ink : color.textMuted} />
        <Text style={[styles.roleTxt, { color: isOwner ? color.ink : color.textMuted }]}>
          {isOwner ? 'Bạn là Chủ hội — quản lý CLB' : 'Bạn là Hội viên'}
        </Text>
      </View>

      <SegmentedTabs value={tab} options={TABS} onChange={setTab} />
      <View style={{ height: 18 }} />

      {tab === 'fund' ? <FundView isOwner={isOwner} />
        : tab === 'members' ? <MembersView isOwner={isOwner} />
        : <ProgramsView isOwner={isOwner} />}
    </ScrollView>
  );
}

function PrimaryAction({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} style={styles.primaryBtn}>
      <Ionicons name={icon} size={16} color={color.volt} />
      <Text style={styles.primaryTxt}>{label}</Text>
    </Pressable>
  );
}

/* ---- Quỹ CLB ---- */
function FundView({ isOwner }: { isOwner: boolean }) {
  return (
    <>
      <LinearGradient colors={grad.dark} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fundCard}>
        <Text style={styles.fundLabel}>Số dư quỹ</Text>
        <Text style={styles.fundBalance}>{formatVnd(clubFund.balance)}</Text>
        <View style={styles.fundRow}>
          <View style={styles.fundCol}>
            <Text style={styles.fundSub}>Tổng thu</Text>
            <Text style={[styles.fundAmt, { color: color.volt }]}>+{formatVnd(clubFund.income)}</Text>
          </View>
          <View style={styles.fundCol}>
            <Text style={styles.fundSub}>Tổng chi</Text>
            <Text style={[styles.fundAmt, { color: '#FF8A7A' }]}>-{formatVnd(clubFund.expense)}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Chủ hội: thêm giao dịch · Hội viên: đóng quỹ */}
      {isOwner ? (
        <PrimaryAction icon="add-circle-outline" label="Thêm khoản thu / chi" />
      ) : (
        <View style={styles.dueCard}>
          <View style={styles.rowMid}>
            <Text style={styles.itemTitle}>Quỹ tháng 8</Text>
            <Text style={styles.itemSub}>Cần đóng 100.000₫</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Đóng quỹ" style={styles.dueBtn}>
            <Text style={styles.dueTxt}>Đóng quỹ</Text>
          </Pressable>
        </View>
      )}

      <Text style={styles.section}>Giao dịch gần đây</Text>
      <View style={styles.card}>
        {clubFund.txs.map((t, i) => (
          <View key={t.id} style={[styles.row, i < clubFund.txs.length - 1 && styles.divider]}>
            <View style={styles.rowMid}>
              <Text style={styles.itemTitle} numberOfLines={1}>{t.label}</Text>
              <Text style={styles.itemSub}>{t.date}</Text>
            </View>
            <Text style={[styles.amount, { color: t.kind === 'in' ? color.voltDark : color.danger }]}>
              {t.kind === 'in' ? '+' : '-'}{formatVnd(t.amount)}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

/* ---- Thành viên ---- */
const ROLE_VARIANT: Record<string, 'volt' | 'soft' | 'dark'> = {
  'Chủ nhiệm': 'volt', 'Quản lý': 'dark', 'Thành viên': 'soft',
};
function MembersView({ isOwner }: { isOwner: boolean }) {
  return (
    <>
      <View style={styles.sectionRow}>
        <Text style={styles.section}>{clubMembers.length} thành viên</Text>
        {isOwner ? <Pressable hitSlop={8}><Text style={styles.link}>Mời thành viên</Text></Pressable> : null}
      </View>
      <View style={styles.card}>
        {clubMembers.map((m, i) => (
          <View key={m.id} style={[styles.row, i < clubMembers.length - 1 && styles.divider]}>
            <Avatar label={m.initials} size={40} />
            <View style={[styles.rowMid, { marginLeft: 12 }]}>
              <Text style={styles.itemTitle}>{m.name}</Text>
              {m.note ? <Text style={styles.itemSub}>{m.note}</Text> : null}
            </View>
            <Tag label={m.role} variant={ROLE_VARIANT[m.role]} />
            {/* Chủ hội: quản lý từng thành viên */}
            {isOwner && m.role !== 'Chủ nhiệm' ? (
              <Ionicons name="ellipsis-vertical" size={16} color={color.navIdle} style={{ marginLeft: 8 }} />
            ) : null}
          </View>
        ))}
      </View>
      {!isOwner ? (
        <Pressable accessibilityRole="button" style={styles.leaveBtn}><Text style={styles.leaveTxt}>Rời câu lạc bộ</Text></Pressable>
      ) : null}
    </>
  );
}

/* ---- Chương trình ---- */
function ProgramsView({ isOwner }: { isOwner: boolean }) {
  return (
    <>
      <View style={styles.sectionRow}>
        <Text style={styles.section}>Sắp diễn ra</Text>
        {isOwner ? <Pressable hitSlop={8}><Text style={styles.link}>Tạo chương trình</Text></Pressable> : null}
      </View>
      {clubPrograms.map(p => {
        const full = p.joined >= p.capacity;
        return (
          <View key={p.id} style={styles.progCard}>
            <View style={styles.sectionRow}>
              <Text style={styles.progTitle} numberOfLines={1}>{p.title}</Text>
              <Tag label={p.fee ?? 'Miễn phí'} variant={p.fee ? 'volt' : 'soft'} />
            </View>
            <Text style={styles.itemSub}>🗓️ {p.date} · {p.time}</Text>
            <Text style={styles.itemSub}>📍 {p.place}</Text>
            <View style={styles.progFoot}>
              <Text style={styles.progJoin}>{p.joined}/{p.capacity} tham gia</Text>
              {isOwner ? (
                <Pressable accessibilityRole="button" accessibilityLabel="Quản lý" style={[styles.joinBtn, styles.manageBtn]}>
                  <Text style={styles.manageTxt}>Quản lý</Text>
                </Pressable>
              ) : (
                <Pressable disabled={full} accessibilityRole="button" style={[styles.joinBtn, full && styles.joinBtnOff]}>
                  <Text style={[styles.joinTxt, full && styles.joinTxtOff]}>{full ? 'Đã đầy' : 'Tham gia'}</Text>
                </Pressable>
              )}
            </View>
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  roleChip: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.chip, marginTop: 4 },
  roleOwner: { backgroundColor: color.volt },
  roleMember: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.line },
  roleTxt: { fontSize: 12.5, fontWeight: '800' },

  section: { ...font.section, color: color.ink, marginTop: 20, marginBottom: 12 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  link: { ...font.sub, color: color.voltDark, fontWeight: '800' },

  card: { backgroundColor: color.surface, borderRadius: radius.card, paddingHorizontal: 16, ...shadow.card },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#ECEAE5' },
  rowMid: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '700', color: color.ink },
  itemSub: { ...font.sub, color: color.textMuted, marginTop: 3 },
  amount: { fontSize: 14, fontWeight: '800' },

  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: color.ink, borderRadius: radius.md, paddingVertical: 14, marginTop: 14 },
  primaryTxt: { color: color.volt, fontSize: 14, fontWeight: '800' },

  // Quỹ
  fundCard: { borderRadius: radius.card, padding: 20 },
  fundLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600' },
  fundBalance: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', marginTop: 4 },
  fundRow: { flexDirection: 'row', gap: 28, marginTop: 18 },
  fundCol: { gap: 3 },
  fundSub: { color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: '600' },
  fundAmt: { fontSize: 15, fontWeight: '800' },
  dueCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF7D0', borderRadius: radius.card, padding: 16, marginTop: 14 },
  dueBtn: { backgroundColor: color.ink, borderRadius: radius.chip, paddingHorizontal: 18, paddingVertical: 10 },
  dueTxt: { color: color.volt, fontSize: 13, fontWeight: '800' },

  // Thành viên
  leaveBtn: { alignItems: 'center', paddingVertical: 16, marginTop: 8 },
  leaveTxt: { ...font.sub, color: color.danger, fontWeight: '800' },

  // Chương trình
  progCard: { backgroundColor: color.surface, borderRadius: radius.card, padding: 16, marginBottom: 12, ...shadow.card, gap: 4 },
  progTitle: { ...font.cardTitle, color: color.ink, flex: 1, marginRight: 10 },
  progFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  progJoin: { ...font.sub, color: color.textMuted, fontWeight: '700' },
  joinBtn: { backgroundColor: color.ink, borderRadius: radius.chip, paddingHorizontal: 18, paddingVertical: 9 },
  joinBtnOff: { backgroundColor: '#E7E5DF' },
  joinTxt: { color: color.volt, fontSize: 13, fontWeight: '800' },
  joinTxtOff: { color: color.textMuted },
  manageBtn: { backgroundColor: color.surface, borderWidth: 1.5, borderColor: color.ink },
  manageTxt: { color: color.ink, fontSize: 13, fontWeight: '800' },
});
