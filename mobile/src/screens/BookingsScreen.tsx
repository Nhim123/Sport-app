import { useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { SegmentedTabs } from '../components/chips/SegmentedTabs';
import { PollCard } from '../components/cards/PollCard';
import { usePolls } from '../state/PollContext';
import { days, weekEvents, todayKey } from '../data/mock';
import { AttendStatus, Sport, WeekEvent, ClubPoll } from '../types';
import { color, font, radius, space, shadow } from '../theme/tokens';

type Filter = 'all' | AttendStatus;
const FILTERS = [
  { key: 'all' as const, label: 'Tất cả' },
  { key: 'done' as const, label: 'Đã tham dự' },
  { key: 'planned' as const, label: 'Dự kiến' },
];

const SPORT_EMOJI: Record<Sport, string> = { pickle: '🏓', gym: '🏋️', football: '⚽' };

export default function BookingsScreen() {
  const [seg, setSeg] = useState<Filter>('all');
  // null = xem cả tuần; ngược lại = xem đúng một ngày. Mặc định mở ở hôm nay.
  const [selectedDay, setSelectedDay] = useState<string | null>(todayKey);
  const { pollForDay, vote, addOption } = usePolls();

  const doneCount = useMemo(() => weekEvents.filter(e => e.status === 'done').length, []);
  const plannedCount = useMemo(() => weekEvents.filter(e => e.status === 'planned').length, []);
  const dayKeysWithEvents = useMemo(() => new Set(weekEvents.map(e => e.dayKey)), []);

  const bySeg = (e: WeekEvent) => seg === 'all' || e.status === seg;

  // Chế độ cả tuần: nhóm theo ngày. Chế độ một ngày: chỉ lấy sự kiện ngày đó.
  const groups = useMemo(() => {
    const filtered = weekEvents.filter(bySeg);
    const source = selectedDay ? days.filter(d => d.key === selectedDay) : days;
    return source
      .map(d => ({ day: d, items: filtered.filter(e => e.dayKey === d.key) }))
      .filter(g => selectedDay ? true : g.items.length > 0);
  }, [seg, selectedDay]);

  const toggleDay = (key: string) => setSelectedDay(prev => (prev === key ? null : key));

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Lịch tuần</Text>
        <Text style={styles.sub}>Tuần này · 11–17/08 · chạm một ngày để xem lịch ngày đó</Text>

        {/* Dải ngày trong tuần — chạm để chọn ngày */}
        <View style={styles.strip}>
          {days.map(d => {
            const isToday = d.key === todayKey;
            const isSel = d.key === selectedDay;
            const has = dayKeysWithEvents.has(d.key);
            return (
              <Pressable
                key={d.key}
                onPress={() => toggleDay(d.key)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSel }}
                accessibilityLabel={`${d.dow} ${d.day}`}
                style={[styles.dayPill, isSel && styles.dayPillSel, !isSel && isToday && styles.dayPillToday]}
              >
                <Text style={[styles.dow, isSel && styles.dowSel]}>{d.dow}</Text>
                <Text style={[styles.dayNum, isSel && styles.dayNumSel]}>{d.day}</Text>
                <View style={[styles.dot, has ? (isSel ? styles.dotSel : styles.dotOn) : styles.dotOff]} />
              </Pressable>
            );
          })}
        </View>

        {/* Tổng quan tuần */}
        <View style={styles.summary}>
          <View style={styles.sumItem}>
            <Ionicons name="checkmark-circle" size={18} color={color.ink} />
            <Text style={styles.sumTxt}>Đã tham dự: <Text style={styles.sumNum}>{doneCount}</Text></Text>
          </View>
          <View style={styles.sumDivider} />
          <View style={styles.sumItem}>
            <Ionicons name="time-outline" size={18} color={color.textMuted} />
            <Text style={styles.sumTxt}>Dự kiến: <Text style={styles.sumNum}>{plannedCount}</Text></Text>
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <SegmentedTabs value={seg} options={FILTERS} onChange={setSeg} />
        </View>

        {/* Tiêu đề bối cảnh + nút xem cả tuần */}
        <View style={styles.contextRow}>
          <Text style={styles.contextTxt}>
            {selectedDay
              ? `Lịch ngày ${days.find(d => d.key === selectedDay)?.dow} · ${days.find(d => d.key === selectedDay)?.day}/08${selectedDay === todayKey ? ' · Hôm nay' : ''}`
              : 'Lịch cả tuần'}
          </Text>
          {selectedDay && (
            <Pressable onPress={() => setSelectedDay(null)} hitSlop={8} accessibilityRole="button">
              <Text style={styles.weekBtn}>Xem cả tuần ›</Text>
            </Pressable>
          )}
        </View>

        {selectedDay ? (
          <>
            {groups[0]?.items.length ? (
              groups[0].items.map(e => <EventRow key={e.id} event={e} />)
            ) : (
              <View style={styles.emptyDay}>
                <Ionicons name="calendar-clear-outline" size={24} color={color.textMuted} />
                <Text style={styles.emptyTxt}>Ngày này chưa có lịch đăng ký.</Text>
              </View>
            )}
            <DayPoll dayKey={selectedDay} onVote={vote} onAddOption={addOption} pollForDay={pollForDay} />
          </>
        ) : groups.length === 0 ? (
          <Text style={styles.emptyTxt}>Không có lịch nào trong mục này.</Text>
        ) : (
          groups.map(g => (
            <View key={g.day.key} style={styles.group}>
              <Pressable onPress={() => setSelectedDay(g.day.key)} accessibilityRole="button">
                <Text style={styles.dayHeader}>
                  {g.day.dow} · {g.day.day}/08{g.day.key === todayKey ? ' · Hôm nay' : ''}
                </Text>
              </Pressable>
              {g.items.map(e => <EventRow key={e.id} event={e} />)}
              <DayPoll dayKey={g.day.key} onVote={vote} onAddOption={addOption} pollForDay={pollForDay} />
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

function EventRow({ event }: { event: WeekEvent }) {
  const done = event.status === 'done';
  return (
    <View style={styles.card}>
      <View style={[styles.accent, { backgroundColor: done ? color.line : color.volt }]} />
      <View style={styles.emojiWrap}>
        <Text style={styles.emoji}>{SPORT_EMOJI[event.sport]}</Text>
      </View>
      <View style={styles.mid}>
        <Text style={styles.time}>{event.time}</Text>
        <Text style={styles.evTitle} numberOfLines={1}>{event.title}</Text>
        <Text style={styles.place} numberOfLines={1}>
          {event.place}{event.forClub ? ` · ${event.forClub}` : ''}
        </Text>
      </View>
      <View style={[styles.badge, done ? styles.badgeDone : styles.badgePlanned]}>
        <Ionicons
          name={done ? 'checkmark' : 'ellipse'}
          size={done ? 13 : 9}
          color={done ? color.ink : color.volt}
        />
        <Text style={[styles.badgeTxt, { color: done ? color.ink : color.volt }]}>
          {done ? 'Đã tham dự' : 'Dự kiến'}
        </Text>
      </View>
    </View>
  );
}

// Bình chọn của CLB gắn với ngày — hiện dưới danh sách buổi trong ngày đó.
function DayPoll({ dayKey, onVote, onAddOption, pollForDay }: {
  dayKey: string;
  onVote: (pollId: string, optionId: string) => void;
  onAddOption: (pollId: string, label: string) => void;
  pollForDay: (d?: string) => ClubPoll | undefined;
}) {
  const poll = pollForDay(dayKey);
  if (!poll) return null;
  return (
    <View style={{ marginTop: 6 }}>
      <View style={styles.pollHeading}>
        <Ionicons name="bar-chart-outline" size={16} color={color.ink} />
        <Text style={styles.pollHeadingTxt}>Bình chọn của CLB</Text>
      </View>
      <PollCard poll={poll} onVote={opt => onVote(poll.id, opt)} onAddOption={label => onAddOption(poll.id, label)} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { ...font.h1, color: color.ink, marginTop: 8 },
  pollHeading: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 14, marginBottom: 10 },
  pollHeadingTxt: { ...font.section, color: color.ink },
  sub: { ...font.sub, color: color.textMuted, marginTop: 4, fontWeight: '600' },

  strip: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  dayPill: { flex: 1, marginHorizontal: 3, alignItems: 'center', paddingVertical: 10, borderRadius: radius.md, backgroundColor: color.surface, borderWidth: 1.5, borderColor: 'transparent', ...shadow.card },
  dayPillSel: { backgroundColor: color.ink, borderColor: color.ink },
  dayPillToday: { borderColor: color.volt },
  dow: { ...font.tiny, color: color.textMuted, fontWeight: '700' },
  dowSel: { color: 'rgba(255,255,255,0.7)' },
  dayNum: { fontSize: 16, fontWeight: '800', color: color.ink, marginTop: 3 },
  dayNumSel: { color: '#fff' },
  dot: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  dotOn: { backgroundColor: color.ink },
  dotSel: { backgroundColor: color.volt },
  dotOff: { backgroundColor: 'transparent' },

  summary: { flexDirection: 'row', alignItems: 'center', backgroundColor: color.surface, borderRadius: radius.card, padding: 14, marginTop: 16, ...shadow.card },
  sumItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  sumDivider: { width: 1, alignSelf: 'stretch', backgroundColor: color.line, marginVertical: 2 },
  sumTxt: { ...font.sub, color: color.textMuted },
  sumNum: { color: color.ink, fontWeight: '800' },

  contextRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, marginBottom: 12 },
  contextTxt: { ...font.section, color: color.ink },
  weekBtn: { ...font.sub, color: color.textMuted, fontWeight: '800' },

  group: { marginTop: 4, marginBottom: 14 },
  dayHeader: { ...font.section, color: color.ink, marginBottom: 10 },

  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: color.surface, borderRadius: radius.card, padding: 12, marginBottom: 10, overflow: 'hidden', ...shadow.card },
  accent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  emojiWrap: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: color.bg, alignItems: 'center', justifyContent: 'center', marginLeft: 4 },
  emoji: { fontSize: 22 },
  mid: { flex: 1, marginHorizontal: 12 },
  time: { ...font.tiny, color: color.textMuted, fontWeight: '700' },
  evTitle: { ...font.cardTitle, color: color.ink, marginTop: 2 },
  place: { ...font.sub, color: color.textFaint, marginTop: 2 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 6, borderRadius: radius.chip },
  badgeDone: { backgroundColor: color.lineSoft },
  badgePlanned: { backgroundColor: color.ink },
  badgeTxt: { fontSize: 11, fontWeight: '800' },

  emptyDay: { alignItems: 'center', gap: 10, paddingVertical: 40 },
  emptyTxt: { ...font.body, color: color.textMuted, textAlign: 'center', marginTop: 8 },
});
