import { memo } from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { color, radius, font } from '../../theme/tokens';
import { Venue } from '../../types';
import { Tag } from '../primitives/Tag';
import { PriceText } from '../primitives/PriceText';

function HeroCardBase({ venue, onPress }: { venue: Venue; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={styles.wrap}>
      <LinearGradient colors={venue.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.bg}>
        {venue.heroTag ? <View style={styles.tag}><Tag label={venue.heroTag} /></View> : null}
        <View style={styles.bottom}>
          <Text style={styles.name}>{venue.name}</Text>
          <Text style={styles.meta}>
            <Ionicons name="star" size={12} color={color.volt} /> {venue.rating} · {venue.district} · {venue.distanceKm}km
          </Text>
          <View style={{ marginTop: 6 }}><PriceText value={venue.priceLabel} /></View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 20, borderRadius: radius.lg, overflow: 'hidden' },
  bg: { height: 196, padding: 16, justifyContent: 'space-between' },
  tag: { flexDirection: 'row' },
  bottom: {},
  name: { ...font.h2, color: '#FFFFFF' },
  meta: { ...font.sub, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
});

export const HeroCard = memo(HeroCardBase);
