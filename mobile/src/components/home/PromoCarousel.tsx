import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  View, FlatList, StyleSheet, useWindowDimensions,
  NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { PromoCard } from '../cards/PromoCard';
import { color, space } from '../../theme/tokens';
import { Promo } from '../../types';

const GAP = 12;

interface Props { promos: Promo[]; onPressPromo: (promo: Promo) => void }

/**
 * Thanh quảng cáo Home: FlatList ngang snap-từng-trang + chấm phân trang.
 * Compound — tự giữ chỉ số banner đang xem; card = 1 trang (rộng bằng vùng nội dung màn).
 */
function PromoCarouselBase({ promos, onPressPromo }: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = width - space.xl * 2;          // trừ padding ngang 24 hai bên của Home
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Promo>>(null);

  // Đổi bộ môn → danh sách promo đổi: quay về banner đầu, đồng bộ chấm phân trang.
  useEffect(() => {
    setIndex(0);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [promos]);

  const onMomentumEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / (cardWidth + GAP)));
  }, [cardWidth]);

  return (
    <View style={styles.wrap}>
      <FlatList
        ref={listRef}
        data={promos}
        keyExtractor={p => p.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={cardWidth + GAP}
        snapToAlignment="start"
        disableIntervalMomentum
        onMomentumScrollEnd={onMomentumEnd}
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        renderItem={({ item }) => (
          <PromoCard promo={item} width={cardWidth} onPress={() => onPressPromo(item)} />
        )}
      />
      {promos.length > 1 ? (
        <View style={styles.dots}>
          {promos.map((p, i) => (
            <View key={p.id} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 16 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: color.navIdle },
  dotActive: { width: 18, backgroundColor: color.ink },
});

export const PromoCarousel = memo(PromoCarouselBase);
