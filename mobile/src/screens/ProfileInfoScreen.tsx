import { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { useAuth, type Gender, type FavoriteSport } from '../state/AuthContext';
import { RootStackParamList } from '../navigation/types';
import { color, font, radius, space, shadow } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ProfileInfo'>;
const phoneOk = (p: string) => /^0\d{8,10}$/.test(p.trim());
const GENDERS: { key: Gender; label: string }[] = [
  { key: 'male', label: 'Nam' }, { key: 'female', label: 'Nữ' }, { key: 'other', label: 'Khác' },
];
const SPORTS: { key: FavoriteSport; label: string }[] = [
  { key: 'pickle', label: '🏓 Pickleball' }, { key: 'gym', label: '🏋️ Gym' }, { key: 'football', label: '⚽ Bóng đá' },
];
const GENDER_LABEL: Record<string, string> = { male: 'Nam', female: 'Nữ', other: 'Khác' };
const SPORT_LABEL: Record<string, string> = { pickle: '🏓 Pickleball', gym: '🏋️ Gym', football: '⚽ Bóng đá' };

// Màn "Hồ sơ & thông tin": xem toàn bộ thông tin đã đăng ký + chỉnh sửa (gộp Hồ sơ + Thông tin).
export default function ProfileInfoScreen() {
  const nav = useNavigation<Nav>();
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [gender, setGender] = useState<Gender | null>(user?.gender ?? null);
  const [sport, setSport] = useState<FavoriteSport | null>(user?.favoriteSport ?? null);

  if (!user) return <View style={styles.root} />;

  const phoneChanged = (phone.trim() || undefined) !== (user.phone || undefined);
  const canSave = name.trim().length >= 2 && (phone.trim() === '' || phoneOk(phone));

  const save = () => {
    if (!canSave) return;
    updateProfile({
      name: name.trim(),
      phone: phone.trim() || undefined,
      gender: gender ?? undefined,
      favoriteSport: sport ?? undefined,
      phoneVerified: phoneChanged ? false : user.phoneVerified,
    });
    setEditing(false);
    if (phoneChanged && phone.trim()) {
      Alert.alert('Đã lưu', 'Số điện thoại mới cần xác thực lại.', [
        { text: 'Để sau' },
        { text: 'Xác thực ngay', onPress: () => nav.navigate('PhoneVerify', { phone: phone.trim() }) },
      ]);
    }
  };

  const cancel = () => {
    setName(user.name); setPhone(user.phone ?? '');
    setGender(user.gender ?? null); setSport(user.favoriteSport ?? null);
    setEditing(false);
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {!editing ? (
            <>
              <View style={styles.card}>
                <Row icon="person-outline" label="Họ và tên" value={user.name} />
                <Row icon="mail-outline" label="Email" value={user.email} />
                <Row icon="call-outline" label="Số điện thoại" value={user.phone || 'Chưa có'}
                  badge={user.phone ? (user.phoneVerified ? 'verified' : 'unverified') : undefined} />
                <Row icon="male-female-outline" label="Giới tính" value={user.gender ? GENDER_LABEL[user.gender] : '—'} />
                <Row icon="trophy-outline" label="Bộ môn" value={user.favoriteSport ? SPORT_LABEL[user.favoriteSport] : '—'} />
                <Row icon="shield-checkmark-outline" label="Đăng nhập" value={user.provider === 'google' ? 'Google' : 'Email & mật khẩu'} last />
              </View>
              <View style={{ marginTop: 20 }}>
                <PrimaryButton label="Chỉnh sửa thông tin" onPress={() => setEditing(true)} />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.label}>Họ và tên</Text>
              <View style={styles.inputRow}>
                <Ionicons name="person-outline" size={18} color={color.textMuted} />
                <TextInput style={styles.input} value={name} onChangeText={setName} autoCapitalize="words"
                  placeholder="Họ và tên" placeholderTextColor={color.textFaint} />
              </View>

              <Text style={styles.label}>Email (không đổi)</Text>
              <View style={[styles.inputRow, styles.readonly]}>
                <Ionicons name="mail-outline" size={18} color={color.textMuted} />
                <Text style={styles.roTxt} numberOfLines={1}>{user.email}</Text>
              </View>

              <Text style={styles.label}>Số điện thoại</Text>
              <View style={styles.inputRow}>
                <Ionicons name="call-outline" size={18} color={color.textMuted} />
                <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad"
                  placeholder="0901234567" placeholderTextColor={color.textFaint} />
              </View>
              {phone.length > 0 && !phoneOk(phone) ? <Text style={styles.err}>Số điện thoại chưa hợp lệ.</Text> : null}
              {phoneChanged && phone.trim() ? <Text style={styles.hint}>SĐT mới sẽ cần xác thực lại sau khi lưu.</Text> : null}

              <Text style={styles.label}>Giới tính</Text>
              <View style={styles.chipRow}>
                {GENDERS.map(g => <Chip key={g.key} label={g.label} active={gender === g.key} onPress={() => setGender(g.key)} />)}
              </View>

              <Text style={styles.label}>Bộ môn quan tâm</Text>
              <View style={styles.chipRow}>
                {SPORTS.map(s => <Chip key={s.key} label={s.label} active={sport === s.key} onPress={() => setSport(s.key)} />)}
              </View>

              <View style={{ marginTop: 20 }}>
                <PrimaryButton label="Lưu thay đổi" onPress={save} disabled={!canSave} />
              </View>
              <Pressable style={styles.cancel} onPress={cancel} accessibilityRole="button">
                <Text style={styles.cancelTxt}>Huỷ</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Row({ icon, label, value, badge, last }: {
  icon: keyof typeof Ionicons.glyphMap; label: string; value: string; badge?: 'verified' | 'unverified'; last?: boolean;
}) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Ionicons name={icon} size={18} color={color.textMuted} />
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        <Text style={styles.rowVal} numberOfLines={1}>{value}</Text>
        {badge === 'verified' ? <View style={[styles.tag, { borderColor: color.voltDark }]}><Text style={[styles.tagTxt, { color: color.voltDark }]}>Đã xác thực</Text></View> : null}
        {badge === 'unverified' ? <View style={[styles.tag, { borderColor: color.danger }]}><Text style={[styles.tagTxt, { color: color.danger }]}>Chưa xác thực</Text></View> : null}
      </View>
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active ? styles.chipOn : styles.chipOff]}
      accessibilityRole="button" accessibilityState={{ selected: active }}>
      <Text style={[styles.chipTxt, { color: active ? color.volt : color.ink }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  content: { paddingHorizontal: space.xl, paddingTop: 14, paddingBottom: 28 },

  card: { backgroundColor: color.surface, borderRadius: radius.card, paddingHorizontal: 16, ...shadow.card },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#ECEAE5' },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: { ...font.sub, color: color.textMuted, fontWeight: '600', width: 96 },
  rowRight: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8 },
  rowVal: { fontSize: 13.5, fontWeight: '700', color: color.ink, flexShrink: 1, textAlign: 'right' },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.chip, borderWidth: 1.5 },
  tagTxt: { ...font.tiny, fontWeight: '800' },

  label: { ...font.sub, color: color.textMuted, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: color.surface,
    borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 13, ...shadow.card,
  },
  input: { flex: 1, ...font.body, color: color.ink, padding: 0 },
  readonly: { opacity: 0.7 },
  roTxt: { flex: 1, ...font.body, color: color.textMuted },
  err: { ...font.sub, color: color.danger, marginTop: 8 },
  hint: { ...font.sub, color: color.textMuted, marginTop: 8 },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.chip },
  chipOn: { backgroundColor: color.ink },
  chipOff: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.line },
  chipTxt: { ...font.body, fontWeight: '700' },

  cancel: { paddingVertical: 14, alignItems: 'center', marginTop: 6 },
  cancelTxt: { ...font.body, fontWeight: '700', color: color.textMuted },
});
