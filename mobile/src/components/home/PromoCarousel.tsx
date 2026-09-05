import { memo, useCallback, useEffect, useRef } from 'react';
import {
  View, ScrollView, StyleSheet, useWindowDimensions,
  NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { PromoCard } from '../cards/PromoCard';
import { space } from '../../theme/tokens';
import { Promo } from '../../types';

const GAP = 12;
const INTERVAL_MS = 4000;   // thời gian mỗi banner trước khi tự chuyển

interface Props { promos: Promo[]; onPressPromo: (promo: Promo) => void; intervalMs?: number }

/**
 * Thanh quảng cáo Home: ScrollView ngang snap-từng-trang, bố cục cố định, tự chạy vòng lặp.
 * Dùng ScrollView (chỉ 2–3 banner) thay FlatList để tránh cảnh báo VirtualizedList "slow to update";
 * chỉ số trang giữ trong ref nên autoplay không gây re-render.
 */
function PromoCarouselBase({ promos, onPressPromo, intervalMs = INTERVAL_MS }: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = width - space.xl * 2;          // trừ padding ngang 24 hai bên của Home
  const step = cardWidth + GAP;
  const scrollRef = useRef<ScrollView>(null);
  const indexRef = useRef(0);
  const dragging = useRef(false);

  // Đổi bộ môn → về banner đầu.
  useEffect(() => {
    indexRef.current = 0;
    scrollRef.current?.scrollTo({ x: 0, animated: false });
  }, [promos]);

  // Tự chuyển banner theo vòng lặp; dùng ref nên không setState mỗi chu kỳ.
  useEffect(() => {
    if (promos.length <= 1) return;
    const timer = setInterval(() => {
      if (dragging.current) return;
      const next = (indexRef.current + 1) % promos.length;
      indexRef.current = next;
      scrollRef.current?.scrollTo({ x: next * step, animated: true });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [promos, step, intervalMs]);

  const onBeginDrag = useCallback(() => { dragging.current = true; }, []);
  const onMomentumEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    dragging.current = false;
    indexRef.current = Math.round(e.nativeEvent.contentOffset.x / step);
  }, [step]);

  return (
    <View style={styles.wrap}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={step}
        snapToAlignment="start"
        disableIntervalMomentum
        onScrollBeginDrag={onBeginDrag}
        onMomentumScrollEnd={onMomentumEnd}
      >
        {promos.map((p, i) => (
          <View key={p.id} style={i < promos.length - 1 ? styles.gap : undefined}>
            <PromoCard promo={p} width={cardWidth} onPress={onPressPromo} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 16 },
  gap: { marginRight: GAP },
});

export const PromoCarousel = memo(PromoCarouselBase);
