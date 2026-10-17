import { View, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../../state/LanguageContext';
import type { Achievement } from '../../data/achievements';
import { color, font, radius } from '../../theme/tokens';

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉', 0: '🎽' };
const RANK_KEY: Record<number, string> = { 1: 'ach.champion', 2: 'ach.runnerup', 3: 'ach.third', 0: 'ach.joined' };
const RANK_COLOR: Record<number, string> = { 1: '#D9A400', 2: '#8A939B', 3: '#C8803C', 0: color.textMuted };

// Một dòng thành tích: huy chương + tên giải + ngày/ghi chú + hạng.
export function AchievementCard({ item, last }: { item: Achievement; last?: boolean }) {
  const { t } = useLanguage();
  const tint = RANK_COLOR[item.rank];
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.medal}>{MEDAL[item.rank]}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>{item.tournament}</Text>
        <Text style={styles.meta}>{item.date}{item.note ? ' · ' + item.note : ''}</Text>
      </View>
      <View style={[styles.badge, { borderColor: tint }]}>
        <Text style={[styles.badgeTxt, { color: tint }]}>{t(RANK_KEY[item.rank])}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: color.lineSoft },
  rowLast: { borderBottomWidth: 0 },
  medal: { fontSize: 24 },
  name: { ...font.cardTitle, color: color.ink },
  meta: { ...font.sub, color: color.textMuted, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.chip, borderWidth: 1.5 },
  badgeTxt: { ...font.tiny, fontWeight: '800' },
});
