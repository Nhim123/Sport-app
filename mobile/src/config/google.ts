/**
 * Google OAuth client IDs — điền từ Google Cloud Console (APIs & Services → Credentials).
 * Tạo OAuth client cho từng nền tảng bạn chạy:
 *   - Web application     → webClientId  (dùng cho Expo Go & web)
 *   - Android             → androidClientId  (cần package `com.sportapp.mobile` + SHA-1)
 *   - iOS                 → iosClientId      (cần bundle ID `com.sportapp.mobile`)
 * Dạng ID: "1234567890-xxxxxxxx.apps.googleusercontent.com".
 *
 * Khi TẤT CẢ còn rỗng: nút Google chạy ở chế độ demo (đăng nhập giả lập).
 * Điền ít nhất 1 ID hợp lệ để bật OAuth thật.
 */
export const GOOGLE = {
  androidClientId: '',
  iosClientId: '',
  webClientId: '',
};

export const googleConfigured =
  Boolean(GOOGLE.androidClientId || GOOGLE.iosClientId || GOOGLE.webClientId);
