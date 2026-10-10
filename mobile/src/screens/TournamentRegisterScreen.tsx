import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, Alert, StyleSheet, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { getTournament } from '../data/tournaments';
import { RootStackParamList } from '../navigation/types';
import { color, font, radius, space, shadow } from '../theme/tokens';

type Nav = NativeStackNavigationProp<RootStackParamList, 'TournamentRegister'>;
const phoneOk = (p: string) => /^0\d{8,10}$/.test(p.trim());

export default function TournamentRegisterScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'TournamentRegister'>>();
  const t = getTournament(params.id);

  const [team, setTeam] = useState('');
  const [captain, setCaptain] = useState('');
  const [phone, setPhone] = useState('');
  const [players, setPlayers] = useState('');
  const [note, setNote] = useState('');
  const [agree, setAgree] = useState(false);

  if (!t) return <View style={styles.root} />;

  const full = t.teams >= t.capacity;
  const open = t.status === 'open' && !full;
  const canSubmit = team.trim().length >= 2 && captain.trim().length >= 2 && phoneOk(phone) && agree && open;

  const submit = () => {
    if (!canSubmit) return;
    Alert.alert('Đăng ký thành công', `Đội "${team.trim()}" đã đăng ký ${t.name}. Ban tổ chức sẽ liên hệ xác nhận & thanh toán lệ phí.`, [
      { text: 'OK', onPress: () => nav.goBack() },
    ]);
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.summary}>
            <Text style={styles.tName}>{t.name}</Text>
            <Text style={styles.tMeta}>{t.venue} · {t.date}</Text>
            <View style={styles.tRow}>
              <Info label="Thể thức" value={t.format} />
              <Info label="Đã đăng ký" value={t.teams + '/' + t.capacity + ' đội'} />
            </View>
            <View style={styles.tRow}>
              <Info label="Lệ phí" value={t.feeLabel} />
              {t.prize ? <Info label="Giải thưởng" value={'🏆 ' + t.prize} /> : null}
            </View>
          </View>

          {full ? <Text style={styles.err}>Giải đã đủ số đội đăng ký.</Text> : null}
          {t.status !== 'open' && !full ? <Text style={styles.err}>Giải hiện không mở đăng ký.</Text> : null}

          <Field label="Tên đội *" icon="flag-outline" value={team} onChangeText={setTeam} placeholder="VD: FC Phủi Q7" autoCapitalize="words" returnKeyType="next" />
          <Field label="Đội trưởng *" icon="person-outline" value={captain} onChangeText={setCaptain} placeholder="Họ tên đội trưởng" autoCapitalize="words" returnKeyType="next" />
          <Field label="SĐT liên hệ *" icon="call-outline" value={phone} onChangeText={setPhone} placeholder="0901234567" keyboardType="phone-pad" returnKeyType="next" />
          {phone.length > 0 && !phoneOk(phone) ? <Text style={styles.err}>Số điện thoại chưa hợp lệ.</Text> : null}
          <Field label="Số vận động viên" icon="people-outline" value={players} onChangeText={setPlayers} placeholder="VD: 8" keyboardType="number-pad" returnKeyType="next" />
          <Field label="Ghi chú" icon="create-outline" value={note} onChangeText={setNote} placeholder="Yêu cầu thêm (nếu có)" returnKeyType="done" />

          <Pressable style={styles.agreeRow} onPress={() => setAgree(a => !a)} accessibilityRole="checkbox" accessibilityState={{ checked: agree }}>
            <Ionicons name={agree ? 'checkbox' : 'square-outline'} size={20} color={agree ? color.voltDark : color.navIdle} />
            <Text style={styles.agreeTxt}>Tôi đồng ý thể lệ giải đấu và cam kết thông tin chính xác.</Text>
          </Pressable>

          <View style={{ marginTop: 16 }}>
            <PrimaryButton label={'Đăng ký · ' + t.feeLabel} onPress={submit} disabled={!canSubmit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoVal}>{value}</Text>
    </View>
  );
}

function Field({ label, icon, ...rest }: { label: string; icon: keyof typeof Ionicons.glyphMap } & TextInputProps) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <Ionicons name={icon} size={18} color={color.textMuted} />
        <TextInput style={styles.input} placeholderTextColor={color.textFaint} {...rest} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  content: { paddingHorizontal: space.xl, paddingTop: 12, paddingBottom: 28 },

  summary: { backgroundColor: color.surface, borderRadius: radius.card, padding: 16, ...shadow.card },
  tName: { ...font.h2, color: color.ink },
  tMeta: { ...font.sub, color: color.textMuted, marginTop: 4 },
  tRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  info: { flex: 1 },
  infoLabel: { ...font.tiny, color: color.textMuted, fontWeight: '600' },
  infoVal: { fontSize: 13.5, fontWeight: '700', color: color.ink, marginTop: 2 },

  label: { ...font.sub, color: color.textMuted, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: color.surface,
    borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 13, ...shadow.card,
  },
  input: { flex: 1, ...font.body, color: color.ink, padding: 0 },
  err: { ...font.sub, color: color.danger, marginTop: 10 },

  agreeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 18 },
  agreeTxt: { flex: 1, ...font.sub, color: color.textMuted, lineHeight: 18 },
});
