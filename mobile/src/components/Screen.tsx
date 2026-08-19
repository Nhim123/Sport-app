import { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color } from '../theme/tokens';

export function Screen({ children }: { children: ReactNode }) {
  return <SafeAreaView style={styles.root} edges={['top']}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
});
