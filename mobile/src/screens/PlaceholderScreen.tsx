import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../components/Screen';
import { color, font } from '../theme/tokens';

export function Placeholder({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Screen>
      <View style={styles.c}>
        <Text style={styles.t}>{title}</Text>
        <Text style={styles.s}>{subtitle ?? 'Màn này sẽ được dựng ở bước sau'}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  t: { ...font.h1, color: color.ink, textAlign: 'center' },
  s: { ...font.body, color: color.textMuted, marginTop: 8, textAlign: 'center' },
});
