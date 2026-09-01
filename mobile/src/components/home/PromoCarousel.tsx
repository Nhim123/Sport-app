import { memo, useEffect, useRef, useState } from 'react';
import {
  View, FlatList, StyleSheet, useWindowDimensions,
  NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { PromoCard } from '../cards/PromoCard';
import { space } from '../../theme/tokens';
import { Promo } from '../../types';

const GAP = 12;
const INTERVAL_MS = 4000;   // thời gian mỗi banner trước khi tự chuyển

interface Props { promos: Promo[]; onPressPromo: (promo: Promo) => void; intervalMs?: number }

/**
 * Thanh quảng cáo Home: FlatList ngang snap-từng-trang, bố cục cố định (không có chấm phân trang).
 * Tự động chạy vòng lặp theo thời gian; đồng bộ khi vuốt tay và tạm dừng trong lúc đang vuốt.
 */
function PromoCarouselBase({ promos, onPressPromo, intervalMs = INTERVAL_MS }: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = width - space.xl * 2;          // trừ padding ngang 24 hai bên của Home
  const step = cardWidth + GAP;
  const listRef = useRef<FlatList<Promo>>(null);
  const dragging = useRef(false);
  const [index, setIndex] = useState(0);

  // Đổi bộ môn → về banner đầu.
  useEffect(() => {
    setIndex(0);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [promos]);

  // Tự động chuyển banner theo vòng lặp; timer khởi động lại mỗi khi index đổi (kể cả sau khi vuốt tay).
  useEffect(() => {
    if (promos.length <= 1) return;
    const t = setTimeout(() => {
      if (dragging.current) return;
      const next = (index + 1) % promos.length;
      listRef.current?.scrollToOffset({ offset: next * step, animated: true });
      setIndex(next);
    }, intervalMs);
    return () => clearTimeout(t);
  }, [index, promos, step, intervalMs]);

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    dragging.current = false;
    setIndex(Math.round(e.nativeEvent.contentOffset.x / step));
  };

  return (
    <View style={styles.wrap}>
      <FlatList
        ref={listRef}
        data={promos}
        keyExtractor={p => p.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={step}
        snapToAlignment="start"
        disableIntervalMomentum
        onScrollBeginDrag={() => { dragging.current = true; }}
        onMomentumScrollEnd={onMomentumEnd}
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        renderItem={({ item }) => (
          <PromoCard promo={item} width={cardWidth} onPress={() => onPressPromo(item)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 16 },
});

export const PromoCarousel = memo(PromoCarouselBase);
