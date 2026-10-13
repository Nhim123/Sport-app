import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { GoogleButton } from '../components/auth/GoogleButton';
import { useAuth, type Gender, type FavoriteSport } from '../state/AuthContext';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { PasswordStrength } from '../components/auth/PasswordStrength';
import { evaluatePassword } from '../utils/passwordPolicy';
import { RootStackParamList } from '../navigation/types';
import { color, font, radius, space, shadow } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const emailOk = (e: string) => /\S+@\S+\.\S+/.test(e.trim());
const phoneOk = (p: string) => p.trim() === '' || /^0\d{8,10}$/.test(p.trim());

const GENDERS: { key: Gender; label: string }[] = [
  { key: 'male', label: 'Nam' }, { key: 'female', label: 'Nữ' }, { key: 'other', label: 'Khác' },
];
const SPORTS: { key: FavoriteSport; label: string }[] = [
  { key: 'pickle', label: '🏓 Pickleball' }, { key: 'gym', label: '🏋️ Gym' }, { key: 'football', label: '⚽ Bóng đá' },
];

export default function RegisterScreen() {
  const nav = useNavigation<Nav>();
  const { register, signInWithGoogle, requestOtp } = useAuth();
  const google = useGoogleAuth(acc => signInWithGoogle(acc));
  const onGoogle = () => (google.ready ? google.prompt() : signInWithGoogle());

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [sport, setSport] = useState<FavoriteSport | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [agree, setAgree] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sentCode, setSentCode] = useState('');
  const [otp, setOtp] = useState('');
  const [otpHint, setOtpHint] = useState('');

  const pw = evaluatePassword(password);
  const match = pw.strong && password === confirm;   // mật khẩu phải ĐẠT chính sách mạnh + khớp
  const canRegister = name.trim().length >= 2 && emailOk(email) && phoneVerified && match && agree;

  // Xác thực SĐT bằng OTP ngay trong form đăng ký (demo: so khớp mã requestOtp trả về).
  const sendCode = async () => {
    if (!/^0\d{8,10}$/.test(phone.trim())) return;
    const c = await requestOtp(phone);
    setSentCode(c); setOtpSent(true); setOtp(''); setOtpHint('Mã demo: ' + c);
  };
  const verifyCode = () => {
    if (sentCode && otp.trim() === sentCode) { setPhoneVerified(true); setOtpHint(''); }
    else setOtpHint('Mã OTP không đúng, thử lại.');
  };

  const submit = () => {
    if (!canRegister) return;
    register({ name, email, phone, phoneVerified: true, gender: gender ?? undefined, favoriteSport: sport ?? undefined });
  };

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.h1}>Tạo tài khoản</Text>
          <Text style={styles.lead}>Điền thông tin để tham gia SportApp — đặt sân, mua vé và quản lý câu lạc bộ.</Text>

          <Text style={styles.label}>Họ và tên *</Text>
          <View style={styles.inputRow}>
            <Ionicons name="person-outline" size={18} color={color.textMuted} />
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="VD: Minh Khang"
              placeholderTextColor={color.textFaint} autoCapitalize="words" returnKeyType="next" />
          </View>

          <Text style={styles.label}>Email *</Text>
          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={18} color={color.textMuted} />
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="ban@email.com"
              placeholderTextColor={color.textFaint} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} returnKeyType="next" />
          </View>

          <Text style={styles.label}>Số điện thoại * (cần xác thực)</Text>
          <View style={styles.inputRow}>
            <Ionicons name="call-outline" size={18} color={color.textMuted} />
            <TextInput style={styles.input} value={phone} editable={!phoneVerified}
              onChangeText={t => { setPhone(t); setPhoneVerified(false); setOtpSent(false); setOtpHint(''); }}
              placeholder="VD: 0901234567" placeholderTextColor={color.textFaint} keyboardType="phone-pad" returnKeyType="next" />
            {phoneVerified ? (
              <Ionicons name="shield-checkmark" size={18} color={color.voltDark} />
            ) : (
              <Pressable onPress={sendCode} disabled={!phoneOk(phone) || phone.trim() === ''} hitSlop={8} accessibilityRole="button">
                <Text style={[styles.linkBtn, (!phoneOk(phone) || phone.trim() === '') && styles.linkBtnOff]}>{otpSent ? 'Gửi lại' : 'Gửi mã'}</Text>
              </Pressable>
            )}
          </View>
          {phone.length > 0 && !phoneOk(phone) ? <Text style={styles.err}>Số điện thoại chưa hợp lệ.</Text> : null}
          {otpSent && !phoneVerified ? (
            <View style={[styles.inputRow, { marginTop: 10 }]}>
              <Ionicons name="keypad-outline" size={18} color={color.textMuted} />
              <TextInput style={styles.input} value={otp} onChangeText={t => setOtp(t.replace(/\D/g, '').slice(0, 6))}
                placeholder="Nhập mã OTP 6 số" placeholderTextColor={color.textFaint} keyboardType="number-pad" maxLength={6}
                returnKeyType="done" onSubmitEditing={verifyCode} />
              <Pressable onPress={verifyCode} hitSlop={8} accessibilityRole="button"><Text style={styles.linkBtn}>Xác nhận</Text></Pressable>
            </View>
          ) : null}
          {otpHint ? <Text style={otpHint.startsWith('Mã demo') ? styles.devHint : styles.err}>{otpHint}</Text> : null}
          {phoneVerified ? <Text style={styles.okTxt}>Đã xác thực số điện thoại.</Text> : null}

          <Text style={styles.label}>Giới tính</Text>
          <View style={styles.chipRow}>
            {GENDERS.map(g => (
              <Chip key={g.key} label={g.label} active={gender === g.key} onPress={() => setGender(g.key)} />
            ))}
          </View>

          <Text style={styles.label}>Bộ môn quan tâm</Text>
          <View style={styles.chipRow}>
            {SPORTS.map(s => (
              <Chip key={s.key} label={s.label} active={sport === s.key} onPress={() => setSport(s.key)} />
            ))}
          </View>

          <Text style={styles.label}>Mật khẩu *</Text>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={18} color={color.textMuted} />
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Tạo mật khẩu mạnh"
              placeholderTextColor={color.textFaint} secureTextEntry={!show} autoCapitalize="none" returnKeyType="next" />
            <Pressable onPress={() => setShow(s => !s)} hitSlop={8} accessibilityLabel={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>
              <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={18} color={color.textMuted} />
            </Pressable>
          </View>
          <PasswordStrength password={password} />

          <Text style={styles.label}>Nhập lại mật khẩu *</Text>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={18} color={color.textMuted} />
            <TextInput style={styles.input} value={confirm} onChangeText={setConfirm} placeholder="Nhập lại mật khẩu"
              placeholderTextColor={color.textFaint} secureTextEntry={!show} autoCapitalize="none" returnKeyType="done" onSubmitEditing={submit} />
          </View>
          {confirm.length > 0 && password !== confirm ? <Text style={styles.err}>Mật khẩu nhập lại chưa khớp.</Text> : null}

          <Pressable style={styles.agreeRow} onPress={() => setAgree(a => !a)} accessibilityRole="checkbox" accessibilityState={{ checked: agree }}>
            <Ionicons name={agree ? 'checkbox' : 'square-outline'} size={20} color={agree ? color.voltDark : color.navIdle} />
            <Text style={styles.agreeTxt}>Tôi đồng ý với Điều khoản sử dụng & Chính sách bảo mật.</Text>
          </Pressable>

          <View style={{ marginTop: 16 }}>
            <PrimaryButton label="Đăng ký" onPress={submit} disabled={!canRegister} />
          </View>

          <View style={styles.divider}>
            <View style={styles.line} /><Text style={styles.or}>hoặc</Text><View style={styles.line} />
          </View>

          <GoogleButton label={google.loading ? 'Đang mở Google…' : 'Đăng ký với Google'} onPress={onGoogle} />
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerTxt}>Đã có tài khoản? </Text>
          <Pressable onPress={() => nav.navigate('Login')} hitSlop={6} accessibilityRole="button">
            <Text style={styles.footerLink}>Đăng nhập</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: active }}
      style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}>
      <Text style={[styles.chipTxt, { color: active ? color.volt : color.ink }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  content: { paddingHorizontal: space.xl, paddingTop: 12, paddingBottom: 24 },

  h1: { ...font.h1, color: color.ink, marginTop: 8 },
  lead: { ...font.body, color: color.textMuted, marginTop: 6, lineHeight: 20 },

  label: { ...font.sub, color: color.textMuted, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: color.surface,
    borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 13, ...shadow.card,
  },
  input: { flex: 1, ...font.body, color: color.ink, padding: 0 },
  err: { ...font.sub, color: color.danger, marginTop: 8 },
  linkBtn: { ...font.sub, color: color.voltDark, fontWeight: '800' },
  linkBtnOff: { color: color.textFaint },
  devHint: { ...font.sub, color: color.voltDark, fontWeight: '700', marginTop: 8 },
  okTxt: { ...font.sub, color: color.voltDark, fontWeight: '700', marginTop: 8 },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.chip },
  chipActive: { backgroundColor: color.ink },
  chipIdle: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.line },
  chipTxt: { ...font.body, fontWeight: '700' },

  agreeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 18 },
  agreeTxt: { flex: 1, ...font.sub, color: color.textMuted, lineHeight: 18 },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: color.line },
  or: { ...font.sub, color: color.textFaint },

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14 },
  footerTxt: { ...font.body, color: color.textMuted },
  footerLink: { ...font.body, color: color.ink, fontWeight: '800' },
});
