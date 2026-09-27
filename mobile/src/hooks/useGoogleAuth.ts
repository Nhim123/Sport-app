import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GOOGLE, googleConfigured } from '../config/google';

// Đóng cửa sổ trình duyệt xác thực khi quay lại app.
WebBrowser.maybeCompleteAuthSession();

export interface GoogleAccount { name: string; email: string }

/**
 * Google OAuth. Khi CHƯA cấu hình client ID (config/google.ts còn rỗng) → trả stub
 * (ready=false) và KHÔNG gọi expo-auth-session — tránh crash
 * "Client Id property `iosClientId` must be defined". Màn hình tự fallback demo.
 * Khi đã cấu hình → dùng OAuth thật qua hook con bên dưới.
 *
 * `googleConfigured` là hằng số ở tầng module (không đổi khi chạy) nên nhánh rẽ này
 * ổn định giữa các lần render — không phá thứ tự hook.
 */
export function useGoogleAuth(onAccount: (acc: GoogleAccount) => void) {
  if (!googleConfigured) {
    return { ready: false, loading: false, prompt: async () => {} };
  }
  return useConfiguredGoogleAuth(onAccount);
}

function useConfiguredGoogleAuth(onAccount: (acc: GoogleAccount) => void) {
  const [loading, setLoading] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE.androidClientId || undefined,
    iosClientId: GOOGLE.iosClientId || undefined,
    webClientId: GOOGLE.webClientId || undefined,
  });

  useEffect(() => {
    if (response?.type !== 'success') {
      if (response) setLoading(false);
      return;
    }
    const token = response.authentication?.accessToken;
    if (!token) { setLoading(false); return; }
    (async () => {
      try {
        const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const info = await res.json();
        if (info?.email) onAccount({ name: info.name || info.email, email: info.email });
      } catch {
        // im lặng: người dùng có thể thử lại
      } finally {
        setLoading(false);
      }
    })();
  }, [response]);

  const ready = !!request;
  const prompt = async () => {
    setLoading(true);
    try {
      await promptAsync();
    } catch {
      setLoading(false);
    }
  };

  return { ready, loading, prompt };
}
