import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { color, radius, font, shadow } from '../../theme/tokens';
import { Club } from '../../types';
import { PillButton } from '../buttons/PillButton';

interface Props { club: Club; onJoin: () => void }

/** Dòng "Khám phá CLB": thumbnail gradient + tên/sub + nút Tham gia (outline). */
function ClubRowBase({ club, onJoin }: Props) {
  return (
    <View style={styles.card}>
      <LinearGradient colors={club.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.thumb} />
      <View style={styles.mid}>
        <Text style={styles.name} numberOfLines={1}>{club.name}</Text>
        <Text style={styles.sub} numberOfLines={1}>{club.members} thành viên · {club.note}</Text>
      </View>
      <PillButton label="Tham gia" onPress={onJoin} variant="outline" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: color.surface,
    borderRadius: radius.card, padding: 12, marginBottom: 11, ...shadow.card },
  thumb: { width: 52, height: 52, borderRadius: radius.md },
  mid: { flex: 1 },
  name: { ...font.body, fontSize: 14, fontWeight: '800', color: color.ink },
  sub: { ...font.sub, color: color.textFaint, marginTop: 2 },
});

export const ClubRow = memo(ClubRowBase);
