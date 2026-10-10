import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { color, radius, font, shadow } from '../../theme/tokens';
import type { Sport } from '../../types';
import type { Tournament } from '../../data/tournaments';
import { PillButton } from '../buttons/PillButton';

interface Props { tournament: Tournament; onRegister: () => void }

const EMOJI: Record<Sport, string> = { pickle: '🏓', gym: '🏋️', football: '⚽' };
const STATUS = {
  open: { label: 'Đang mở', bg: '#EEF7D0', fg: '#5A7A10' },
  ongoing: { label: 'Đang diễn ra', bg: '#FDEBD0', fg: '#8A5A10' },
  closed: { label: 'Đã đóng', bg: '#F0EEE9', fg: color.textMuted },
} as const;

/** Thẻ giải thi đấu: tên + sân/ngày + thể thức/số đội/giải thưởng + phí + nút Đăng ký. */
function TournamentCardBase({ tournament: t, onRegister }: Props) {
  const s = STATUS[t.status];
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <LinearGradient colors={t.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.badge}>
          <Text style={styles.emoji}>{EMOJI[t.sport]}</Text>
        </LinearGradient>
        <View style={styles.mid}>
          <Text style={styles.name} numberOfLines={1}>{t.name}</Text>
          <Text style={styles.meta} numberOfLines={1}>{t.venue} · {t.date}</Text>
        </View>
        <View style={[styles.status, { backgroundColor: s.bg }]}>
          <Text style={[styles.statusTxt, { color: s.fg }]}>{s.label}</Text>
        </View>
      </View>

      <Text style={styles.info} numberOfLines={1}>
        {t.format} · {t.teams}/{t.capacity} đội{t.prize ? ` · 🏆 ${t.prize}` : ''}
      </Text>

      <View style={styles.bottom}>
        <Text style={styles.fee}>{t.feeLabel}</Text>
        {t.status === 'open'
          ? <PillButton label="Đăng ký" onPress={onRegister} variant="solid" />
          : <Text style={styles.closedTxt}>{t.status === 'ongoing' ? 'Đang thi đấu' : 'Hết hạn'}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: color.surface, borderRadius: radius.card, padding: 15, marginBottom: 11, ...shadow.card },
  top: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  badge: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 20 },
  mid: { flex: 1 },
  name: { fontSize: 14, fontWeight: '800', color: color.ink },
  meta: { ...font.sub, color: color.textFaint, marginTop: 2 },
  status: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.chip },
  statusTxt: { ...font.tiny, fontWeight: '800' },
  info: { ...font.sub, color: color.textMuted, marginTop: 12 },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  fee: { fontSize: 15, fontWeight: '800', color: color.ink },
  closedTxt: { ...font.sub, color: color.textMuted, fontWeight: '700' },
});

export const TournamentCard = memo(TournamentCardBase);
