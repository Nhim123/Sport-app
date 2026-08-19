import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, font } from '../../theme/tokens';
import { PrimaryButton } from '../buttons/PrimaryButton';

interface Props { summary?: string; priceLabel: string; ctaLabel: string; ctaDisabled?: boolean; onPress: () => void }
export function BottomBar({ summary, priceLabel, ctaLabel, ctaDisabled, onPress }: Props) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.wrap}>
      <View style={styles.inner}>
        <View style={styles.left}>
          {summary ? <Text style={styles.summary} numberOfLines={1}>{summary}</Text> : null}
          <Text style={styles.price}>{priceLabel}</Text>
        </View>
        <View style={styles.cta}>
          <PrimaryButton label={ctaLabel} onPress={onPress} disabled={ctaDisabled} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: color.surface, borderTopWidth: 1, borderTopColor: color.line },
  inner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 14 },
  left: { minWidth: 96 },
  summary: { ...font.sub, color: color.textMuted, marginBottom: 2 },
  price: { fontSize: 18, fontWeight: '800', color: color.ink },
  cta: { flex: 1 },
});
