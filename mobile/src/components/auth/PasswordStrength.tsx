import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { evaluatePassword } from '../../utils/passwordPolicy';
import { color, font, radius } from '../../theme/tokens';

const BAR_COLOR = ['#E0483A', '#E0483A', '#E8A13A', '#8FD400', '#4B6A00']; // theo score 0..4
const OK = '#4B6A00';

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const r = evaluatePassword(password);
  const tone = r.score >= 3 ? OK : r.score >= 2 ? '#8A6D1A' : color.danger;

  return (
    <View style={styles.wrap}>
      <View style={styles.bars}>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={[styles.bar, { backgroundColor: i < r.score ? BAR_COLOR[r.score] : color.line }]} />
        ))}
      </View>
      <Text style={[styles.strength, { color: tone }]}>Độ mạnh: {r.label}</Text>

      <View style={styles.checks}>
        {r.checks.map(c => (
          <View key={c.key} style={styles.row}>
            <Ionicons name={c.ok ? 'checkmark-circle' : 'ellipse-outline'} size={14} color={c.ok ? OK : color.navIdle} />
            <Text style={[styles.txt, { color: c.ok ? color.ink : color.textMuted }]}>{c.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 10 },
  bars: { flexDirection: 'row', gap: 6 },
  bar: { flex: 1, height: 5, borderRadius: radius.chip },
  strength: { ...font.tiny, fontWeight: '800', marginTop: 6 },
  checks: { marginTop: 8, gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  txt: { ...font.sub, fontWeight: '600' },
});
