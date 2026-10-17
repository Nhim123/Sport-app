import { useState, useMemo } from 'react';
import { ScrollView, View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { Avatar } from '../components/primitives/Avatar';
import { StatCell } from '../components/primitives/StatCell';
import { MenuRow } from '../components/primitives/MenuRow';
import { SegmentedTabs } from '../components/chips/SegmentedTabs';
import { ActivityChart, ActivityPoint } from '../components/charts/ActivityChart';
import { AchievementCard } from '../components/cards/AchievementCard';
import { profileStats, activityWeek, activityMonth } from '../data/mock';
import { achievements } from '../data/achievements';
import { useAuth } from '../state/AuthContext';
import { useLanguage, LANG_NATIVE, Lang } from '../state/LanguageContext';
import { RootStackParamList } from '../navigation/types';
import { color, font, radius, space, shadow } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const SPORT_LABEL: Record<string, string> = { pickle: 'Pickleball', football: 'Bóng đá', gym: 'Gym' };
const SPORT_EMOJI: Record<string, string> = { pickle: '🏓', football: '⚽', gym: '🏋️' };
const SPORT_ORDER = ['pickle', 'football', 'gym'] as const;

// Viết tắt tên → 2 chữ cái cho avatar (vd "Minh Khang" → "MK").
const initialsOf = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('') || 'B';

export default function ProfileScreen() {
  const nav = useNavigation<Nav>();
  const { user, signOut } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [actMode, setActMode] = useState<'week' | 'month'>('week');
  const name = user?.name ?? 'Bạn';
  const infoValue = user?.phone || user?.email || '';
  const sportValue = user?.favoriteSport ? SPORT_LABEL[user.favoriteSport] : undefined;

  const chooseLang = (l: Lang) => { setLang(l); setLangOpen(false); };

  const chartData: ActivityPoint[] = useMemo(
    () =>
      actMode === 'week'
        ? activityWeek.map(d => ({ label: d.key, value: d.hours }))
        : activityMonth.map(d => ({ label: `${t('act.week')} ${d.week}`, value: d.hours })),
    [actMode, t]
  );
  const total = useMemo(() => chartData.reduce((s, d) => s + d.value, 0), [chartData]);
  const avg = chartData.length ? Math.round((total / chartData.length) * 10) / 10 : 0;

  // Thành tích tách theo bộ môn: chip các môn đã tham gia, bấm để xem thành tích môn đó.
  const playedSports = useMemo(() => SPORT_ORDER.filter(sp => achievements.some(a => a.sport === sp)), []);
  const [achSport, setAchSport] = useState<string>(playedSports[0] ?? 'pickle');
  const achList = useMemo(() => achievements.filter(a => a.sport === achSport), [achSport]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: space.xl, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <Avatar label={initialsOf(name)} size={70} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{user?.email ?? ''}</Text>
            {user?.provider === 'google' ? (
              <View style={styles.badge}>
                <Ionicons name="logo-google" size={12} color="#EA4335" />
                <Text style={styles.badgeTxt}>{t('profile.google')}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.stats}>
          {profileStats.map(s => (
            <View key={s.label} style={styles.statCard}>
              <StatCell value={s.value} label={s.label} />
            </View>
          ))}
        </View>

        <View style={styles.actCard}>
          <View style={styles.actHead}>
            <Text style={styles.actTitle}>{t('act.title')}</Text>
            <View style={{ width: 150 }}>
              <SegmentedTabs
                value={actMode}
                onChange={setActMode}
                options={[{ key: 'week', label: t('act.week') }, { key: 'month', label: t('act.month') }]}
              />
            </View>
          </View>
          <View style={styles.actSummary}>
            <View>
              <Text style={styles.actBig}>{total}<Text style={styles.actUnit}> {t('act.hour')}</Text></Text>
              <Text style={styles.actCaption}>{t('act.total')}</Text>
            </View>
            <View style={styles.actDivider} />
            <View>
              <Text style={styles.actBig}>{avg}<Text style={styles.actUnit}> {t('act.hour')}</Text></Text>
              <Text style={styles.actCaption}>{t('act.avg')}</Text>
            </View>
          </View>
          <ActivityChart data={chartData} unit="h" />
        </View>

        <View style={styles.achCard}>
          <Text style={styles.achTitle}>{t('ach.title')}</Text>
          {playedSports.length === 0 ? (
            <Text style={styles.achEmpty}>{t('ach.empty')}</Text>
          ) : (
            <>
              <View style={styles.achChips}>
                {playedSports.map(sp => {
                  const on = sp === achSport;
                  return (
                    <Pressable key={sp} style={[styles.achChip, on && styles.achChipOn]} onPress={() => setAchSport(sp)}
                      accessibilityRole="button" accessibilityState={{ selected: on }}>
                      <Text style={[styles.achChipTxt, on && styles.achChipTxtOn]}>{SPORT_EMOJI[sp]} {SPORT_LABEL[sp]}</Text>
                    </Pressable>
                  );
                })}
              </View>
              {achList.map((a, i) => <AchievementCard key={a.id} item={a} last={i === achList.length - 1} />)}
            </>
          )}
        </View>

        <View style={styles.menuCard}>
          <MenuRow icon="🎁" label={t('profile.benefits')} value={t('val.silver')} onPress={() => {}} />
          <MenuRow icon="🪪" label={t('profile.account')} value={infoValue || name} onPress={() => nav.navigate('ProfileInfo')} />
          <MenuRow icon="🕑" label={t('profile.history')} onPress={() => nav.navigate('MainTabs', { screen: 'Bookings' })} />
          <MenuRow icon="🌐" label={t('profile.language')} value={LANG_NATIVE[lang]} onPress={() => setLangOpen(true)} />
          <MenuRow icon="🏅" label={t('profile.level')} value={sportValue ? `${sportValue} · ${t('val.intermediate')}` : t('val.intermediate')} onPress={() => nav.navigate('Level')} last />
        </View>

        <Pressable accessibilityRole="button" style={styles.logout} onPress={signOut}>
          <Text style={styles.logoutTxt}>{t('profile.logout')}</Text>
        </Pressable>
      </ScrollView>

      {/* Bộ chọn ngôn ngữ */}
      <Modal visible={langOpen} transparent animationType="fade" onRequestClose={() => setLangOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setLangOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>{t('lang.title')}</Text>
            {(['vi', 'en'] as Lang[]).map(l => (
              <Pressable key={l} style={styles.langRow} onPress={() => chooseLang(l)} accessibilityRole="button">
                <Text style={styles.langName}>{LANG_NATIVE[l]}</Text>
                <Text style={styles.langSub}>{t(`lang.${l}`)}</Text>
                <Ionicons
                  name={lang === l ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={lang === l ? color.voltDark : color.navIdle}
                />
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8 },
  name: { ...font.h2, color: color.ink },
  email: { ...font.sub, color: color.textMuted, marginTop: 2 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  badgeTxt: { ...font.tiny, color: color.textMuted, fontWeight: '700' },
  stats: { flexDirection: 'row', gap: 11, marginTop: 20 },
  statCard: { flex: 1, backgroundColor: color.surface, borderRadius: radius.card, paddingVertical: 16 },
  actCard: { backgroundColor: color.surface, borderRadius: radius.card, padding: 16, marginTop: 24, ...shadow.card },
  actHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  actTitle: { ...font.cardTitle, fontWeight: '800', color: color.ink, flexShrink: 1 },
  actSummary: { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 16 },
  actBig: { ...font.h2, color: color.ink },
  actUnit: { ...font.sub, color: color.textMuted, fontWeight: '700' },
  actCaption: { ...font.tiny, color: color.textMuted, fontWeight: '600', marginTop: 2 },
  actDivider: { width: 1, alignSelf: 'stretch', backgroundColor: color.lineSoft },
  achCard: { backgroundColor: color.surface, borderRadius: radius.card, padding: 16, marginTop: 24, ...shadow.card },
  achTitle: { ...font.cardTitle, fontWeight: '800', color: color.ink, marginBottom: 4 },
  achEmpty: { ...font.sub, color: color.textMuted, marginTop: 8 },
  achChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12, marginBottom: 4 },
  achChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.chip, backgroundColor: color.bg, borderWidth: 1, borderColor: color.line },
  achChipOn: { backgroundColor: color.volt, borderColor: color.voltDark },
  achChipTxt: { ...font.sub, color: color.textMuted, fontWeight: '700' },
  achChipTxtOn: { color: color.ink },
  menuCard: { backgroundColor: color.surface, borderRadius: radius.card, paddingHorizontal: 8, paddingVertical: 6, marginTop: 24, ...shadow.card },
  logout: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.line, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 20 },
  logoutTxt: { ...font.body, fontWeight: '700', color: color.danger },

  // Bộ chọn ngôn ngữ
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: color.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: space.xl, paddingBottom: 34 },
  sheetTitle: { ...font.h2, color: color.ink, marginBottom: 10 },
  langRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: color.lineSoft },
  langName: { ...font.body, fontWeight: '800', color: color.ink },
  langSub: { flex: 1, ...font.sub, color: color.textMuted },
});
