// Nguồn style duy nhất — mọi component đọc từ đây (xem docs/frontend-architecture.md)
export const color = {
  bg: '#F4F5F0', surface: '#FFFFFF', ink: '#111111',
  volt: '#C6F833', voltDark: '#8FD400',
  textMuted: '#8A8F82', textFaint: '#9A9F92',
  navIdle: '#B7BCAE', line: '#E9E7E1', lineSoft: '#F2F0EA',
  danger: '#E0483A',
};

export const grad = {
  dark: ['#1C1F16', '#3A4029'] as const,
  green: ['#20332A', '#33553F'] as const,
  olive: ['#2B3320', '#4A5533'] as const,
  volt: ['#C6F833', '#8FD400'] as const,
  member: ['#161A12', '#2F3720'] as const,
};

export const radius = { chip: 100, sm: 12, md: 14, card: 20, lg: 24 };
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 }; // padding ngang màn = 24

// Font: skeleton dùng font hệ thống theo weight; gắn Be Vietnam Pro/Sora sau.
export const font = {
  h1: { fontSize: 24, fontWeight: '800' as const, letterSpacing: -0.5 },
  h2: { fontSize: 19, fontWeight: '800' as const },
  section: { fontSize: 16, fontWeight: '800' as const },
  cardTitle: { fontSize: 15, fontWeight: '700' as const },
  body: { fontSize: 14, fontWeight: '500' as const },
  sub: { fontSize: 12, fontWeight: '500' as const },
  tiny: { fontSize: 11, fontWeight: '600' as const },
};

export const shadow = {
  card: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
};
