import { memo } from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { color, radius, font, shadow } from '../../theme/tokens';
import { Venue } from '../../types';
import { PriceText } from '../primitives/PriceText';
import { IconButton } from '../primitives/IconButton';

function VenueCardBase({ venue, onPress }: { venue: Venue; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={styles.card}>
      <LinearGradient colors={venue.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.thumb} />
      <View style={styles.mid}>
        <Text style={styles.name} numberOfLines={1}>{venue.name}</Text>
        <Text style={styles.sub} numberOfLines={1}>{venue.district} · {venue.distanceKm}km · ⭐ {venue.rating}</Text>
        <PriceText value={venue.priceLabel} size={14} />
      </View>
      <IconButton name="arrow-forward" onPress={onPress} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: color.surface,
    borderRadius: radius.card, padding: 12, marginBottom: 12, ...shadow.card },
  thumb: { width: 68, height: 68, borderRadius: radius.md },
  mid: { flex: 1, marginHorizontal: 12, gap: 2 },
  name: { ...font.cardTitle, color: color.ink },
  sub: { ...font.sub, color: color.textFaint },
});

export const VenueCard = memo(VenueCardBase);
