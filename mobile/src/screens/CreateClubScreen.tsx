import { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FilterChip } from '../components/chips/FilterChip';
import { SegmentedTabs } from '../components/chips/SegmentedTabs';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { usePasses } from '../state/PassContext';
import { myClubs } from '../data/mock';
import { RootStackParamList } from '../navigation/types';
import { Sport } from '../types';
import { color, grad, font, radius, space, shadow } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Privacy = 'open' | 'approval';

const SPORTS: { key: Sport; label: string }[] = [
  { key: 'pickle', label: '🏓 Pickleball' },
  { key: 'football', label: '⚽ Bóng đá' },
  { key: 'gym', label: '🏋️ Gym' },
];
const SPORT_EMOJI: Record<Sport, string> = { pickle: '🏓', gym: '🏋️', football: '⚽' };
const SPORT_GRAD: Record<Sport, readonly [string, string]> = { pickle: grad.dark, football: grad.green, gym: grad.olive };

export default function CreateClubScreen() {
  const nav = useNavigation<Nav>();
  const { joinClub } = usePasses();

  const [name, setName] = useState('');
  const [sports, setSports] = useState<Sport[]>(['pickle']);
  const [district, setDistrict] = useState('');
  const [about, setAbout] = useState('');
  const [privacy, setPrivacy] = useState<Privacy>('open');

  const trimmed = name.trim();
  const canCreate = trimmed.length >= 2 && sports.length > 0;

  // Chọn nhiều bộ môn; không cho bỏ bộ môn cuối cùng để CLB luôn có ít nhất 1 môn.
  const toggleSport = (s: Sport) =>
    setSports(prev => (prev.includes(s) ? (prev.length > 1 ? prev.filter(x => x !== s) : prev) : [...prev, s]));

  const primarySport = sports[0] ?? 'pickle';

  const create = () => {
    if (!canCreate) return;
    joinClub();
    // Demo: mở màn quản lý CLB dưới vai trò Chủ hội, tiêu đề là tên vừa đặt.
    const ownerId = myClubs.find(c => c.myRole === 'owner')?.id ?? myClubs[0].id;
    nav.navigate('ClubDetail', { id: ownerId, name: trimmed });
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{ padding: space.xl, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Xem trước thẻ CLB */}
        <View style={styles.preview}>
          <LinearGradient colors={SPORT_GRAD[primarySport]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.thumb}>
            <Text style={styles.thumbEmoji}>{sports.map(s => SPORT_EMOJI[s]).join(' ')}</Text>
          </LinearGradient>
          <View style={styles.previewMid}>
            <Text style={styles.previewName} numberOfLines={1}>{trimmed || 'Tên câu lạc bộ'}</Text>
            <Text style={styles.previewSub} numberOfLines={1}>
              1 thành viên · {sports.length} bộ môn
              {district.trim() ? ` · ${district.trim()}` : ''}
            </Text>
          </View>
        </View>

        <Text style={styles.label}>Tên câu lạc bộ</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="VD: Q7 Smashers"
          placeholderTextColor={color.textFaint}
          maxLength={40}
          returnKeyType="next"
        />

        <Text style={styles.label}>Bộ môn <Text style={styles.labelHint}>(chọn 1 hoặc nhiều)</Text></Text>
        <View style={styles.sportRow}>
          {SPORTS.map(s => (
            <FilterChip key={s.key} label={s.label} active={sports.includes(s.key)} onPress={() => toggleSport(s.key)} />
          ))}
        </View>

        <Text style={styles.label}>Khu vực</Text>
        <TextInput
          style={styles.input}
          value={district}
          onChangeText={setDistrict}
          placeholder="VD: Quận 7, TP.HCM"
          placeholderTextColor={color.textFaint}
          maxLength={60}
        />

        <Text style={styles.label}>Giới thiệu</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={about}
          onChangeText={setAbout}
          placeholder="Mô tả ngắn về câu lạc bộ, lịch sinh hoạt, trình độ…"
          placeholderTextColor={color.textFaint}
          multiline
          numberOfLines={4}
          maxLength={240}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Quyền tham gia</Text>
        <SegmentedTabs
          value={privacy}
          options={[{ key: 'open', label: 'Công khai' }, { key: 'approval', label: 'Cần duyệt' }]}
          onChange={setPrivacy}
        />
        <Text style={styles.hint}>
          {privacy === 'open'
            ? 'Ai cũng có thể tìm và tham gia ngay.'
            : 'Người mới phải được chủ hội duyệt trước khi tham gia.'}
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Tạo câu lạc bộ" onPress={create} disabled={!canCreate} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },

  preview: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: color.surface, borderRadius: radius.card, padding: 14, marginBottom: 8, ...shadow.card },
  thumb: { width: 56, height: 56, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  thumbEmoji: { fontSize: 26 },
  previewMid: { flex: 1 },
  previewName: { ...font.cardTitle, color: color.ink },
  previewSub: { ...font.sub, color: color.textFaint, marginTop: 3 },

  label: { ...font.section, color: color.ink, marginTop: 22, marginBottom: 10 },
  labelHint: { ...font.sub, color: color.textMuted, fontWeight: '600' },
  sportRow: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 10 },
  input: {
    backgroundColor: color.surface, borderRadius: radius.md, paddingHorizontal: 15, paddingVertical: 13,
    ...font.body, color: color.ink, ...shadow.card,
  },
  textarea: { minHeight: 96, paddingTop: 13 },
  hint: { ...font.sub, color: color.textMuted, marginTop: 10 },

  footer: { paddingHorizontal: space.xl, paddingTop: 12, paddingBottom: 24, backgroundColor: color.surface, borderTopWidth: 1, borderTopColor: color.line },
});
