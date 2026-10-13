import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { useAuth } from '../state/AuthContext';
import { RootStackParamList } from '../navigation/types';
import { color, font, radius, space, shadow } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList, 'PhoneVerify'>;
const phoneOk = (p: string) => /^0\d{8,10}$/.test(p.trim());

export default function PhoneVerifyScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'PhoneVerify'>>();
  const { requestOtp, verifyOtp } = useAuth();

  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState(params?.phone ?? '');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState('');     // mã demo (gỡ khi có backend gửi SMS)
  const [left, setLeft] = useState(0);      // đếm ngược "gửi lại"
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const startCooldown = () => {
    setLeft(60);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setLeft(s => {
      if (s <= 1 && timer.current) clearInterval(timer.current);
      return s - 1;
    }), 1000);
  };

  const send = async () => {
    if (!phoneOk(phone) || busy) return;
    setBusy(true);
    const c = await requestOtp(phone);
    setBusy(false);
    setHint('Mã demo: ' + c);   // DEMO: backend thật sẽ gửi SMS, bỏ dòng này
    setCode('');
    setStep('code');
    startCooldown();
  };

  const resend = async () => {
    if (left > 0 || busy) return;
    const c = await requestOtp(phone);
    setHint('Mã demo: ' + c);
    startCooldown();
  };

  const verify = async () => {
    if (code.trim().length !== 6 || busy) return;
    setBusy(true);
    const ok = await verifyOtp(phone, code);
    setBusy(false);
    if (ok) {
      Alert.alert('Xác thực thành công', 'Số điện thoại ' + phone.trim() + ' đã được xác thực.',
        [{ text: 'OK', onPress: () => nav.goBack() }]);
    } else {
      Alert.alert('Mã không đúng', 'Mã OTP sai hoặc đã hết hạn. Vui lòng thử lại.');
    }
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <View style={styles.hero}>
            <Ionicons name="shield-checkmark-outline" size={34} color={color.voltDark} />
          </View>

          {step === 'phone' ? (
            <>
              <Text style={styles.title}>Xác thực số điện thoại</Text>
              <Text style={styles.sub}>Nhập số điện thoại để nhận mã OTP gồm 6 chữ số.</Text>

              <View style={styles.inputRow}>
                <Ionicons name="call-outline" size={18} color={color.textMuted} />
                <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="0901234567"
                  placeholderTextColor={color.textFaint} keyboardType="phone-pad" returnKeyType="done"
                  autoFocus onSubmitEditing={send} />
              </View>
              {phone.length > 0 && !phoneOk(phone) ? <Text style={styles.err}>Số điện thoại chưa hợp lệ.</Text> : null}

              <View style={{ marginTop: 20 }}>
                <PrimaryButton label="Gửi mã OTP" onPress={send} disabled={!phoneOk(phone) || busy} />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>Nhập mã OTP</Text>
              <Text style={styles.sub}>Mã đã gửi tới <Text style={styles.strong}>{phone.trim()}</Text>.</Text>

              <View style={styles.inputRow}>
                <Ionicons name="keypad-outline" size={18} color={color.textMuted} />
                <TextInput style={[styles.input, styles.code]} value={code} onChangeText={t => setCode(t.replace(/\D/g, '').slice(0, 6))}
                  placeholder="------" placeholderTextColor={color.textFaint} keyboardType="number-pad"
                  maxLength={6} autoFocus onSubmitEditing={verify} />
              </View>
              {hint ? <Text style={styles.devHint}>{hint}</Text> : null}

              <Pressable onPress={resend} disabled={left > 0} hitSlop={8} style={{ marginTop: 12 }}>
                <Text style={[styles.resend, left > 0 && styles.resendOff]}>
                  {left > 0 ? `Gửi lại mã sau ${left}s` : 'Gửi lại mã'}
                </Text>
              </Pressable>

              <View style={{ marginTop: 20 }}>
                <PrimaryButton label="Xác nhận" onPress={verify} disabled={code.length !== 6 || busy} />
              </View>

              <Pressable onPress={() => setStep('phone')} hitSlop={8} style={{ marginTop: 16, alignSelf: 'center' }}>
                <Text style={styles.changeNum}>Đổi số điện thoại</Text>
              </Pressable>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  content: { flex: 1, paddingHorizontal: space.xl, paddingTop: 24 },
  hero: { width: 64, height: 64, borderRadius: 20, backgroundColor: color.surface, alignItems: 'center', justifyContent: 'center', ...shadow.card, marginBottom: 20 },
  title: { ...font.h1, color: color.ink },
  sub: { ...font.body, color: color.textMuted, marginTop: 8, lineHeight: 20 },
  strong: { color: color.ink, fontWeight: '800' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: color.surface,
    borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 14, ...shadow.card, marginTop: 24,
  },
  input: { flex: 1, ...font.body, color: color.ink, padding: 0 },
  code: { fontSize: 22, fontWeight: '800', letterSpacing: 8 },
  err: { ...font.sub, color: color.danger, marginTop: 8 },
  devHint: { ...font.sub, color: color.voltDark, fontWeight: '700', marginTop: 10 },
  resend: { ...font.sub, color: color.voltDark, fontWeight: '800' },
  resendOff: { color: color.textMuted, fontWeight: '600' },
  changeNum: { ...font.sub, color: color.textMuted, fontWeight: '700' },
});
