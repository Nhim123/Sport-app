import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Lang = 'vi' | 'en';
type Dict = Record<string, string>;

// Từ điển dịch — thêm key khi cần dịch thêm màn.
const STRINGS: Record<Lang, Dict> = {
  vi: {
    'tab.home': 'Trang chủ', 'tab.search': 'Tìm', 'tab.map': 'Bản đồ', 'tab.club': 'CLB', 'tab.bookings': 'Lịch', 'tab.profile': 'Tôi',
    'profile.benefits': 'Quyền lợi', 'profile.profile': 'Hồ sơ', 'profile.account': 'Hồ sơ & thông tin', 'profile.history': 'Lịch sử hoạt động',
    'profile.language': 'Ngôn ngữ', 'profile.level': 'Trình độ', 'profile.info': 'Thông tin',
    'profile.logout': 'Đăng xuất', 'profile.google': 'Đăng nhập qua Google',
    'val.silver': 'Hạng Bạc', 'val.intermediate': 'Trung cấp',
    'lang.title': 'Chọn ngôn ngữ', 'lang.vi': 'Tiếng Việt', 'lang.en': 'Tiếng Anh',
    'act.title': 'Thời gian hoạt động', 'act.week': 'Tuần', 'act.month': 'Tháng',
    'act.total': 'Tổng', 'act.avg': 'Trung bình', 'act.hour': 'giờ',
    'ach.title': 'Thành tích thi đấu', 'ach.empty': 'Chưa có thành tích',
    'ach.champion': 'Vô địch', 'ach.runnerup': 'Á quân', 'ach.third': 'Hạng ba', 'ach.joined': 'Tham dự',
  },
  en: {
    'tab.home': 'Home', 'tab.search': 'Search', 'tab.map': 'Map', 'tab.club': 'Clubs', 'tab.bookings': 'Schedule', 'tab.profile': 'Me',
    'profile.benefits': 'Benefits', 'profile.profile': 'Profile', 'profile.account': 'Profile & info', 'profile.history': 'Activity history',
    'profile.language': 'Language', 'profile.level': 'Skill level', 'profile.info': 'Account info',
    'profile.logout': 'Log out', 'profile.google': 'Signed in with Google',
    'val.silver': 'Silver', 'val.intermediate': 'Intermediate',
    'lang.title': 'Choose language', 'lang.vi': 'Vietnamese', 'lang.en': 'English',
    'act.title': 'Activity time', 'act.week': 'Week', 'act.month': 'Month',
    'act.total': 'Total', 'act.avg': 'Average', 'act.hour': 'h',
    'ach.title': 'Tournament results', 'ach.empty': 'No results yet',
    'ach.champion': 'Champion', 'ach.runnerup': 'Runner-up', 'ach.third': 'Third place', 'ach.joined': 'Participant',
  },
};

// Tên bản ngữ (luôn hiển thị như nhau bất kể ngôn ngữ đang chọn).
export const LANG_NATIVE: Record<Lang, string> = { vi: 'Tiếng Việt', en: 'English' };

const KEY = '@sportapp_lang';

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}
const LanguageContext = createContext<Ctx | null>(null);

/** Ngôn ngữ app (vi/en), lưu AsyncStorage; đổi là UI cập nhật ngay. */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('vi');

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(KEY);
        if (v === 'vi' || v === 'en') setLangState(v);
      } catch {
        // giữ mặc định tiếng Việt
      }
    })();
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    AsyncStorage.setItem(KEY, l).catch(() => {});
  }, []);

  const t = useCallback((key: string) => STRINGS[lang][key] ?? STRINGS.vi[key] ?? key, [lang]);

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage phải nằm trong <LanguageProvider>');
  return ctx;
}
