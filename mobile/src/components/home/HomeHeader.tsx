import { View, Text, StyleSheet } from 'react-native';
import { color, font } from '../../theme/tokens';
import { Avatar, AvatarIcon } from '../primitives/Avatar';

interface Props { greeting: string; name: string; avatarIcon?: AvatarIcon }

export function HomeHeader({ greeting, name, avatarIcon = 'person' }: Props) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.greet}>{greeting}</Text>
        <Text style={styles.name}>{name}</Text>
      </View>
      <Avatar icon={avatarIcon} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  greet: { ...font.sub, color: color.textMuted },
  name: { ...font.h1, color: color.ink, marginTop: 2 },
});
