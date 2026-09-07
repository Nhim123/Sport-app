import { useMemo, useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ClubRow } from '../components/cards/ClubRow';
import { QrScanModal } from '../components/QrScanModal';
import { discoverClubs } from '../data/mock';
import { usePasses } from '../state/PassContext';
import { RootStackParamList } from '../navigation/types';
import { Club } from '../types';
import { color, font, space, shadow } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// Mã CLB demo: suy từ id (cl3 → "CL3"). Backend thật sẽ trả mã riêng của mỗi CLB.
const codeOf = (c: Club) => c.id.toUpperCase();

export default function JoinClubScreen() {
  const nav = useNavigation<Nav>();
  const { joinClub } = usePasses();
  const [code, setCode] = useState('');
  const [scanOpen, setScanOpen] = useState(false);

  const query = code.trim().toLowerCase();
  const results = useMemo(() => {
    if (!query) return discoverClubs;
    return discoverClubs.filter(
      c => codeOf(c).toLowerCase().includes(query) || c.name.toLowerCase().includes(query),
    );
  }, [query]);

  const join = (c: Club) => {
    joinClub();
    setScanOpen(false);
    // Quay về tab CLB (giờ đã có CLB) rồi mở luôn màn chi tiết CLB vừa tham gia.
    nav.goBack();
    nav.navigate('ClubDetail', { id: c.id, name: c.name });
  };

  // Giả lập quét QR: nhận diện CLB đầu tiên (mock, chưa gắn camera thật).
  const simulateScan = () => join(discoverClubs[0]);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ padding: space.xl, paddingBottom: 32 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.lead}>Nhập mã CLB được chia sẻ, hoặc quét mã QR để tham gia.</Text>

      {/* Thanh công cụ: ô nhập mã + nút quét QR */}
      <View style={styles.toolbar}>
        <Ionicons name="search" size={20} color={color.textMuted} />
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={setCode}
          placeholder="Nhập mã CLB (vd: CL3)"
          placeholderTextColor={color.textFaint}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="search"
        />
        <View style={styles.sep} />
        <Pressable
          onPress={() => setScanOpen(true)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Quét mã QR"
          style={styles.qrBtn}
        >
          <Ionicons name="qr-code-outline" size={20} color={color.ink} />
        </Pressable>
      </View>

      <Text style={styles.section}>
        {query ? `Kết quả cho “${code.trim()}”` : 'Gợi ý CLB gần bạn'}
      </Text>

      {results.length ? (
        results.map(c => <ClubRow key={c.id} club={c} onJoin={() => join(c)} />)
      ) : (
        <View style={styles.empty}>
          <Ionicons name="alert-circle-outline" size={22} color={color.textMuted} />
          <Text style={styles.emptyTxt}>Không tìm thấy CLB với mã này.</Text>
        </View>
      )}

      {/* Màn quét QR (mock) */}
      <QrScanModal
        visible={scanOpen}
        onClose={() => setScanOpen(false)}
        onScan={simulateScan}
        title="Quét mã QR CLB"
        hint="Đưa mã QR của CLB vào khung để tham gia."
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  lead: { ...font.body, color: color.textMuted, marginTop: 4, marginBottom: 16, lineHeight: 20 },

  toolbar: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: color.surface,
    borderRadius: 17, paddingHorizontal: 15, paddingVertical: 6, ...shadow.card,
  },
  input: { flex: 1, ...font.body, color: color.ink, padding: 0, paddingVertical: 8 },
  sep: { width: 1, alignSelf: 'stretch', marginVertical: 8, backgroundColor: color.line },
  qrBtn: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: color.bg },

  section: { ...font.section, color: color.ink, marginTop: 24, marginBottom: 12 },
  empty: { alignItems: 'center', gap: 8, paddingVertical: 28 },
  emptyTxt: { ...font.body, color: color.textMuted },
});
