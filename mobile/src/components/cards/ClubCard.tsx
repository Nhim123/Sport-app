import { memo } from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { color, font } from '../../theme/tokens';
import { Club } from '../../types';
import { Tag } from '../primitives/Tag';

interface Props { club: Club; onPress: () => void }

/** Thẻ CLB của tôi — cuộn ngang, nền gradient, overlay tối ở đáy. */
function ClubCardBase({ club, onPress }: Props) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={styles.wrap}>
      <LinearGradient colors={club.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.bg}>
        <View style={styles.overlay}>
          <Tag label="THÀNH VIÊN" />
          <Text style={styles.name}>{club.name}</Text>
          <Text style={styles.note}>{club.members} thành viên · {club.note}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 230, borderRadius: 22, overflow: 'hidden' },
  bg: { height: 150, justifyContent: 'flex-end' },
  overlay: { padding: 16, gap: 8 },
  name: { ...font.h2, fontSize: 17, color: '#FFFFFF', marginTop: 4 },
  note: { ...font.sub, color: 'rgba(255,255,255,0.75)' },
});

export const ClubCard = memo(ClubCardBase);
