import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClubPoll } from '../../types';
import { color, font, radius, shadow } from '../../theme/tokens';

interface Props {
  poll: ClubPoll;
  onVote: (optionId: string) => void;
  onAddOption?: (label: string) => void;   // khi CLB cho phép thành viên thêm phương án
}

/** Thẻ bình chọn (kiểu Zalo): mỗi lựa chọn là 1 thanh có % phiếu; chạm để chọn/đổi/rút. */
export function PollCard({ poll, onVote, onAddOption }: Props) {
  const total = poll.options.reduce((s, o) => s + o.votes, 0);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const canAdd = poll.allowAddOption && !!onAddOption;
  // Ẩn kết quả cho tới khi mình đã bỏ phiếu.
  const revealed = !poll.hideResults || poll.myVotes.length > 0;

  const submitOption = () => {
    const t = draft.trim();
    if (t && onAddOption) onAddOption(t);
    setDraft('');
    setAdding(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{poll.title}</Text>
          {poll.note ? <Text style={styles.note}>{poll.note}</Text> : null}
        </View>
        {poll.closesLabel ? (
          <View style={styles.chip}>
            <Ionicons name="time-outline" size={12} color={color.textMuted} />
            <Text style={styles.chipTxt}>{poll.closesLabel}</Text>
          </View>
        ) : null}
      </View>

      {/* Nhãn thiết lập kiểu Zalo */}
      {(poll.allowMultiple || poll.anonymous) ? (
        <View style={styles.tags}>
          {poll.allowMultiple ? <Text style={styles.tag}>Chọn nhiều</Text> : null}
          {poll.anonymous ? <Text style={styles.tag}>Ẩn danh</Text> : null}
        </View>
      ) : null}

      {poll.options.map(o => {
        const pct = total ? Math.round((o.votes / total) * 100) : 0;
        const mine = poll.myVotes.includes(o.id);
        const box = poll.allowMultiple
          ? (mine ? 'checkbox' : 'square-outline')
          : (mine ? 'checkmark-circle' : 'ellipse-outline');
        return (
          <Pressable
            key={o.id}
            onPress={() => onVote(o.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: mine }}
            style={[styles.opt, mine && styles.optMine]}
          >
            <View style={[styles.bar, { width: revealed ? `${pct}%` : 0 }, mine && styles.barMine]} />
            <View style={styles.optRow}>
              <Ionicons name={box} size={18} color={mine ? color.ink : color.textMuted} />
              <Text style={[styles.optLabel, mine && styles.optLabelMine]} numberOfLines={1}>{o.label}</Text>
              {revealed ? <Text style={styles.pct}>{pct}%</Text> : null}
            </View>
          </Pressable>
        );
      })}

      {/* Thành viên thêm phương án */}
      {canAdd ? (
        adding ? (
          <View style={styles.addRow}>
            <TextInput
              style={styles.addInput}
              value={draft}
              onChangeText={setDraft}
              placeholder="Nhập phương án mới…"
              placeholderTextColor={color.textFaint}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={submitOption}
              maxLength={60}
            />
            <Pressable onPress={submitOption} hitSlop={6} accessibilityRole="button" accessibilityLabel="Thêm">
              <Ionicons name="arrow-up-circle" size={26} color={color.ink} />
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={() => setAdding(true)} style={styles.addBtn} accessibilityRole="button">
            <Ionicons name="add" size={18} color={color.ink} />
            <Text style={styles.addTxt}>Thêm phương án</Text>
          </Pressable>
        )
      ) : null}

      <Text style={styles.footer}>
        {revealed ? `${total} lượt bình chọn · ` : 'Ẩn kết quả · '}
        chạm để {poll.myVotes.length ? 'đổi hoặc rút phiếu' : 'bình chọn'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: color.surface, borderRadius: radius.card, padding: 16, marginBottom: 12, ...shadow.card },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  title: { ...font.cardTitle, color: color.ink },
  note: { ...font.sub, color: color.textMuted, marginTop: 3 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: color.bg, borderRadius: radius.chip, paddingHorizontal: 9, paddingVertical: 5 },
  chipTxt: { ...font.tiny, color: color.textMuted, fontWeight: '700' },

  tags: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  tag: { ...font.tiny, fontWeight: '700', color: color.textMuted, backgroundColor: color.bg, borderRadius: radius.chip, paddingHorizontal: 9, paddingVertical: 4, overflow: 'hidden' },

  opt: { borderRadius: radius.md, backgroundColor: color.bg, borderWidth: 1, borderColor: color.line, overflow: 'hidden', marginBottom: 9 },
  optMine: { borderColor: color.ink },
  bar: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: color.lineSoft },
  barMine: { backgroundColor: 'rgba(198,248,51,0.35)' },
  optRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 13, paddingVertical: 13 },
  optLabel: { flex: 1, ...font.body, color: color.ink, fontWeight: '600' },
  optLabelMine: { fontWeight: '800' },
  pct: { ...font.sub, color: color.ink, fontWeight: '800' },

  addRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: radius.md, borderWidth: 1, borderColor: color.ink, paddingHorizontal: 13, paddingVertical: 8, marginBottom: 9 },
  addInput: { flex: 1, ...font.body, color: color.ink, padding: 0, paddingVertical: 6 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: radius.md, borderWidth: 1, borderColor: color.line, borderStyle: 'dashed', paddingVertical: 12, marginBottom: 9 },
  addTxt: { ...font.sub, color: color.ink, fontWeight: '700' },

  footer: { ...font.tiny, color: color.textFaint, marginTop: 2 },
});
