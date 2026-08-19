import { View, StyleSheet } from 'react-native';
import { FilterChip } from './FilterChip';

export interface ChipOption<T extends string> { key: T; label: string }
interface Props<T extends string> { value: T; options: ChipOption<T>[]; onChange: (key: T) => void }

export function FilterChipGroup<T extends string>({ value, options, onChange }: Props<T>) {
  return (
    <View style={styles.row}>
      {options.map(o => (
        <FilterChip key={o.key} label={o.label} active={o.key === value} onPress={() => onChange(o.key)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', marginTop: 16 } });
