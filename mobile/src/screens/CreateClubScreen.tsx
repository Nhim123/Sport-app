import { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
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
// Bộ tạo logo: chọn biểu tượng + màu nền (gradient).
const LOGO_EMOJIS = ['🏓', '⚽', '🏀', '🏸', '🎾', '🏐', '🏋️', '💪', '🏆', '🔥', '⭐', '🚀'];
const GRADIENTS: readonly (readonly [string, string])[] = [grad.dark, grad.green, grad.olive, grad.volt];

export default function CreateClubScreen() {
  const nav = useNavigation<Nav>();
  const { joinClub } = usePasses();

  const [name, setName] = useState('');
  const [sports, setSports] = useState<Sport[]>(['pickle']);
  const [logoMode, setLogoMode] = useState<'preset' | 'upload'>('preset');   // dùng logo có sẵn | tải logo mới
  const [logoEmoji, setLogoEmoji] = useState('🏓');
  const [gradIdx, setGradIdx] = useState(0);
  const [logoUri, setLogoUri] = useState<string | null>(null);   // ảnh logo tải lên
  const useUploaded = logoMode === 'upload' && !!logoUri;
  const [district, setDistrict] = useState('');
  const [about, setAbout] = useState('');
  const [privacy, setPrivacy] = useState<Privacy>('open');

  const logoGrad = GRADIENTS[gradIdx];

  const trimmed = name.trim();
  const canCreate = trimmed.length >= 2 && sports.length > 0;

  // Chọn nhiều bộ môn; không cho bỏ bộ môn cuối cùng để CLB luôn có ít nhất 1 môn.
  const toggleSport = (s: Sport) =>
    setSports(prev => (prev.includes(s) ? (prev.length > 1 ? prev.filter(x => x !== s) : prev) : [...prev, s]));

  // Tải ảnh logo lên: cho crop vuông 1:1 rồi hiển thị cover → tự căn vừa khung.
  const pickLogo = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!res.canceled && res.assets[0]?.uri) setLogoUri(res.assets[0].uri);
  };

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
        {/* Xem trước thẻ CLB (dùng logo tự tạo) */}
        <View style={styles.preview}>
          {useUploaded ? (
            <Image source={{ uri: logoUri! }} style={styles.thumb} resizeMode="cover" />
          ) : (
            <LinearGradient colors={logoGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.thumb}>
              <Text style={styles.thumbEmoji}>{logoEmoji}</Text>
            </LinearGradient>
          )}
          <View style={styles.previewMid}>
            <Text style={styles.previewName} numberOfLines={1}>{trimmed || 'Tên câu lạc bộ'}</Text>
            <Text style={styles.previewSub} numberOfLines={1}>
              1 thành viên · {sports.length} bộ môn
              {district.trim() ? ` · ${district.trim()}` : ''}
            </Text>
          </View>
        </View>

        {/* Tạo logo câu lạc bộ — 2 lựa chọn: dùng logo có sẵn hoặc tải logo mới */}
        <Text style={styles.label}>Logo câu lạc bộ</Text>
        <SegmentedTabs
          value={logoMode}
          options={[{ key: 'preset', label: 'Logo có sẵn' }, { key: 'upload', label: 'Tải logo mới' }]}
          onChange={setLogoMode}
        />

        {logoMode === 'preset' ? (
          <>
            <Text style={styles.labelHint2}>Chọn biểu tượng</Text>
            <View style={styles.emojiGrid}>
              {LOGO_EMOJIS.map(e => (
                <Pressable
                  key={e}
                  onPress={() => setLogoEmoji(e)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: logoEmoji === e }}
                  style={[styles.emojiCell, logoEmoji === e && styles.emojiCellOn]}
                >
                  <Text style={styles.emojiTxt}>{e}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.labelHint2}>Màu nền</Text>
            <View style={styles.swatchRow}>
              {GRADIENTS.map((g, i) => (
                <Pressable
                  key={i}
                  onPress={() => setGradIdx(i)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: gradIdx === i }}
                  style={[styles.swatchWrap, gradIdx === i && styles.swatchOn]}
                >
                  <LinearGradient colors={g} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.swatch} />
                </Pressable>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={{ height: 12 }} />
            <Pressable onPress={pickLogo} accessibilityRole="button" style={styles.uploadBtn}>
              <Ionicons name={logoUri ? 'sync-outline' : 'cloud-upload-outline'} size={18} color={color.ink} />
              <Text style={styles.uploadTxt}>{logoUri ? 'Đổi ảnh logo' : 'Tải ảnh logo lên'}</Text>
            </Pressable>
            {logoUri ? (
              <Pressable onPress={() => setLogoUri(null)} accessibilityRole="button" style={styles.removeBtn}>
                <Ionicons name="trash-outline" size={16} color={color.danger} />
                <Text style={styles.removeTxt}>Xoá ảnh</Text>
              </Pressable>
            ) : (
              <Text style={styles.hint}>Chọn ảnh vuông (1:1) — hệ thống tự căn cho vừa khung logo.</Text>
            )}
          </>
        )}

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
  thumb: { width: 56, height: 56, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: color.bg },
  thumbEmoji: { fontSize: 26 },
  previewMid: { flex: 1 },
  previewName: { ...font.cardTitle, color: color.ink },
  previewSub: { ...font.sub, color: color.textFaint, marginTop: 3 },

  label: { ...font.section, color: color.ink, marginTop: 22, marginBottom: 10 },
  labelHint: { ...font.sub, color: color.textMuted, fontWeight: '600' },
  labelHint2: { ...font.sub, color: color.textMuted, marginTop: 4, marginBottom: 8 },
  sportRow: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 10 },

  // Bộ tạo logo
  uploadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: color.surface, borderRadius: radius.md, borderWidth: 1, borderColor: color.line, borderStyle: 'dashed', paddingVertical: 14 },
  uploadTxt: { ...font.body, color: color.ink, fontWeight: '700' },
  removeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, marginTop: 6 },
  removeTxt: { ...font.sub, color: color.danger, fontWeight: '700' },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  emojiCell: { width: 46, height: 46, borderRadius: 12, backgroundColor: color.surface, borderWidth: 1, borderColor: color.line, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  emojiCellOn: { borderWidth: 2, borderColor: color.ink },
  emojiTxt: { fontSize: 22 },
  swatchRow: { flexDirection: 'row', gap: 12 },
  swatchWrap: { width: 46, height: 46, borderRadius: 23, padding: 3, borderWidth: 2, borderColor: 'transparent' },
  swatchOn: { borderColor: color.ink },
  swatch: { flex: 1, borderRadius: 20 },
  input: {
    backgroundColor: color.surface, borderRadius: radius.md, paddingHorizontal: 15, paddingVertical: 13,
    ...font.body, color: color.ink, ...shadow.card,
  },
  textarea: { minHeight: 96, paddingTop: 13 },
  hint: { ...font.sub, color: color.textMuted, marginTop: 10 },

  footer: { paddingHorizontal: space.xl, paddingTop: 12, paddingBottom: 24, backgroundColor: color.surface, borderTopWidth: 1, borderTopColor: color.line },
});
