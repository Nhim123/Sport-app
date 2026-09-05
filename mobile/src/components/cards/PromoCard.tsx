import { memo } from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { color, radius, font } from '../../theme/tokens';
import { Promo } from '../../types';
import { Tag } from '../primitives/Tag';

/** Banner quảng cáo đơn (dùng trong PromoCarousel). Thuần trình bày — nhận width + onPress. */
function PromoCardBase({ promo, width, onPress }: { promo: Promo; width: number; onPress: (promo: Promo) => void }) {
  return (
    <Pressable
      onPress={() => onPress(promo)}
      accessibilityRole="button"
      accessibilityLabel={`Ưu đãi: ${promo.title}`}
      style={[styles.wrap, { width }]}
    >
      <LinearGradient colors={promo.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.bg}>
        {promo.emoji ? <Text style={styles.emoji}>{promo.emoji}</Text> : null}
        <View style={styles.top}>
          {promo.badge ? <View style={styles.badge}><Tag label={promo.badge} /></View> : null}
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{promo.title}</Text>
          <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">{promo.subtitle}</Text>
        </View>
        <View style={styles.cta}>
          <Text style={styles.ctaTxt} numberOfLines={1}>{promo.ctaLabel}</Text>
          <Ionicons name="arrow-forward" size={13} color={color.ink} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: radius.card, overflow: 'hidden' },
  bg: { height: 168, padding: 16, justifyContent: 'space-between' },
  emoji: { position: 'absolute', right: 8, bottom: -14, fontSize: 104, opacity: 0.16 },
  top: { paddingRight: 72 },
  badge: { flexDirection: 'row', marginBottom: 6 },
  title: { fontSize: 18, fontWeight: '800', lineHeight: 22, color: '#FFFFFF' },
  subtitle: { ...font.sub, color: 'rgba(255,255,255,0.82)', marginTop: 4, lineHeight: 17 },
  cta: {
    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5,
    maxWidth: '100%', paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.chip,
    backgroundColor: color.volt,
  },
  ctaTxt: { ...font.tiny, fontSize: 12.5, fontWeight: '800', color: color.ink, flexShrink: 1 },
});

export const PromoCard = memo(PromoCardBase);
