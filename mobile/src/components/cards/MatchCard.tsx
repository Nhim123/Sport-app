import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { color, radius, font, shadow } from '../../theme/tokens';
import { Match, MatchLevel } from '../../types';
import { PillButton } from '../buttons/PillButton';

interface Props { match: Match; onJoin: () => void }

const LEVEL_STYLE: Record<MatchLevel, { bg: string; fg: string }> = {
  'Trung cấp': { bg: '#EEF7D0', fg: '#5A7A10' },
  'Nâng cao': { bg: '#EEF7D0', fg: '#5A7A10' },
  'Mọi trình độ': { bg: '#F0EEE9', fg: color.textMuted },
};

/** Thẻ "Tìm bạn chơi": avatar + kèo + badge trình độ + nút Tham gia. */
function MatchCardBase({ match, onJoin }: Props) {
  const lv = LEVEL_STYLE[match.level];
  const meta = `${match.joined}/${match.capacity} đã tham gia` + (match.note ? ` · ${match.note}` : '');
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.left}>
          <LinearGradient colors={match.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatar} />
          <View style={styles.titleWrap}>
            <Text style={styles.title}>{match.title}</Text>
            <Text style={styles.venue}>{match.venue}</Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: lv.bg }]}>
          <Text style={[styles.badgeTxt, { color: lv.fg }]}>{match.level}</Text>
        </View>
      </View>
      <View style={styles.bottom}>
        <Text style={styles.meta} numberOfLines={1}>{meta}</Text>
        <PillButton label="Tham gia" onPress={onJoin} variant="solid" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: color.surface, borderRadius: radius.card, padding: 15, marginBottom: 11, ...shadow.card },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  left: { flexDirection: 'row', gap: 11, flex: 1, marginRight: 8 },
  avatar: { width: 44, height: 44, borderRadius: 13 },
  titleWrap: { flex: 1 },
  title: { fontSize: 14, fontWeight: '800', color: color.ink },
  venue: { ...font.sub, color: color.textFaint, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.chip },
  badgeTxt: { ...font.tiny, fontWeight: '800' },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 13, gap: 8 },
  meta: { ...font.sub, color: color.textMuted, flex: 1 },
});

export const MatchCard = memo(MatchCardBase);
