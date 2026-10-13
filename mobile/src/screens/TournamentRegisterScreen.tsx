import { useState } from 'react';
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { getTournament } from '../data/tournaments';
import { myClubs } from '../data/mock';
import { useAuth, type FavoriteSport } from '../state/AuthContext';
import { RootStackParamList } from '../navigation/types';
import { color, font, radius, space, shadow } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList, 'TournamentRegister'>;
type Mode = 'solo' | 'club';
const SPORT_LABEL: Record<FavoriteSport, string> = { pickle: '🏓 Pickleball', gym: '🏋️ Gym', football: '⚽ Bóng đá' };

export default function TournamentRegisterScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'TournamentRegister'>>();
  const t = getTournament(params.id);
  const { user } = useAuth();

  // Chỉ CLB do mình chủ trì (owner) mới được đăng ký theo câu lạc bộ.
  const ownedClubs = myClubs.filter(c => c.myRole === 'owner');

  const [mode, setMode] = useState<Mode>('solo');
  const [clubId, setClubId] = useState(ownedClubs[0]?.id ?? '');
  const [agree, setAgree] = useState(false);

  if (!t) return <View style={styles.root} />;

  const selectedClub = ownedClubs.find(c => c.id === clubId);
  const full = t.teams >= t.capacity;
  const open = t.status === 'open' && !full;
  const needTeam = mode === 'club';
  const teamOk = !needTeam || !!selectedClub;
  const canSubmit = teamOk && agree && open;

  const submit = () => {
    if (!canSubmit) return;
    const who = mode === 'club' ? `CLB "${selectedClub?.name ?? ''}"` : (user?.name ?? 'Bạn');
    Alert.alert(
      'Đăng ký thành công',
      `${who} đã đăng ký ${t.name}. Ban tổ chức (chủ sân) sẽ liên hệ xác nhận & thu lệ phí.`,
      [{ text: 'OK', onPress: () => nav.goBack() }],
    );
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Tóm tắt giải (do chủ sân tạo) */}
          <View style={styles.summary}>
            <Text style={styles.tName}>{t.name}</Text>
            <Text style={styles.tMeta}>{t.venue} · {t.date}</Text>
            <View style={styles.tRow}>
              <Info label="Thể thức" value={t.format} />
              <Info label="Đã đăng ký" value={t.teams + '/' + t.capacity + ' đội'} />
            </View>
            <View style={styles.tRow}>
              <Info label="Lệ phí" value={t.feeLabel} />
              {t.prize ? <Info label="Giải thưởng" value={'🏆 ' + t.prize} /> : null}
            </View>
          </View>

          {full ? <Text style={styles.err}>Giải đã đủ số đội đăng ký.</Text> : null}
          {t.status !== 'open' && !full ? <Text style={styles.err}>Giải hiện không mở đăng ký.</Text> : null}

          {/* Chọn hình thức đăng ký: Cá nhân / Câu lạc bộ */}
          <Text style={styles.label}>Hình thức đăng ký</Text>
          <View style={styles.seg}>
            <SegBtn icon="person-outline" text="Cá nhân" active={mode === 'solo'} onPress={() => setMode('solo')} />
            <SegBtn icon="people-outline" text="Câu lạc bộ" active={mode === 'club'} onPress={() => setMode('club')} />
          </View>
          <Text style={styles.segHint}>
            {mode === 'solo'
              ? 'Đăng ký với tư cách cá nhân — BTC sẽ ghép đội/cặp nếu cần.'
              : 'Đăng ký theo câu lạc bộ — chỉ hiển thị CLB do bạn chủ trì.'}
          </Text>

          {/* Tự động điền từ hồ sơ */}
          <View style={styles.autoNote}>
            <Ionicons name="sparkles-outline" size={15} color={color.voltDark} />
            <Text style={styles.autoTxt}>Thông tin lấy tự động từ hồ sơ của bạn — kiểm tra lại trước khi xác nhận.</Text>
          </View>

          <View style={styles.card}>
            <ReadRow icon="person-outline" label={mode === 'club' ? 'Người đại diện' : 'Người đăng ký'} value={user?.name ?? 'Chưa rõ'} />
            <ReadRow icon="mail-outline" label="Email" value={user?.email ?? '—'} />
            <ReadRow icon="trophy-outline" label="Bộ môn" value={user?.favoriteSport ? SPORT_LABEL[user.favoriteSport] : '—'} last />
          </View>

          {/* Câu lạc bộ — chỉ CLB do mình chủ trì */}
          {needTeam ? (
            <>
              <Text style={styles.label}>Câu lạc bộ (bạn chủ trì)</Text>
              {ownedClubs.length === 0 ? (
                <View style={styles.emptyClub}>
                  <Ionicons name="information-circle-outline" size={18} color={color.textMuted} />
                  <Text style={styles.emptyClubTxt}>Bạn chưa chủ trì câu lạc bộ nào. Chỉ chủ hội mới đăng ký theo CLB.</Text>
                </View>
              ) : (
                ownedClubs.map(c => {
                  const on = c.id === clubId;
                  return (
                    <Pressable key={c.id} style={[styles.clubRow, on && styles.clubRowOn]} onPress={() => setClubId(c.id)}
                      accessibilityRole="radio" accessibilityState={{ selected: on }}>
                      <Ionicons name={on ? 'radio-button-on' : 'radio-button-off'} size={20} color={on ? color.voltDark : color.navIdle} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.clubName}>{c.name}</Text>
                        <Text style={styles.clubMeta}>{c.members} thành viên · Chủ hội</Text>
                      </View>
                    </Pressable>
                  );
                })
              )}
            </>
          ) : null}


          <Pressable style={styles.agreeRow} onPress={() => setAgree(a => !a)} accessibilityRole="checkbox" accessibilityState={{ checked: agree }}>
            <Ionicons name={agree ? 'checkbox' : 'square-outline'} size={20} color={agree ? color.voltDark : color.navIdle} />
            <Text style={styles.agreeTxt}>Tôi đồng ý thể lệ giải đấu và cam kết thông tin chính xác.</Text>
          </Pressable>

          <View style={{ marginTop: 16 }}>
            <PrimaryButton label={'Xác nhận đăng ký · ' + t.feeLabel} onPress={submit} disabled={!canSubmit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function SegBtn({ icon, text, active, onPress }: { icon: keyof typeof Ionicons.glyphMap; text: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.segBtn, active && styles.segBtnOn]} onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: active }}>
      <Ionicons name={icon} size={17} color={active ? color.ink : color.textMuted} />
      <Text style={[styles.segTxt, active && styles.segTxtOn]}>{text}</Text>
    </Pressable>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoVal}>{value}</Text>
    </View>
  );
}

function ReadRow({ icon, label, value, last }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.readRow, last && styles.readRowLast]}>
      <Ionicons name={icon} size={18} color={color.textMuted} />
      <Text style={styles.readLabel}>{label}</Text>
      <Text style={styles.readVal} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  content: { paddingHorizontal: space.xl, paddingTop: 12, paddingBottom: 28 },

  summary: { backgroundColor: color.surface, borderRadius: radius.card, padding: 16, ...shadow.card },
  tName: { ...font.h2, color: color.ink },
  tMeta: { ...font.sub, color: color.textMuted, marginTop: 4 },
  tRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  info: { flex: 1 },
  infoLabel: { ...font.tiny, color: color.textMuted, fontWeight: '600' },
  infoVal: { fontSize: 13.5, fontWeight: '700', color: color.ink, marginTop: 2 },

  seg: { flexDirection: 'row', gap: 10 },
  segBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
    paddingVertical: 12, borderRadius: radius.md, backgroundColor: color.surface,
    borderWidth: 1.5, borderColor: 'transparent', ...shadow.card,
  },
  segBtnOn: { backgroundColor: color.volt, borderColor: color.voltDark },
  segTxt: { ...font.sub, color: color.textMuted, fontWeight: '700' },
  segTxtOn: { color: color.ink },
  segHint: { ...font.sub, color: color.textMuted, marginTop: 8, lineHeight: 18 },

  autoNote: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18, marginBottom: 10 },
  autoTxt: { flex: 1, ...font.sub, color: color.textMuted, fontWeight: '600', lineHeight: 18 },

  card: { backgroundColor: color.surface, borderRadius: radius.card, paddingHorizontal: 16, ...shadow.card },
  readRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#ECEAE5' },
  readRowLast: { borderBottomWidth: 0 },
  readLabel: { ...font.sub, color: color.textMuted, fontWeight: '600' },
  readVal: { flex: 1, textAlign: 'right', fontSize: 13.5, fontWeight: '700', color: color.ink },

  label: { ...font.sub, color: color.textMuted, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: color.surface,
    borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 13, ...shadow.card,
  },
  input: { flex: 1, ...font.body, color: color.ink, padding: 0 },

  clubRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10,
    backgroundColor: color.surface, borderRadius: radius.md, padding: 14,
    borderWidth: 1.5, borderColor: 'transparent', ...shadow.card,
  },
  clubRowOn: { borderColor: color.voltDark },
  clubName: { ...font.cardTitle, color: color.ink },
  clubMeta: { ...font.sub, color: color.textMuted, marginTop: 2 },
  emptyClub: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: color.surface, borderRadius: radius.md, padding: 14, ...shadow.card,
  },
  emptyClubTxt: { flex: 1, ...font.sub, color: color.textMuted, lineHeight: 18 },

  err: { ...font.sub, color: color.danger, marginTop: 8 },
  hint: { ...font.sub, color: color.textMuted, marginTop: 8 },

  agreeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 18 },
  agreeTxt: { flex: 1, ...font.sub, color: color.textMuted, lineHeight: 18 },
});
