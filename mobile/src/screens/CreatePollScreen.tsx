import { useState, useRef, useLayoutEffect } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FilterChip } from '../components/chips/FilterChip';
import { usePolls } from '../state/PollContext';
import { days } from '../data/mock';
import { RootStackParamList } from '../navigation/types';
import { ClubPoll } from '../types';
import { color, font, radius } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const uid = () => Math.random().toString(36).slice(2, 9);
const MAX_OPTIONS = 10;
const ACCENT = '#2F80ED';   // xanh dương kiểu Zalo cho liên kết & nút TẠO

// Vòng lặp preset thời hạn (chạm để đổi).
const DEADLINES = [undefined, 'còn 1 ngày', 'còn 3 ngày', 'còn 7 ngày'] as const;

export default function CreatePollScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'CreatePoll'>>();
  const { addPoll } = usePolls();

  const [pinned, setPinned] = useState(false);
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [deadlineIdx, setDeadlineIdx] = useState(0);
  const [dayKey, setDayKey] = useState<string | undefined>(undefined);
  const [showDays, setShowDays] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [hideResults, setHideResults] = useState(false);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [allowAddOption, setAllowAddOption] = useState(false);

  const filled = options.map(o => o.trim()).filter(Boolean);
  const canCreate = title.trim().length >= 2 && filled.length >= 2;

  const setOpt = (i: number, v: string) => setOptions(prev => prev.map((o, idx) => (idx === i ? v : o)));
  const addOpt = () => setOptions(prev => (prev.length >= MAX_OPTIONS ? prev : [...prev, '']));
  const removeOpt = (i: number) =>
    setOptions(prev => (prev.length <= 2 ? prev.map((o, idx) => (idx === i ? '' : o)) : prev.filter((_, idx) => idx !== i)));

  const dayLabel = dayKey ? (() => { const d = days.find(x => x.key === dayKey); return d ? `${d.dow} · ${d.day}/08` : 'Không gắn'; })() : 'Không gắn';

  const create = () => {
    if (!canCreate) return;
    const closesLabel = DEADLINES[deadlineIdx];
    const poll: ClubPoll = {
      id: uid(),
      club: params.club,
      title: title.trim(),
      dayKey,
      note: dayKey ? `Buổi sinh hoạt ${dayLabel}` : undefined,
      closesLabel,
      options: filled.map(label => ({ id: uid(), label, votes: 0 })),
      myVotes: [],
      allowMultiple,
      allowAddOption,
      anonymous,
      hideResults,
      pinned,
    };
    addPoll(poll);
    nav.goBack();
  };

  // Header: tiêu đề 2 dòng + nút TẠO ở góc trên bên phải (như Zalo).
  const createRef = useRef(create);
  createRef.current = create;
  useLayoutEffect(() => {
    nav.setOptions({
      headerTitle: () => (
        <View>
          <Text style={styles.hTitle}>Tạo bình chọn mới</Text>
          <Text style={styles.hSub}>CLB: {params.club}</Text>
        </View>
      ),
      headerRight: () => (
        <Pressable onPress={() => createRef.current()} disabled={!canCreate} hitSlop={8} style={{ marginRight: 14 }} accessibilityRole="button">
          <Text style={[styles.create, { color: canCreate ? ACCENT : color.textFaint }]}>TẠO</Text>
        </Pressable>
      ),
    });
  }, [nav, canCreate, params.club]);

  return (
    <ScrollView style={styles.root} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      {/* Ghim */}
      <Pressable style={styles.pinRow} onPress={() => setPinned(p => !p)} accessibilityRole="checkbox" accessibilityState={{ checked: pinned }}>
        <Ionicons name={pinned ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={pinned ? ACCENT : color.textMuted} />
        <Text style={styles.pinTxt}>Ghim lên đầu CLB</Text>
      </Pressable>

      {/* Câu hỏi */}
      <View style={styles.block}>
        <TextInput
          style={styles.question}
          value={title}
          onChangeText={setTitle}
          placeholder="Đặt câu hỏi bình chọn"
          placeholderTextColor={color.textFaint}
          multiline
          maxLength={120}
        />
      </View>

      {/* Phương án */}
      <View style={styles.block}>
        {options.map((o, i) => (
          <View key={i} style={styles.optRow}>
            <TextInput
              style={styles.optInput}
              value={o}
              onChangeText={t => setOpt(i, t)}
              placeholder={`Phương án ${i + 1}`}
              placeholderTextColor={color.textFaint}
              maxLength={60}
            />
            <Pressable onPress={() => removeOpt(i)} hitSlop={8} accessibilityLabel="Xoá phương án">
              <Ionicons name="close" size={20} color={color.textMuted} />
            </Pressable>
          </View>
        ))}
        {options.length < MAX_OPTIONS ? (
          <Pressable style={styles.addRow} onPress={addOpt} accessibilityRole="button">
            <Text style={styles.link}>Thêm phương án</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Tuỳ chọn */}
      <View style={styles.gap} />
      <Text style={styles.optHeading}>Tuỳ chọn</Text>

      <Pressable style={styles.setRow} onPress={() => setDeadlineIdx(i => (i + 1) % DEADLINES.length)}>
        <View style={{ flex: 1 }}>
          <Text style={styles.setLabel}>Đặt thời hạn</Text>
          <Text style={styles.setSub}>{DEADLINES[deadlineIdx] ? `Đóng sau: ${DEADLINES[deadlineIdx]}` : 'Không có thời hạn'}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={color.textFaint} />
      </Pressable>
      <View style={styles.hr} />

      {/* Gắn lịch sinh hoạt (mở rộng chọn ngày) */}
      <Pressable style={styles.setRow} onPress={() => setShowDays(s => !s)}>
        <View style={{ flex: 1 }}>
          <Text style={styles.setLabel}>Gắn lịch sinh hoạt</Text>
          <Text style={styles.setSub}>{dayLabel}</Text>
        </View>
        <Ionicons name={showDays ? 'chevron-down' : 'chevron-forward'} size={18} color={color.textFaint} />
      </Pressable>
      {showDays ? (
        <View style={styles.dayRow}>
          <FilterChip label="Không gắn" active={dayKey === undefined} onPress={() => setDayKey(undefined)} />
          {days.map(d => (
            <FilterChip key={d.key} label={`${d.dow} ${d.day}`} active={dayKey === d.key} onPress={() => setDayKey(d.key)} />
          ))}
        </View>
      ) : null}
      <View style={styles.hr} />

      <ToggleRow label="Ẩn người bình chọn" value={anonymous} onChange={setAnonymous} />
      <View style={styles.hr} />
      <ToggleRow label="Ẩn kết quả khi chưa bình chọn" value={hideResults} onChange={setHideResults} />
      <View style={styles.hr} />
      <ToggleRow label="Chọn nhiều phương án" value={allowMultiple} onChange={setAllowMultiple} />
      <View style={styles.hr} />
      <ToggleRow label="Có thể thêm phương án" value={allowAddOption} onChange={setAllowAddOption} />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: ACCENT, false: color.line }} thumbColor="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.surface },

  hTitle: { fontSize: 16, fontWeight: '800', color: color.ink },
  hSub: { fontSize: 12, color: color.textMuted, marginTop: 1 },
  create: { fontSize: 15, fontWeight: '800' },

  pinRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: color.bg, paddingHorizontal: 20, paddingVertical: 16 },
  pinTxt: { ...font.body, color: color.ink },

  block: { paddingHorizontal: 20 },
  question: { ...font.h2, color: color.ink, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: color.line },
  optRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: color.line },
  optInput: { flex: 1, ...font.body, color: color.ink, paddingVertical: 16 },
  addRow: { paddingVertical: 16 },
  link: { ...font.body, color: ACCENT, fontWeight: '700' },

  gap: { height: 12, backgroundColor: color.bg },
  optHeading: { ...font.sub, color: ACCENT, fontWeight: '800', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 6 },

  setRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  setLabel: { ...font.body, color: color.ink },
  setSub: { ...font.sub, color: color.textMuted, marginTop: 3 },

  dayRow: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 10, paddingHorizontal: 20, paddingBottom: 14 },

  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  toggleLabel: { ...font.body, color: color.ink, flex: 1 },

  hr: { height: 1, backgroundColor: color.line, marginLeft: 20 },
});
