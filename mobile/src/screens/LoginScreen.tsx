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

export default function LoginScreen() {
  const nav = useNavigation<Nav>();
  const { signIn, signInWithGoogle } = useAuth();
  const google = useGoogleAuth(acc => signInWithGoogle(acc));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const canLogin = emailOk(email) && password.length >= 6;
  // Đã cấu hình client ID → OAuth thật; chưa → đăng nhập demo.
  const onGoogle = () => (google.ready ? google.prompt() : signInWithGoogle());

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Thương hiệu */}
          <View style={styles.brand}>
            <View style={styles.logo}><Text style={styles.logoTxt}>🏓</Text></View>
            <Text style={styles.appName}>SportApp</Text>
            <Text style={styles.tagline}>Đặt sân · Vé ngày · Câu lạc bộ</Text>
          </View>

          <Text style={styles.h1}>Đăng nhập</Text>

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
              returnKeyType="done"
              onSubmitEditing={() => { if (canLogin) signIn(email); }}
            />
            <Pressable onPress={() => setShow(s => !s)} hitSlop={8} accessibilityLabel={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>
              <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={18} color={color.textMuted} />
            </Pressable>
          </View>

          <Pressable onPress={() => {}} hitSlop={6} style={styles.forgot} accessibilityRole="button">
            <Text style={styles.forgotTxt}>Quên mật khẩu?</Text>
          </Pressable>

          <View style={{ marginTop: 8 }}>
            <PrimaryButton label="Đăng nhập" onPress={() => signIn(email)} disabled={!canLogin} />
          </View>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.or}>hoặc</Text>
            <View style={styles.line} />
          </View>

          <GoogleButton label={google.loading ? 'Đang mở Google…' : 'Đăng nhập với Google'} onPress={onGoogle} />
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerTxt}>Chưa có tài khoản? </Text>
          <Pressable onPress={() => nav.navigate('Register')} hitSlop={6} accessibilityRole="button">
            <Text style={styles.footerLink}>Đăng ký</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  content: { paddingHorizontal: space.xl, paddingTop: 12, paddingBottom: 24 },

  brand: { alignItems: 'center', marginTop: 24, marginBottom: 28 },
  logo: { width: 68, height: 68, borderRadius: 22, backgroundColor: color.ink, alignItems: 'center', justifyContent: 'center' },
  logoTxt: { fontSize: 32 },
  appName: { ...font.h1, color: color.ink, marginTop: 14 },
  tagline: { ...font.sub, color: color.textMuted, marginTop: 4 },

  h1: { ...font.h2, color: color.ink, marginBottom: 6 },
  label: { ...font.sub, color: color.textMuted, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: color.surface,
    borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 13, ...shadow.card,
  },
  input: { flex: 1, ...font.body, color: color.ink, padding: 0 },

  forgot: { alignSelf: 'flex-end', marginTop: 12, marginBottom: 18 },
  forgotTxt: { ...font.sub, color: color.textMuted, fontWeight: '700' },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: color.line },
  or: { ...font.sub, color: color.textFaint },

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14 },
  footerTxt: { ...font.body, color: color.textMuted },
  footerLink: { ...font.body, color: color.ink, fontWeight: '800' },
});
