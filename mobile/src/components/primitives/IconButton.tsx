import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, radius } from '../../theme/tokens';

interface Props {
  name: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  size?: number;      // box size
  iconSize?: number;
  bg?: string;
  iconColor?: string;
  style?: ViewStyle;
}

export function IconButton({ name, onPress, size = 34, iconSize = 18, bg = color.volt, iconColor = color.ink, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      style={[{ width: size, height: size, borderRadius: radius.md, backgroundColor: bg }, styles.center, style]}
    >
      <Ionicons name={name} size={iconSize} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({ center: { alignItems: 'center', justifyContent: 'center' } });
