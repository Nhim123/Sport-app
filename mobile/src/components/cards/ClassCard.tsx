import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { color, radius, font, shadow } from '../../theme/tokens';
import { GymClass } from '../../types';
import { PillButton } from '../buttons/PillButton';

interface Props { item: GymClass; onRegister: () => void }

function ClassCardBase({ item, onRegister }: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.timeBox, { backgroundColor: item.highlighted ? color.volt : '#ECEAE5' }]}>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <View style={styles.mid}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.sub}>{item.coach} · {item.durationMin} phút · còn {item.slotsLeft} chỗ</Text>
      </View>
      <PillButton label="Đăng ký" onPress={onRegister} variant={item.highlighted ? 'solid' : 'outline'} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: color.surface,
    borderRadius: radius.card, padding: 13, marginBottom: 11, ...shadow.card },
  timeBox: { width: 52, height: 52, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  time: { fontSize: 14, fontWeight: '800', color: color.ink },
  mid: { flex: 1 },
  name: { ...font.body, fontSize: 14, fontWeight: '700', color: color.ink },
  sub: { ...font.sub, color: color.textFaint, marginTop: 2 },
});

export const ClassCard = memo(ClassCardBase);
