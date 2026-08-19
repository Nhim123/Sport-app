import { View, Text, Pressable, StyleSheet } from 'react-native';
import { color, font, space } from '../../theme/tokens';

interface Props { title: string; actionLabel?: string; onAction?: () => void }
export function SectionHeader({ title, actionLabel, onAction }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={8}><Text style={styles.action}>{actionLabel}</Text></Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.xl, marginBottom: space.md },
  title: { ...font.section, color: color.ink },
  action: { ...font.sub, color: color.textMuted, fontWeight: '600' },
});
