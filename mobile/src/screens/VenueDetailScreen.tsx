import { useEffect, useRef } from 'react';
import {
  View, Text, Pressable, ScrollView, StyleSheet,
  Animated, PanResponder, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, radius, font, space } from '../theme/tokens';
import { RootStackParamList } from '../navigation/types';
import { getVenue } from '../data/mock';
import { Tag } from '../components/primitives/Tag';
import { PriceText } from '../components/primitives/PriceText';
import { StatCell } from '../components/primitives/StatCell';

type Nav = NativeStackNavigationProp<RootStackParamList, 'VenueDetail'>;

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export default function VenueDetailScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'VenueDetail'>>();
  const insets = useSafeAreaInsets();
  const { height: H } = useWindowDimensions();
  const venue = getVenue(params.id);

  const PEEK = Math.round(H * 0.5);              // ~1/2 màn: thông tin cơ bản
  const FULL = Math.round(H * 0.9);             // kéo lên → gần full màn

  const height = useRef(new Animated.Value(0)).current;   // slide-up khi mở
  const heightVal = useRef(0);
  const startH = useRef(PEEK);

  useEffect(() => {
    const id = height.addListener(({ value }) => { heightVal.current = value; });
    Animated.spring(height, { toValue: PEEK, useNativeDriver: false, bounciness: 4 }).start();
    return () => height.removeListener(id);
  }, [height, PEEK]);

  const snapTo = (to: number) =>
    Animated.spring(height, { toValue: to, useNativeDriver: false, bounciness: 4 }).start();

  const close = () => nav.goBack();

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
      onPanResponderGrant: () => { startH.current = heightVal.current; },
      onPanResponderMove: (_, g) => {
        height.setValue(clamp(startH.current - g.dy, PEEK * 0.5, FULL));
      },
      onPanResponderRelease: (_, g) => {
        const cur = startH.current - g.dy;
        if (cur < PEEK * 0.72) { close(); return; }        // kéo xuống mạnh → đóng
        snapTo(cur > (PEEK + FULL) / 2 ? FULL : PEEK);      // snap về full hoặc peek
      },
    }),
  ).current;

  if (!venue) return <View style={styles.root} />;

  return (
    <View style={styles.root}>
      <Pressable style={styles.backdrop} onPress={close} accessibilityLabel="Đóng" />

      <Animated.View style={[styles.sheet, { height }]}>
        {/* Vùng kéo: tay nắm + phần thông tin cơ bản */}
        <View {...pan.panHandlers}>
          <View style={styles.handleArea}><View style={styles.handle} /></View>
          <View style={styles.header}>
            <LinearGradient colors={venue.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.thumb} />
            <View style={styles.headMid}>
              <View style={styles.rowBetween}>
                <Text style={styles.name} numberOfLines={1}>{venue.name}</Text>
                <Tag label="ĐANG MỞ" />
              </View>
              <Text style={styles.meta}>⭐ {venue.rating} ({venue.reviews}) · {venue.district} · {venue.distanceKm}km</Text>
              <PriceText value={venue.priceLabel} size={15} />
            </View>
          </View>
        </View>

        {/* Chi tiết: hiện dần khi kéo lên full */}
        <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
          <View style={styles.stats}>
            <StatCell value={String(venue.courts ?? '-')} label="Sân" />
            <StatCell value={'Mở ' + (venue.openTime ?? '-')} label="Giờ mở" />
            <StatCell value={venue.priceLabel} label="Giá" />
          </View>

          <Text style={styles.section}>Tiện ích</Text>
          <View style={styles.chips}>
            {(venue.amenities ?? []).map(a => (
              <View key={a} style={styles.chip}><Text style={styles.chipTxt}>{a}</Text></View>
            ))}
          </View>

          <Text style={styles.section}>Giới thiệu</Text>
          <Text style={styles.about}>{venue.about}</Text>
        </ScrollView>

        {/* Hành động: luôn hiển thị ngay ở peek */}
        <View style={[styles.actions, { paddingBottom: insets.bottom + 10 }]}>
          <Pressable
            style={[styles.btn, styles.btnOutline]}
            accessibilityRole="button"
            accessibilityLabel="Đặt vé cá nhân"
            onPress={() => nav.replace('DayPassPayment', { kind: 'personal' })}
          >
            <Text style={styles.btnOutlineTxt}>Đặt vé cá nhân</Text>
          </Pressable>
          <Pressable
            style={[styles.btn, styles.btnPrimary]}
            accessibilityRole="button"
            accessibilityLabel="Đặt sân"
            onPress={() => nav.replace('Booking', { venueId: venue.id, name: venue.name })}
          >
            <Text style={styles.btnPrimaryTxt}>Đặt sân</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.18)' },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: color.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: space.xl, overflow: 'hidden',
  },
  handleArea: { alignItems: 'center', paddingTop: 10, paddingBottom: 6 },
  handle: { width: 40, height: 5, borderRadius: 3, backgroundColor: color.line },
  header: { flexDirection: 'row', alignItems: 'center', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: color.lineSoft },
  thumb: { width: 60, height: 60, borderRadius: radius.md },
  headMid: { flex: 1, marginLeft: 12, gap: 3 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { ...font.h2, color: color.ink, flex: 1, marginRight: 10 },
  meta: { ...font.sub, color: color.textMuted },
  body: { flex: 1, marginTop: 8 },
  stats: { flexDirection: 'row', paddingVertical: 16, borderRadius: radius.card, backgroundColor: color.bg },
  section: { ...font.section, color: color.ink, marginTop: 20, marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.line, borderRadius: radius.chip, paddingHorizontal: 12, paddingVertical: 8 },
  chipTxt: { ...font.sub, color: color.ink },
  about: { fontSize: 14, lineHeight: 22, color: '#5F645A' },
  actions: { flexDirection: 'row', gap: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: color.line },
  btn: { flex: 1, borderRadius: radius.md, paddingVertical: 15, alignItems: 'center', justifyContent: 'center' },
  btnOutline: { borderWidth: 1.5, borderColor: color.ink, backgroundColor: color.surface },
  btnOutlineTxt: { ...font.cardTitle, color: color.ink, fontWeight: '800' },
  btnPrimary: { backgroundColor: color.ink },
  btnPrimaryTxt: { ...font.cardTitle, color: color.volt, fontWeight: '800' },
});
