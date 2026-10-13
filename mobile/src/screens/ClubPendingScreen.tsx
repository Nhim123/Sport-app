import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { color, font, radius, space, shadow } from '../theme/tokens';
import { RootStackParamList } from '../navigation/types';
import { useClubRequests } from '../state/ClubRequestContext';
import { usePasses } from '../state/PassContext';
import { PrimaryButton } from '../components/buttons/PrimaryButton';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ClubPending'>;

/** Màn chờ phê duyệt cho khách đã gửi yêu cầu tham gia CLB "cần duyệt". */
export default function ClubPendingScreen() {
  const nav = useNavigation<Nav>();
  const { id, name } = useRoute<RouteProp<RootStackParamList, 'ClubPending'>>().params;
  const { cancelRequest } = useClubRequests();
  const { joinClub } = usePasses();

  const cancel = () => { cancelRequest(); nav.goBack(); };
  // Mô phỏng: chủ hội duyệt → trở thành thành viên, vào CLB.
  const approvedDemo = () => { cancelRequest(); joinClub(); nav.navigate('ClubDetail', { id, name }); };

  return (
    <View style={styles.root}>
      <View style={styles.center}>
        <View style={styles.badge}>
          <Ionicons name="hourglass-outline" size={44} color={color.ink} />
        </View>
        <Text style={styles.title}>Đang chờ phê duyệt</Text>
        <Text style={styles.sub}>
          Yêu cầu tham gia <Text style={styles.bold}>{name}</Text> đã được gửi.
          Chủ hội/quản trị sẽ duyệt trước khi bạn trở thành thành viên.
        </Text>

        <View style={styles.card}>
          <Ionicons name="lock-closed-outline" size={16} color={color.textMuted} />
          <Text style={styles.cardTxt}>CLB này ở chế độ “Cần duyệt”. Bạn sẽ nhận thông báo khi được chấp nhận.</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Chủ hội duyệt (demo)" onPress={approvedDemo} />
        <Pressable onPress={cancel} accessibilityRole="button" style={styles.cancelBtn}>
          <Text style={styles.cancelTxt}>Huỷ yêu cầu</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg, padding: space.xl, justifyContent: 'space-between' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: { width: 84, height: 84, borderRadius: 42, backgroundColor: color.lineSoft, borderWidth: 2, borderColor: color.line, alignItems: 'center', justifyContent: 'center' },
  title: { ...font.h1, color: color.ink, marginTop: 22 },
  sub: { ...font.body, color: color.textMuted, marginTop: 8, textAlign: 'center', lineHeight: 21 },
  bold: { color: color.ink, fontWeight: '800' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'stretch', backgroundColor: color.surface, borderRadius: radius.card, padding: 14, marginTop: 24, ...shadow.card },
  cardTxt: { flex: 1, ...font.sub, color: color.textMuted, lineHeight: 18 },
  footer: { gap: 10 },
  cancelBtn: { alignItems: 'center', paddingVertical: 12 },
  cancelTxt: { ...font.body, color: color.danger, fontWeight: '700' },
});
