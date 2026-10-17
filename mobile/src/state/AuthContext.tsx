import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthProviderKind = 'password' | 'google';
export type Gender = 'male' | 'female' | 'other';
export type FavoriteSport = 'pickle' | 'gym' | 'football';

export interface AuthUser {
  name: string;
  email: string;
  provider: AuthProviderKind;
  phone?: string;
  phoneVerified?: boolean;        // SĐT đã xác thực OTP chưa
  gender?: Gender;
  favoriteSport?: FavoriteSport;
}

// Thông tin nhập khi tạo tài khoản mới.
export interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
  phoneVerified?: boolean;        // SĐT đã xác thực OTP ngay khi tạo tài khoản
  gender?: Gender;
  favoriteSport?: FavoriteSport;
}

interface Ctx {
  user: AuthUser | null;
  loading: boolean;                                  // đang đọc phiên đăng nhập đã lưu
  signIn: (email: string) => void;                   // đăng nhập bằng email/mật khẩu (demo)
  register: (data: RegisterInput) => void;           // đăng ký tài khoản mới (demo)
  signInWithGoogle: (account?: { name: string; email: string }) => void;  // OAuth thật (có account) hoặc demo (không)
  signOut: () => void;
  // Xác thực số điện thoại qua OTP (demo: sinh mã tại client; backend thật sẽ gửi SMS).
  requestOtp: (phone: string) => Promise<string>;              // trả mã demo để UI gợi ý
  verifyOtp: (phone: string, code: string) => Promise<boolean>;
  // Cập nhật hồ sơ (tên/SĐT/giới tính/bộ môn) — lưu AsyncStorage.
  updateProfile: (patch: Partial<Pick<AuthUser, 'name' | 'phone' | 'phoneVerified' | 'gender' | 'favoriteSport'>>) => void;
}

const KEY = '@sportapp_auth_user';
const AuthContext = createContext<Ctx | null>(null);

// Suy tên hiển thị từ phần trước @ của email: "khang.minh" → "Khang Minh".
function nameFromEmail(email: string): string {
  const local = email.split('@')[0] || 'Bạn';
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') || 'Bạn';
}

/** Giữ phiên đăng nhập (lưu AsyncStorage) và cổng vào ứng dụng. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  // Mã OTP đang chờ xác thực (demo client-side). Backend thật: lưu & gửi SMS phía server.
  const otpRef = useRef<{ phone: string; code: string; expires: number } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setUser(JSON.parse(raw));
      } catch {
        // bỏ qua: coi như chưa đăng nhập
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = useCallback((u: AuthUser) => {
    setUser(u);
    AsyncStorage.setItem(KEY, JSON.stringify(u)).catch(() => {});
  }, []);

  const signIn = useCallback((email: string) => {
    save({ name: nameFromEmail(email), email: email.trim(), provider: 'password' });
  }, [save]);

  const register = useCallback((data: RegisterInput) => {
    save({
      name: data.name.trim(),
      email: data.email.trim(),
      provider: 'password',
      phone: data.phone?.trim() || undefined,
      phoneVerified: data.phoneVerified ?? false,
      gender: data.gender,
      favoriteSport: data.favoriteSport,
    });
  }, [save]);

  // Có `account` (từ OAuth thật qua useGoogleAuth) → dùng tên/email thật;
  // không có (chưa cấu hình client ID) → fallback demo.
  const signInWithGoogle = useCallback((account?: { name: string; email: string }) => {
    save({
      name: account?.name ?? 'Minh Khang',
      email: account?.email ?? 'minhkhang@gmail.com',
      provider: 'google',
    });
  }, [save]);

  // Gửi OTP: sinh mã 6 số, hẹn hết hạn 5 phút. Demo trả mã để màn OTP hiển thị gợi ý.
  const requestOtp = useCallback(async (phone: string) => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    otpRef.current = { phone: phone.trim(), code, expires: Date.now() + 5 * 60 * 1000 };
    // TODO: gọi backend gửi SMS tới `phone`.
    return code;
  }, []);

  // Xác thực OTP: đúng số + đúng mã + chưa hết hạn → đánh dấu phoneVerified cho user hiện tại.
  const verifyOtp = useCallback(async (phone: string, code: string) => {
    const p = otpRef.current;
    if (!p || p.phone !== phone.trim() || p.expires < Date.now() || p.code !== code.trim()) return false;
    otpRef.current = null;
    setUser(prev => {
      if (!prev) return prev;
      const next: AuthUser = { ...prev, phone: phone.trim(), phoneVerified: true };
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
    return true;
  }, []);

  const updateProfile = useCallback((patch: Partial<Pick<AuthUser, 'name' | 'phone' | 'phoneVerified' | 'gender' | 'favoriteSport'>>) => {
    setUser(prev => {
      if (!prev) return prev;
      const next: AuthUser = { ...prev, ...patch };
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    AsyncStorage.removeItem(KEY).catch(() => {});
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, register, signInWithGoogle, signOut, requestOtp, verifyOtp, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải nằm trong <AuthProvider>');
  return ctx;
}
