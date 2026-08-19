import { View, Text, StyleSheet } from 'react-native';
import { color, font } from '../../theme/tokens';
import { Avatar } from '../primitives/Avatar';

export function HomeHeader({ greeting, name, avatarLabel }: { greeting: string; name: string; avatarLabel: string }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.greet}>{greeting}</Text>
        <Text style={styles.name}>{name}</Text>
      </View>
      <Avatar label={avatarLabel} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  greet: { ...font.sub, color: color.textMuted },
  name: { ...font.h1, color: color.ink, marginTop: 2 },
});
