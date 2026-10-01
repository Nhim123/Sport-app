import { useState, useLayoutEffect } from 'react';
import { ScrollView, View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { color, grad, font, radius, space, shadow } from '../theme/tokens';
import { RootStackParamList } from '../navigation/types';
import { SegmentedTabs, SegOption } from '../components/chips/SegmentedTabs';
import { Avatar } from '../components/primitives/Avatar';
import { Tag } from '../components/primitives/Tag';
import { PollCard } from '../components/cards/PollCard';
import { formatVnd } from '../utils/format';
import { getClub, clubMembers, clubPrograms } from '../data/mock';
import { usePolls } from '../state/PollContext';
import { usePasses } from '../state/PassContext';
import { useClubRequests } from '../state/ClubRequestContext';
import { useClubFund } from '../state/ClubFundContext';
import { ClubTab, ClubViewerRole, PaymentOrder } from '../types';

const TABS: SegOption<ClubTab>[] = [
  { key: 'fund', label: 'Quỹ CLB' },
  { key: 'members', label: 'Thành viên' },
  { key: 'programs', label: 'Chương trình' },
];

export default function ClubDetailScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'ClubDetail'>>();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const role: ClubViewerRole = getClub(params.id)?.myRole ?? 'member';
  const isOwner = role === 'owner';
  const [tab, setTab] = useState<ClubTab>('fund');
  const { leaveClub } = usePasses();

  const onLeave = () => {
    Alert.alert('Rời câu lạc bộ', `Bạn chắc chắn muốn rời ${params.name}?`, [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Rời', style: 'destructive', onPress: () => { leaveClub(); nav.goBack(); } },
    ]);
  };

  // Tạo bình chọn chỉ dành cho quản trị viên (chủ hội) → nút chỉ hiện khi isOwner.
  useLayoutEffect(() => {
    nav.setOptions({
      headerRight: isOwner
        ? () => (
            <Pressable
              onPress={() => nav.navigate('CreatePoll', { club: params.name })}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Tạo bình chọn"
              style={styles.headerBtn}
            >
              <Ionicons name="add" size={16} color={color.ink} />
              <Text style={styles.headerBtnTxt}>Bình chọn</Text>
            </Pressable>
          )
        : undefined,
    });
  }, [nav, params.name, isOwner]);

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ padding: space.xl, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
      {/* Banner vai trò — làm nổi bật bạn là Chủ hội hay Hội viên */}
      <View style={[styles.roleBanner, isOwner ? styles.roleBannerOwner : styles.roleBannerMember]}>
        <View style={[styles.roleIcon, isOwner ? styles.roleIconOwner : styles.roleIconMember]}>
          <Ionicons name={isOwner ? 'shield-checkmark' : 'person'} size={24} color={isOwner ? color.volt : color.ink} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.roleName}>{isOwner ? 'Chủ câu lạc bộ' : 'Hội viên'}</Text>
          <Text style={styles.roleDesc}>
            {isOwner ? 'Bạn quản lý CLB — tạo bình chọn, quản quỹ & chương trình' : 'Bạn là thành viên của câu lạc bộ này'}
          </Text>
        </View>
        <View style={[styles.roleBadge, isOwner ? styles.roleBadgeOwner : styles.roleBadgeMember]}>
          <Text style={[styles.roleBadgeTxt, { color: isOwner ? color.volt : color.textMuted }]}>
            {isOwner ? 'QUẢN TRỊ' : 'THÀNH VIÊN'}
          </Text>
        </View>
      </View>

      <SegmentedTabs value={tab} options={TABS} onChange={setTab} />
      <View style={{ height: 18 }} />

      {tab === 'fund' ? <FundView isOwner={isOwner} clubId={params.id} clubName={params.name} />
        : tab === 'members' ? <MembersView isOwner={isOwner} clubId={params.id} />
        : <ProgramsView isOwner={isOwner} />}

      {/* Bình chọn — mục riêng, không nằm trong thanh tab ngang */}
      <Text style={styles.voteHeading}>Bình chọn của CLB</Text>
      <VoteView clubName={params.name} isOwner={isOwner} />

      {/* Rời câu lạc bộ — đặt ở dưới cùng của trang */}
      <Pressable onPress={onLeave} accessibilityRole="button" accessibilityLabel="Rời câu lạc bộ" style={styles.leaveBtn}>
        <Ionicons name="exit-outline" size={18} color={color.danger} />
        <Text style={styles.leaveTxt}>Rời câu lạc bộ</Text>
      </Pressable>
    </ScrollView>
  );
}

function PrimaryAction({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={styles.primaryBtn}>
      <Ionicons name={icon} size={16} color={color.volt} />
      <Text style={styles.primaryTxt}>{label}</Text>
    </Pressable>
  );
}

/* ---- Bình chọn CLB (gắn lịch sinh hoạt) ---- */
function VoteView({ clubName }: { clubName: string; isOwner: boolean }) {
  const { polls, pollsForClub, vote, addOption } = usePolls();
  const mine = pollsForClub(clubName);
  const list = mine.length ? mine : polls;   // demo: chưa khớp tên CLB thì hiện tất cả
  return (
    <>
      {list.length ? (
        list.map(p => (
          <PollCard key={p.id} poll={p} onVote={opt => vote(p.id, opt)} onAddOption={label => addOption(p.id, label)} />
        ))
      ) : (
        <Text style={{ ...font.sub, color: color.textMuted, textAlign: 'center', paddingVertical: 24 }}>
          Chưa có cuộc bình chọn nào.
        </Text>
      )}
    </>
  );
}

/* ---- Quỹ CLB ---- */
function FundView({ isOwner, clubId, clubName }: { isOwner: boolean; clubId: string; clubName: string }) {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const fund = useClubFund();
  // Đóng quỹ → màn thanh toán (gián tiếp, chủ hội xác nhận thủ công).
  const payDues = () => {
    const order: PaymentOrder = {
      purpose: 'club',
      title: 'Đóng quỹ câu lạc bộ',
      brand: clubName,
      itemLabel: 'Khoản đóng',
      itemValue: 'Quỹ tháng 8',
      date: 'Tháng 8/2026',
      priceLabel: '100.000₫',
      code: 'QUY-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
    };
    nav.navigate('DayPassPayment', { order });
  };
  return (
    <>
      <LinearGradient colors={grad.dark} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fundCard}>
        <Text style={styles.fundLabel}>Số dư quỹ</Text>
        <Text style={styles.fundBalance}>{formatVnd(fund.balance)}</Text>
        <View style={styles.fundRow}>
          <View style={styles.fundCol}>
            <Text style={styles.fundSub}>Tổng thu</Text>
            <Text style={[styles.fundAmt, { color: color.volt }]}>+{formatVnd(fund.income)}</Text>
          </View>
          <View style={styles.fundCol}>
            <Text style={styles.fundSub}>Tổng chi</Text>
            <Text style={[styles.fundAmt, { color: '#FF8A7A' }]}>-{formatVnd(fund.expense)}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Chủ hội: thêm giao dịch · Hội viên: đóng quỹ */}
      {isOwner ? (
        <PrimaryAction icon="add-circle-outline" label="Thêm khoản thu / chi" onPress={() => nav.navigate('AddFundTx', { clubId, name: clubName })} />
      ) : (
        <View style={styles.dueCard}>
          <View style={styles.rowMid}>
            <Text style={styles.itemTitle}>Quỹ tháng 8</Text>
            <Text style={styles.itemSub}>Cần đóng 100.000₫</Text>
          </View>
          <Pressable onPress={payDues} accessibilityRole="button" accessibilityLabel="Đóng quỹ" style={styles.dueBtn}>
            <Text style={styles.dueTxt}>Đóng quỹ</Text>
          </Pressable>
        </View>
      )}

      <Text style={styles.section}>Giao dịch gần đây</Text>
      <View style={styles.card}>
        {fund.txs.map((t, i) => {
          const col = fund.collectionById(t.collectionId);
          const paidCount = col ? col.payers.filter(p => p.paid).length : 0;
          const openDetail = () => nav.navigate('CollectionDetail', { collectionId: t.collectionId! });
          return (
            <Pressable
              key={t.id}
              onPress={col && isOwner ? openDetail : undefined}
              disabled={!col || !isOwner}
              style={[styles.row, i < fund.txs.length - 1 && styles.divider]}
            >
              <View style={styles.rowMid}>
                <Text style={styles.itemTitle} numberOfLines={1}>{t.label}</Text>
                {col ? (
                  <Text style={styles.itemSub}>
                    {t.date} · đã đóng {paidCount}/{col.payers.length}{isOwner ? ' · xem chi tiết ›' : ''}
                  </Text>
                ) : (
                  <Text style={styles.itemSub}>{t.date}</Text>
                )}
              </View>
              <Text style={[styles.amount, { color: t.kind === 'in' ? color.voltDark : color.danger }]}>
                {t.kind === 'in' ? '+' : '-'}{formatVnd(t.amount)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

/* ---- Thành viên ---- */
const ROLE_VARIANT: Record<string, 'volt' | 'soft' | 'dark'> = {
  'Chủ nhiệm': 'volt', 'Quản lý': 'dark', 'Thành viên': 'soft',
};
function MembersView({ isOwner, clubId }: { isOwner: boolean; clubId: string }) {
  const { pendingFor, approve, reject } = useClubRequests();
  const requests = pendingFor(clubId);
  return (
    <>
      {/* Quản trị: phê duyệt thành viên chờ duyệt */}
      {isOwner && requests.length > 0 ? (
        <>
          <Text style={styles.section}>Yêu cầu chờ duyệt ({requests.length})</Text>
          <View style={styles.card}>
            {requests.map((r, i) => (
              <View key={r.id} style={[styles.reqRow, i < requests.length - 1 && styles.divider]}>
                <Avatar label={r.initials} size={40} />
                <View style={[styles.rowMid, { marginLeft: 12 }]}>
                  <Text style={styles.itemTitle}>{r.name}</Text>
                  {r.note ? <Text style={styles.itemSub} numberOfLines={1}>{r.note}</Text> : null}
                </View>
                <Pressable onPress={() => approve(r.id)} accessibilityLabel="Duyệt" style={styles.approveBtn}>
                  <Ionicons name="checkmark" size={16} color={color.ink} />
                </Pressable>
                <Pressable onPress={() => reject(r.id)} accessibilityLabel="Từ chối" style={styles.rejectBtn}>
                  <Ionicons name="close" size={16} color={color.danger} />
                </Pressable>
              </View>
            ))}
          </View>
        </>
      ) : null}

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

  // Banner vai trò (nổi bật)
  roleBanner: { flexDirection: 'row', alignItems: 'center', gap: 13, borderRadius: radius.card, padding: 16, marginTop: 4, ...shadow.card },
  roleBannerOwner: { backgroundColor: color.volt },
  roleBannerMember: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.line },
  roleIcon: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  roleIconOwner: { backgroundColor: color.ink },
  roleIconMember: { backgroundColor: color.volt },
  roleName: { fontSize: 17, fontWeight: '900', color: color.ink },
  roleDesc: { ...font.sub, color: color.ink, opacity: 0.7, marginTop: 2 },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.chip },
  roleBadgeOwner: { backgroundColor: color.ink },
  roleBadgeMember: { backgroundColor: color.lineSoft },
  roleBadgeTxt: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },

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

  voteHeading: { ...font.section, color: color.ink, marginTop: 28, marginBottom: 12 },
  // Ô tạo bình chọn ở góc trên cùng bên phải (header)
  headerBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: color.volt, borderRadius: radius.chip, paddingHorizontal: 11, paddingVertical: 6, marginRight: 12 },
  headerBtnTxt: { ...font.tiny, color: color.ink, fontWeight: '800' },

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

  // Rời CLB (dưới cùng trang)
  reqRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  approveBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: color.volt, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  rejectBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: color.surface, borderWidth: 1, borderColor: color.line, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  leaveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 16, marginTop: 28, borderTopWidth: 1, borderTopColor: color.line },
  leaveTxt: { ...font.body, color: color.danger, fontWeight: '800' },

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
