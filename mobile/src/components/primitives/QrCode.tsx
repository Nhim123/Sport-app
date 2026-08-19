import { View, StyleSheet } from 'react-native';

/**
 * Mã QR trang trí (không mã hoá thật) — dựng bằng lưới View, không cần thư viện native.
 * Tạo pattern tất định từ `seed` để mỗi hội viên có hình khác nhau.
 */
const GRID = 21;

function buildMatrix(seed: number): boolean[] {
  const cells: boolean[] = [];
  for (let i = 0; i < GRID * GRID; i++) {
    const x = i % GRID;
    const y = Math.floor(i / GRID);
    const finder = (x < 3 && y < 3) || (x > GRID - 4 && y < 3) || (x < 3 && y > GRID - 4);
    const on = finder || ((x * 7 + y * 13 + ((x ^ y) * 3) + seed) % 5 < 2);
    cells.push(on);
  }
  return cells;
}

function seedFrom(value: string): number {
  let s = 0;
  for (let i = 0; i < value.length; i++) s = (s + value.charCodeAt(i) * (i + 1)) % 97;
  return s;
}

export function QrCode({ value, size = 118 }: { value: string; size?: number }) {
  const cell = size / GRID;
  const matrix = buildMatrix(seedFrom(value));
  return (
    <View style={[styles.grid, { width: size, height: size }]} accessibilityLabel="Mã QR hội viên">
      {matrix.map((on, i) => (
        <View key={i} style={{ width: cell, height: cell, backgroundColor: on ? '#0C0F0A' : 'transparent' }} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fff' },
});
