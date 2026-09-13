import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { GoogleButton } from '../components/auth/GoogleButton';
import { useAuth } from '../state/AuthContext';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { RootStackParamList } from '../navigation/types';
import { color, font, radius, space, shadow } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const emailOk = (e: string) => /\S+@\S+\.\S+/.test(e.trim());

export default function RegisterScreen() {
  const nav = useNavigation<Nav>();
  const { register, signInWithGoogle } = useAuth();
  const google = useGoogleAuth(acc => signInWithGoogle(acc));
  const onGoogle = () => (google.ready ? google.prompt() : signInWithGoogle());
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);

  const match = password.length >= 6 && password === confirm;
  const canRegister = name.trim().length >= 2 && emailOk(email) && match;

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.h1}>Tạo tài khoản</Text>
          <Text style={styles.lead}>Tham gia SportApp để đặt sân, mua vé và quản lý câu lạc bộ.</Text>

          <Text style={styles.label}>Họ và tên</Text>
          <View style={styles.inputRow}>
            <Ionicons name="person-outline" size={18} color={color.textMuted} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="VD: Minh Khang"
              placeholderTextColor={color.textFaint}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={18} color={color.textMuted} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="ban@email.com"
              placeholderTextColor={color.textFaint}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <Text style={styles.label}>Mật khẩu</Text>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={18} color={color.textMuted} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Tối thiểu 6 ký tự"
              placeholderTextColor={color.textFaint}
              secureTextEntry={!show}
              autoCapitalize="none"
              returnKeyType="next"
            />
            <Pressable onPress={() => setShow(s => !s)} hitSlop={8} accessibilityLabel={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>
              <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={18} color={color.textMuted} />
            </Pressable>
          </View>

          <Text style={styles.label}>Nhập lại mật khẩu</Text>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={18} color={color.textMuted} />
            <TextInput
              style={styles.input}
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor={color.textFaint}
              secureTextEntry={!show}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={() => { if (canRegister) register(name, email); }}
            />
          </View>
          {confirm.length > 0 && !match ? (
            <Text style={styles.err}>Mật khẩu nhập lại chưa khớp (tối thiểu 6 ký tự).</Text>
          ) : null}

          <View style={{ marginTop: 20 }}>
            <PrimaryButton label="Đăng ký" onPress={() => register(name, email)} disabled={!canRegister} />
          </View>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.or}>hoặc</Text>
            <View style={styles.line} />
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

  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: color.line },
  or: { ...font.sub, color: color.textFaint },

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14 },
  footerTxt: { ...font.body, color: color.textMuted },
  footerLink: { ...font.body, color: color.ink, fontWeight: '800' },
});
