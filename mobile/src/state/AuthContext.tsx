import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthProviderKind = 'password' | 'google';
export interface AuthUser {
  name: string;
  email: string;
  provider: AuthProviderKind;
}

interface Ctx {
  user: AuthUser | null;
  loading: boolean;                                  // đang đọc phiên đăng nhập đã lưu
  signIn: (email: string) => void;                   // đăng nhập bằng email/mật khẩu (demo)
  register: (name: string, email: string) => void;   // đăng ký tài khoản mới (demo)
  signInWithGoogle: (account?: { name: string; email: string }) => void;  // OAuth thật (có account) hoặc demo (không)
  signOut: () => void;
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

  const register = useCallback((name: string, email: string) => {
    save({ name: name.trim(), email: email.trim(), provider: 'password' });
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

  const signOut = useCallback(() => {
    setUser(null);
    AsyncStorage.removeItem(KEY).catch(() => {});
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, register, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải nằm trong <AuthProvider>');
  return ctx;
}
