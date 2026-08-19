# Nghiên cứu thiết kế Frontend — Pickleball & Gym Booking (React Native)

> Tài liệu kiến trúc frontend, tách nhỏ từng component. Nguồn: design handoff `Pickleball & Gym App.dc.html` (hifi, 7 màn).
> Áp dụng các pattern: **composition, compound components, custom hooks, presentational/container, memo hoá, FlatList virtualization**.

---

## 1. Nguyên tắc kiến trúc

| Nguyên tắc | Áp dụng ở đây |
|---|---|
| **Presentational vs Container** | `components/` = *dumb* (chỉ nhận props + `onPress`, không biết navigation/API). `screens/` = *smart* (giữ state, gọi data, điều hướng). |
| **Composition over inheritance** | Card lớn dựng từ card con (`HeroCard`, `VenueCard`) + primitives (`Tag`, `PriceText`, `IconButton`). Không kế thừa. |
| **Compound components** | Nhóm có trạng thái chia sẻ: `FilterChipGroup`, `SlotGrid`, `SegmentedTabs` (Bookings) dùng Context nội bộ. |
| **Custom hooks tách logic** | State lặp lại (chọn slot, đếm ngược hạn gói, toggle check-in) → hook, không nhồi vào component. |
| **Một nguồn sự thật cho style** | `theme/tokens.ts` là nơi duy nhất khai báo màu/spacing/radius/typography. Không hard-code hex trong component. |

**Quy ước prop:** component tái sử dụng **không** import `navigation`. Màn hình truyền handler xuống: `<VenueCard venue={v} onPress={() => nav.navigate('VenueDetail', { id: v.id })} />`.

---

## 2. Cây thư mục

```
src/
├── theme/
│   ├── tokens.ts            # màu, spacing, radius, typography, shadow
│   └── typography.ts        # helper text style từ token
├── navigation/
│   ├── RootNavigator.tsx    # Stack: MainTabs + VenueDetail + Booking
│   └── TabNavigator.tsx     # Bottom tabs: Home, Search, Club, Bookings, Profile
├── components/
│   ├── primitives/          # khối nhỏ nhất, tái dùng khắp nơi
│   │   ├── Tag.tsx
│   │   ├── PriceText.tsx
│   │   ├── IconButton.tsx
│   │   ├── StatCell.tsx
│   │   └── SectionHeader.tsx      # tiêu đề mục + "Xem tất cả"
│   ├── buttons/
│   │   ├── PrimaryButton.tsx      # nền ink, chữ volt
│   │   └── PillButton.tsx         # chip bo tròn (Tham gia…)
│   ├── chips/
│   │   ├── FilterChip.tsx         # 1 chip
│   │   └── FilterChipGroup.tsx    # compound: quản lý active
│   ├── cards/
│   │   ├── HeroCard.tsx
│   │   ├── VenueCard.tsx
│   │   ├── BookingCard.tsx
│   │   ├── ClassCard.tsx
│   │   ├── ClubCard.tsx
│   │   └── MatchCard.tsx
│   ├── booking/
│   │   ├── DayPicker.tsx
│   │   ├── SlotGrid.tsx           # compound
│   │   ├── CourtPicker.tsx
│   │   └── BottomBar.tsx          # thanh giá + CTA cố định đáy
│   └── membership/
│       └── MemberCard.tsx         # thẻ gradient + QR
├── screens/                 # 7 màn (container)
├── hooks/                   # custom hooks
├── types/                   # kiểu domain (Venue, Slot, Booking…)
└── data/
    └── mock.ts              # dữ liệu giả, thay bằng API sau
```

---

## 3. Kiểu domain (`types/`)

```ts
export type Sport = 'pickle' | 'gym';
export type FilterTab = 'all' | Sport;

export interface Venue {
  id: string;
  name: string;
  sport: Sport;
  image?: string;              // undefined -> dùng gradient placeholder
  gradient: [string, string];
  distanceKm: number;
  rating: number;
  reviews: number;
  district: string;
  priceLabel: string;          // "80K/giờ" | "599K/tháng"
  openTag?: string;            // "CÒN 4 SÂN TRỐNG"
}

export type SlotState = 'free' | 'selected' | 'booked';
export interface Slot { id: string; time: string; state: SlotState }

export interface Booking {
  id: string; code: string; sport: Sport;
  venueName: string; date: string; time: string; priceLabel: string;
  status: 'upcoming' | 'past';
}

export interface GymClass {
  id: string; time: string; name: string; coach: string;
  durationMin: number; slotsLeft: number; highlighted?: boolean;
}
export interface Club { id: string; name: string; image?: string; members: number; sessions: number; joined?: boolean }
export interface Match {
  id: string; title: string; venue: string; time: string;
  level: 'Trung cấp' | 'Mọi trình độ' | 'Nâng cao'; joined: number; capacity: number;
}
```

---

## 4. Design tokens (`theme/tokens.ts`)

> Chốt từ handoff. Mọi component đọc từ đây.

```ts
export const color = {
  bg: '#F4F5F0', surface: '#FFFFFF', ink: '#111111',
  volt: '#C6F833', voltDark: '#8FD400',
  textMuted: '#8A8F82', textFaint: '#9A9F92',
  navIdle: '#B7BCAE', line: '#E9E7E1', lineSoft: '#F2F0EA',
  danger: '#E0483A', chipGymSoft: '#EEF7D0', chipGymSoftInk: '#5A7A10',
  gradDark: ['#1C1F16', '#3A4029'] as const,
  gradGreen: ['#20332A', '#33553F'] as const,
  gradOlive: ['#2B3320', '#4A5533'] as const,
  gradMember: ['#161A12', '#2F3720'] as const,
};
export const radius = { chip: 100, sm: 12, md: 14, card: 20, lg: 24, sheet: 28, phone: 40 };
export const space  = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 }; // padding ngang màn = 24
export const font = {
  family: 'BeVietnamPro', familyNum: 'Sora',
  h1: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  h2: { fontSize: 19, fontWeight: '800' },
  section: { fontSize: 16, fontWeight: '800' },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  body: { fontSize: 14, fontWeight: '500' },
  sub: { fontSize: 12, fontWeight: '500' },
  tiny: { fontSize: 11, fontWeight: '600' },
} as const;
export const shadow = {
  card: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
};
```

Font: nạp `Be Vietnam Pro` (400–900) + `Sora` (600–800) qua `expo-font` (`useFonts`) trong `App.tsx`, chặn render tới khi `fontsLoaded`.

---

## 5. Component tái sử dụng — tách riêng từng cái

Mỗi component dưới đây là **1 file**, thuần trình bày, có `React.memo` nếu nằm trong danh sách.

### 5.1 Primitives

```ts
// Tag.tsx — nhãn nhỏ (volt / soft / dark)
interface TagProps { label: string; variant?: 'volt' | 'soft' | 'dark'; }

// PriceText.tsx — giá, dùng font Sora
interface PriceTextProps { value: string; tone?: 'volt' | 'ink'; size?: number; }

// IconButton.tsx — nút vuông icon (→, back, ♡)
interface IconButtonProps { icon: React.ReactNode; onPress: () => void; size?: number; bg?: string; }

// StatCell.tsx — 1 ô thống kê (số Sora + nhãn)
interface StatCellProps { value: string; label: string; }

// SectionHeader.tsx — tiêu đề mục + link phải
interface SectionHeaderProps { title: string; actionLabel?: string; onAction?: () => void; }
```

### 5.2 Buttons

```ts
// PrimaryButton.tsx — nền ink #111, chữ volt; state: default/disabled/loading
interface PrimaryButtonProps {
  label: string; onPress: () => void;
  disabled?: boolean; loading?: boolean; fullWidth?: boolean;
}

// PillButton.tsx — chip hành động bo tròn ("Tham gia")
interface PillButtonProps { label: string; onPress: () => void; variant?: 'solid' | 'outline'; }
```

### 5.3 Chips — **compound component**

```ts
// FilterChip.tsx — 1 chip đơn (không tự giữ state)
interface FilterChipProps { label: string; active: boolean; onPress: () => void; icon?: string; }

// FilterChipGroup.tsx — quản lý chip nào active, phát onChange
interface FilterChipGroupProps<T extends string> {
  value: T; options: { key: T; label: string; icon?: string }[];
  onChange: (key: T) => void;
}
```
> Pattern **compound**: group giữ "chip nào active" và render các `FilterChip` con → màn hình chỉ cần `value`/`onChange`.

### 5.4 Cards (tất cả **`React.memo`** vì nằm trong list)

```ts
// HeroCard.tsx — banner 196px, tag + tên + meta + giá
interface HeroCardProps { venue: Venue; onPress: () => void; }

// VenueCard.tsx — card ngang: ảnh 68 + tên/sub/giá + IconButton →
interface VenueCardProps { venue: Venue; onPress: () => void; }

// BookingCard.tsx — header màu theo sport + body 3 cột + 2 nút
interface BookingCardProps { booking: Booking; onShowQR: () => void; onCancel: () => void; }

// ClassCard.tsx — ô giờ vuông + tên lớp + HLV + nút Đăng ký
interface ClassCardProps { item: GymClass; onRegister: () => void; }

// ClubCard.tsx — thẻ CLB cuộn ngang (230px)
interface ClubCardProps { club: Club; onPress: () => void; }

// MatchCard.tsx — "tìm bạn chơi": avatar + kèo + badge trình độ + PillButton
interface MatchCardProps { match: Match; onJoin: () => void; }
```

### 5.5 Booking

```ts
// DayPicker.tsx — hàng ngày cuộn ngang (FlatList horizontal)
interface DayPickerProps { days: { key: string; dow: string; day: number }[]; value: string; onChange: (key: string) => void; }

// SlotGrid.tsx — grid 3 cột, 3 trạng thái (free/selected/booked-disabled) — compound
interface SlotGridProps { slots: Slot[]; selectedId: string | null; onSelect: (id: string) => void; }

// CourtPicker.tsx — 6 nút "Sân n"
interface CourtPickerProps { count: number; value: number | null; onChange: (court: number) => void; }

// BottomBar.tsx — thanh cố định đáy: tóm tắt + giá + PrimaryButton
interface BottomBarProps { summary?: string; priceLabel: string; ctaLabel: string; ctaDisabled?: boolean; onPress: () => void; }
```

### 5.6 Membership

```ts
// MemberCard.tsx — thẻ gradient + QR động
interface MemberCardProps {
  brand: string; plan: string; memberName: string; memberCode: string;
  daysLeft: number; expiry: string; active: boolean;
}
```
> QR: dùng `react-native-qrcode-svg`, value = `memberCode`.

---

## 6. Screens (container) + state cục bộ

| Screen | State cục bộ | Hook dùng | Component con chính |
|---|---|---|---|
| **HomeScreen** | `tab: FilterTab` | `useFilterTab` | `FilterChipGroup`, `HeroCard`, `SectionHeader`, `VenueCard` (FlatList) |
| **VenueDetailScreen** | `liked` | — | `IconButton`, `Tag`, `StatCell`, `BottomBar` |
| **BookingScreen** | `day, slotId, court` | `useBookingSelection` | `DayPicker`, `SlotGrid`, `CourtPicker`, `BottomBar` |
| **GymScreen** | `checked` | `useCheckIn`, `useCountdown` | `MemberCard`, `ClassCard`, `StatCell` |
| **ClubScreen** | — | — | `ClubCard` (ngang), `MatchCard`, `SectionHeader` |
| **BookingsScreen** | `segment: 'upcoming'\|'past'` | — | `SegmentedTabs`, `BookingCard` |
| **ProfileScreen** | — | — | `StatCell`, `MenuRow`, `PrimaryButton` (outline danger) |

Ví dụ tách container/presentational rõ:
```tsx
// HomeScreen.tsx (smart)
const { tab, setTab } = useFilterTab('all');
const venues = useMemo(() => filterVenues(mock.venues, tab), [tab]); // memo hoá lọc
const hero = pickHero(tab);
return (
  <Screen>
    <HomeHeader name="Minh Khang" />
    <SearchBar placeholder="Tìm sân, phòng gym gần bạn…" />
    <FilterChipGroup value={tab} options={TABS} onChange={setTab} />
    <HeroCard venue={hero} onPress={() => nav.navigate(hero.sport === 'gym' ? 'Gym' : 'VenueDetail', { id: hero.id })} />
    <SectionHeader title={tab === 'gym' ? 'Phòng gym gần bạn' : 'Sân gần bạn'} actionLabel="Xem tất cả" />
    <FlatList data={venues} keyExtractor={v => v.id}
      renderItem={({ item }) => <VenueCard venue={item} onPress={() => nav.navigate('VenueDetail', { id: item.id })} />} />
  </Screen>
);
```

---

## 7. Custom hooks (`hooks/`) — tách logic khỏi UI

```ts
// useFilterTab.ts — chọn tab lọc Home
export function useFilterTab(initial: FilterTab) {
  const [tab, setTab] = useState<FilterTab>(initial);
  return { tab, setTab };
}

// useBookingSelection.ts — toàn bộ logic đặt sân (ngày/slot/sân + giá + hợp lệ)
export function useBookingSelection(slots: Slot[], pricePerHour: number) {
  const [day, setDay]   = useState<string>(defaultDay);
  const [slotId, setSlot] = useState<string | null>(null);
  const [court, setCourt] = useState<number | null>(null);

  const selectSlot = useCallback((id: string) => {
    const s = slots.find(x => x.id === id);
    if (!s || s.state === 'booked') return;   // chặn chọn slot hết chỗ
    setSlot(id);
  }, [slots]);

  const canPay  = slotId !== null && court !== null;
  const total   = slotId ? formatVnd(pricePerHour) : '';
  const summary = canPay ? `Sân ${court} · ${slots.find(s => s.id === slotId)?.time}, ${day}` : undefined;

  return { day, setDay, slotId, selectSlot, court, setCourt, canPay, total, summary };
}

// useCheckIn.ts — toggle check-in gym
export function useCheckIn() {
  const [checked, setChecked] = useState(false);
  return { checked, toggle: useCallback(() => setChecked(c => !c), []) };
}

// useCountdown.ts — số ngày còn lại của gói (từ ngày hết hạn)
export function useCountdown(expiryISO: string) {
  return useMemo(() => Math.max(0, daysBetween(new Date(), new Date(expiryISO))), [expiryISO]);
}
```
> Nguyên tắc: **component render, hook quyết định**. `SlotGrid` chỉ nhận `selectedId`/`onSelect`; luật "slot booked không chọn được" nằm trong `useBookingSelection`.

---

## 8. Navigation

```
RootStack (native-stack)
├── MainTabs (bottom-tabs)   Trang chủ · Tìm · CLB · Lịch · Tôi
│   ├── Home      → HomeScreen
│   ├── Search    → SearchScreen
│   ├── Club      → ClubScreen
│   ├── Bookings  → BookingsScreen
│   └── Profile   → ProfileScreen
├── VenueDetail  → VenueDetailScreen   (push, có back, ẩn tab bar)
├── Booking      → BookingScreen       (push, có back, ẩn tab bar)
└── Gym          → GymScreen           (push từ Home/Hero gym)
```
Tab active icon `#111`, idle `#B7BCAE`. Ẩn tab bar ở màn push bằng cách đặt chúng ngoài `MainTabs` (trong RootStack).

Thư viện: `@react-navigation/native` + `native-stack` + `bottom-tabs`, `react-native-screens`, `react-native-safe-area-context`. Icon: `lucide-react-native`.

---

## 9. Performance & Accessibility

**Performance**
- Danh sách (`VenueCard`, `BookingCard`, `ClassCard`) render trong **`FlatList`**, không `.map` trong `ScrollView` — virtualization sẵn.
- Tất cả card bọc **`React.memo`**; handler truyền xuống bọc `useCallback` để memo có tác dụng.
- Lọc/sắp xếp bọc `useMemo` (xem HomeScreen).
- Ảnh: `expo-image` (cache + placeholder), nền gradient khi chưa có ảnh thật.

**Accessibility (React Native)**
- Nút: `accessibilityRole="button"`, `accessibilityLabel` tiếng Việt rõ nghĩa.
- Slot hết chỗ: `accessibilityState={{ disabled: true }}`.
- Chip lọc: `accessibilityState={{ selected: active }}`.
- Vùng chạm ≥ 44×44 (IconButton 34 → thêm `hitSlop`).
- Tương phản: chữ `ink`/`volt` đạt AA trên nền tương ứng; tránh chữ `textFaint` cho nội dung quan trọng.

---

## 10. Thứ tự dựng (build order)

1. `theme/tokens.ts` + nạp font → `Screen` wrapper (SafeArea + nền `bg`).
2. **Primitives** (`Tag`, `PriceText`, `IconButton`, `StatCell`, `SectionHeader`) + **buttons**.
3. `FilterChip`/`FilterChipGroup` → dựng **HomeScreen** với `VenueCard`, `HeroCard` (màn "xương sống").
4. Navigation (tabs + stack) nối Home → VenueDetail → Booking.
5. **BookingScreen** + `useBookingSelection` (`DayPicker`, `SlotGrid`, `CourtPicker`, `BottomBar`).
6. **GymScreen** + `MemberCard` (QR) + `ClassCard`.
7. `BookingsScreen`, `ClubScreen`, `ProfileScreen`.
8. Thay `data/mock.ts` bằng API backend (`/api/...`) — chỉ đụng `screens/` + hooks, `components/` không đổi.

---

## Phụ lục — đối chiếu pattern (skill) ↔ component

| Pattern (frontend-patterns) | Nơi áp dụng |
|---|---|
| Composition | `HeroCard`/`VenueCard` ghép từ `Tag` + `PriceText` + `IconButton` |
| Compound components | `FilterChipGroup`, `SlotGrid`, `SegmentedTabs` |
| Custom hooks | `useBookingSelection`, `useCheckIn`, `useCountdown`, `useFilterTab` |
| Memoization | `React.memo` mọi card + `useMemo` lọc + `useCallback` handler |
| Virtualization | `FlatList` cho mọi danh sách dọc/ngang |
| Controlled form + validation | Chọn slot/sân trong Booking (state có điều kiện `canPay`) |
| Presentational/Container | `components/` (dumb) vs `screens/` (smart) |
```
