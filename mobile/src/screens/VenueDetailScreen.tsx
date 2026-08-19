import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, radius, font, space } from '../theme/tokens';
import { RootStackParamList } from '../navigation/types';
import { getVenue } from '../data/mock';
import { IconButton } from '../components/primitives/IconButton';
import { Tag } from '../components/primitives/Tag';
import { StatCell } from '../components/primitives/StatCell';
import { BottomBar } from '../components/booking/BottomBar';

type Nav = NativeStackNavigationProp<RootStackParamList, 'VenueDetail'>;

export default function VenueDetailScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'VenueDetail'>>();
  const insets = useSafeAreaInsets();
  const [liked, setLiked] = useState(false);
  const venue = getVenue(params.id);

  if (!venue) return <View style={styles.root} />;

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <LinearGradient colors={venue.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cover}>
          <View style={[styles.coverBar, { paddingTop: insets.top + 8 }]}>
            <IconButton name="chevron-back" onPress={() => nav.goBack()} bg="rgba(0,0,0,0.45)" iconColor="#fff" />
            <IconButton name={liked ? 'heart' : 'heart-outline'} onPress={() => setLiked(v => !v)} bg="rgba(0,0,0,0.45)" iconColor="#fff" />
          </View>
        </LinearGradient>

        <View style={styles.sheet}>
          <View style={styles.rowBetween}>
            <Text style={styles.name}>{venue.name}</Text>
            <Tag label="ĐANG MỞ" />
          </View>
          <Text style={styles.meta}>⭐ {venue.rating} ({venue.reviews}) · {venue.district} · {venue.distanceKm}km</Text>

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
        </View>
      </ScrollView>

      <BottomBar
        priceLabel={venue.priceLabel}
        ctaLabel="Chọn sân & giờ"
        onPress={() => nav.navigate('Booking', { venueId: venue.id, name: venue.name })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  cover: { height: 300 },
  coverBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: space.xl },
  sheet: { backgroundColor: color.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -28, padding: space.xl },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { ...font.h2, color: color.ink, flex: 1, marginRight: 12 },
  meta: { ...font.sub, color: color.textMuted, marginTop: 6 },
  stats: { flexDirection: 'row', marginTop: 20, paddingVertical: 16, borderRadius: radius.card, backgroundColor: color.bg },
  section: { ...font.section, color: color.ink, marginTop: 24, marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.line, borderRadius: radius.chip, paddingHorizontal: 12, paddingVertical: 8 },
  chipTxt: { ...font.sub, color: color.ink },
  about: { fontSize: 14, lineHeight: 22, color: '#5F645A' },
});
