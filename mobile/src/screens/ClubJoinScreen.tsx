import { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, Modal, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { ClubRow } from '../components/cards/ClubRow';
import { discoverClubs } from '../data/mock';
import { RootStackParamList } from '../navigation/types';
import { color, font, radius, space, shadow } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/**
 * Màn tham gia câu lạc bộ. Thanh công cụ chỉ có 2 chức năng: tìm kiếm + quét QR.
 * Quét QR mở viewfinder mô phỏng (chưa gắn camera native).
 */
export default function ClubJoinScreen() {
  const nav = useNavigation<Nav>();
  const [q, setQ] = useState('');
  const [scanOpen, setScanOpen] = useState(false);

  const results = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return discoverClubs;
    return discoverClubs.filter(c => c.name.toLowerCase().includes(k) || c.note.toLowerCase().includes(k));
  }, [q]);

  const openClub = (id: string, name: string) => nav.navigate('ClubDetail', { id, name });

  return (
    <Screen>
      {/* Thanh công cụ: chỉ tìm kiếm + quét QR */}
      <View style={styles.toolbar}>
        <Pressable onPress={() => nav.goBack()} hitSlop={8} accessibilityRole="button" accessibilityLabel="Quay lại" style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={22} color={color.ink} />
        </Pressable>

        <View style={styles.search}>
          <Ionicons name="search" size={18} color={color.textMuted} />
          <TextInput
            style={styles.input}
            value={q}
            onChangeText={setQ}
            placeholder="Tìm câu lạc bộ theo tên…"
            placeholderTextColor={color.textFaint}
            autoFocus
            returnKeyType="search"
          />
          {q ? (
            <Pressable onPress={() => setQ('')} hitSlop={8} accessibilityRole="button" accessibilityLabel="Xoá tìm kiếm">
              <Ionicons name="close-circle" size={18} color={color.navIdle} />
            </Pressable>
          ) : null}
        </View>

        <Pressable onPress={() => setScanOpen(true)} accessibilityRole="button" accessibilityLabel="Quét mã QR" style={styles.qrBtn}>
          <Ionicons name="qr-code-outline" size={22} color={color.volt} />
        </Pressable>
      </View>

      <FlatList
        data={results}
        keyExtractor={c => c.id}
        contentContainerStyle={{ paddingHorizontal: space.xl, paddingTop: 10, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ClubRow club={item} onJoin={() => openClub(item.id, item.name)} />}
        ListEmptyComponent={<Text style={styles.empty}>Không tìm thấy CLB nào khớp “{q}”.</Text>}
      />

      {/* Quét QR — viewfinder mô phỏng (chưa gắn camera) */}
      <Modal visible={scanOpen} animationType="slide" transparent onRequestClose={() => setScanOpen(false)}>
        <View style={styles.scanRoot}>
          <View style={styles.scanBar}>
            <Text style={styles.scanTitle}>Quét mã QR câu lạc bộ</Text>
            <Pressable onPress={() => setScanOpen(false)} hitSlop={8} accessibilityRole="button" accessibilityLabel="Đóng">
              <Ionicons name="close" size={26} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.viewport}>
            <View style={styles.frame}>
              <View style={[styles.corner, styles.tl]} />
              <View style={[styles.corner, styles.tr]} />
              <View style={[styles.corner, styles.bl]} />
              <View style={[styles.corner, styles.br]} />
            </View>
            <Text style={styles.scanHint}>Đưa mã QR của CLB vào khung để tham gia</Text>
          </View>

          <View style={styles.scanFooter}>
            <Pressable
              style={styles.scanCta}
              accessibilityRole="button"
              onPress={() => { setScanOpen(false); const c = discoverClubs[0]; if (c) openClub(c.id, c.name); }}
            >
              <Ionicons name="qr-code" size={18} color={color.ink} />
              <Text style={styles.scanCtaTxt}>Mô phỏng quét thành công</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  toolbar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: space.lg, paddingTop: 8, paddingBottom: 10 },
  iconBtn: { width: 42, height: 42, borderRadius: radius.md, backgroundColor: color.surface, borderWidth: 1, borderColor: color.line, alignItems: 'center', justifyContent: 'center' },
  search: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: color.surface, borderRadius: radius.chip, paddingHorizontal: 14, height: 42, ...shadow.card },
  input: { flex: 1, ...font.body, color: color.ink, padding: 0 },
  qrBtn: { width: 42, height: 42, borderRadius: radius.md, backgroundColor: color.ink, alignItems: 'center', justifyContent: 'center' },
  empty: { ...font.body, color: color.textMuted, textAlign: 'center', marginTop: 40 },

  // Modal quét QR
  scanRoot: { flex: 1, backgroundColor: 'rgba(10,12,8,0.96)' },
  scanBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.xl, paddingTop: 60, paddingBottom: 8 },
  scanTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },
  viewport: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 22 },
  frame: { width: 240, height: 240, borderRadius: 28 },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: color.volt },
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 28 },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 28 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 28 },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 28 },
  scanHint: { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: '600', textAlign: 'center', paddingHorizontal: 40 },
  scanFooter: { padding: space.xl, paddingBottom: 40 },
  scanCta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: color.volt, borderRadius: radius.md, paddingVertical: 16 },
  scanCtaTxt: { color: color.ink, fontSize: 15, fontWeight: '800' },
});
