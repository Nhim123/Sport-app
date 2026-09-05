import { ScrollView, StyleSheet } from 'react-native';
import { space } from '../../theme/tokens';
import { FilterChip } from './FilterChip';

export interface ChipOption<T extends string> { key: T; label: string }
interface Props<T extends string> { value: T; options: ChipOption<T>[]; onChange: (key: T) => void }

export function FilterChipGroup<T extends string>({ value, options, onChange }: Props<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.row}
      contentContainerStyle={styles.content}
    >
      {options.map(o => (
        <FilterChip key={o.key} label={o.label} active={o.key === value} onPress={() => onChange(o.key)} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // marginHorizontal âm để thanh chip lướt sát mép màn, bù lại padding 24 của màn
  row: { marginTop: 16, marginHorizontal: -space.xl },
  content: { paddingHorizontal: space.xl },
});
