import { useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { AchievementCard } from '../components/cards/AchievementCard';
import { achievements } from '../data/achievements';
import { sportLevel, playedSports, MAX_TIER } from '../utils/level';
import type { Sport } from '../types';
import { color, font, radius, space, shadow } from '../theme/tokens';

const SPORT_LABEL: Record<string, string> = { pickle: 'Pickleball', football: 'Bóng đá', gym: 'Gym' };
const SPORT_EMOJI: Record<string, string> = { pickle: '🏓', football: '⚽', gym: '🏋️' };

// Màn "Trình độ": chọn bộ môn đã thi đấu → xem bậc trình độ (tính từ thành tích) + cúp đã đạt.
export default function LevelScreen() {
  const played = useMemo(() => playedSports(), []);
  const [sport, setSport] = useState<Sport>(played[0] ?? 'pickle');
  const lv = useMemo(() => sportLevel(sport), [sport]);
  const cups = useMemo(
    () => achievements.filter(a => a.sport === sport && a.rank >= 1 && a.rank <= 3),
    [sport],
  );
  const progress = Math.round((lv.tierIndex / MAX_TIER) * 100);

  if (played.length === 0) {
    return (
      <View style={styles.root}>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🏅</Text>
          <Text style={styles.emptyTxt}>Chưa có môn nào thi đấu. Hãy tham gia giải để được xếp trình độ.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Chọn bộ môn đã thi đấu */}
        <View style={styles.chips}>
          {played.map(sp => {
            const on = sp === sport;
            return (
              <Pressable key={sp} style={[styles.chip, on && styles.chipOn]} onPress={() => setSport(sp)}
                accessibilityRole="button" accessibilityState={{ selected: on }}>
                <Text style={[styles.chipTxt, on && styles.chipTxtOn]}>{SPORT_EMOJI[sp]} {SPORT_LABEL[sp]}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Thẻ trình độ */}
        <View style={styles.levelCard}>
          <Text style={styles.sportName}>{SPORT_EMOJI[sport]} {SPORT_LABEL[sport]}</Text>
          <Text style={styles.tier}>{lv.tier}</Text>
          <Text style={styles.points}>{lv.points} điểm tích luỹ</Text>

          {/* Bậc dạng chấm */}
          <View style={styles.dots}>
            {Array.from({ length: MAX_TIER + 1 }).map((_, i) => (
              <View key={i} style={[styles.dot, i <= lv.tierIndex && styles.dotOn]} />
            ))}
          </View>

          {/* Thanh tiến độ lên bậc */}
          <View style={styles.bar}><View style={[styles.barFill, { width: `${progress}%` }]} /></View>
          <Text style={styles.nextHint}>
            {lv.next ? `Cần ${lv.next.remaining} điểm nữa để lên "${lv.next.tier}"` : 'Đã đạt bậc cao nhất 🎉'}
          </Text>

          {/* Bộ sưu tập huy chương */}
          <View style={styles.medals}>
            <Medal emoji="🥇" count={lv.gold} />
            <Medal emoji="🥈" count={lv.silver} />
            <Medal emoji="🥉" count={lv.bronze} />
          </View>
        </View>

        {/* Cúp đã đạt */}
        <Text style={styles.section}>Cúp đã đạt</Text>
        <View style={styles.cupCard}>
          {cups.length > 0
            ? cups.map((a, i) => <AchievementCard key={a.id} item={a} last={i === cups.length - 1} />)
            : <Text style={styles.none}>Chưa có cúp ở bộ môn này.</Text>}
        </View>
      </ScrollView>
    </View>
  );
}

function Medal({ emoji, count }: { emoji: string; count: number }) {
  return (
    <View style={styles.medal}>
      <Text style={styles.medalEmoji}>{emoji}</Text>
      <Text style={styles.medalCount}>×{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  content: { paddingHorizontal: space.xl, paddingTop: 14, paddingBottom: 28 },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.chip, backgroundColor: color.surface, borderWidth: 1, borderColor: color.line },
  chipOn: { backgroundColor: color.volt, borderColor: color.voltDark },
  chipTxt: { ...font.sub, color: color.textMuted, fontWeight: '700' },
  chipTxtOn: { color: color.ink },

  levelCard: { backgroundColor: color.surface, borderRadius: radius.card, padding: 18, ...shadow.card },
  sportName: { ...font.sub, color: color.textMuted, fontWeight: '700' },
  tier: { ...font.h1, color: color.ink, marginTop: 4 },
  points: { ...font.sub, color: color.textMuted, marginTop: 2 },
  dots: { flexDirection: 'row', gap: 8, marginTop: 16 },
  dot: { flex: 1, height: 8, borderRadius: 4, backgroundColor: color.line },
  dotOn: { backgroundColor: color.voltDark },
  bar: { height: 8, borderRadius: 4, backgroundColor: color.line, marginTop: 14, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4, backgroundColor: color.voltDark },
  nextHint: { ...font.sub, color: color.textMuted, marginTop: 8 },
  medals: { flexDirection: 'row', gap: 20, marginTop: 16 },
  medal: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  medalEmoji: { fontSize: 22 },
  medalCount: { ...font.cardTitle, fontWeight: '800', color: color.ink },

  section: { ...font.section, color: color.ink, marginTop: 24, marginBottom: 12 },
  cupCard: { backgroundColor: color.surface, borderRadius: radius.card, paddingHorizontal: 16, ...shadow.card },
  none: { ...font.sub, color: color.textFaint, paddingVertical: 16 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  emptyEmoji: { fontSize: 40 },
  emptyTxt: { ...font.body, color: color.textMuted, textAlign: 'center' },
});
