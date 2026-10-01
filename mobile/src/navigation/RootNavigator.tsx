import { createStackNavigator, TransitionPresets, CardStyleInterpolators } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import VenueDetailScreen from '../screens/VenueDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import GymScreen from '../screens/GymScreen';
import DayPassPaymentScreen from '../screens/DayPassPaymentScreen';
import DayPassConfirmScreen from '../screens/DayPassConfirmScreen';
import ClubDetailScreen from '../screens/ClubDetailScreen';
import JoinClubScreen from '../screens/JoinClubScreen';
import CreateClubScreen from '../screens/CreateClubScreen';
import CreatePollScreen from '../screens/CreatePollScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ClubPendingScreen from '../screens/ClubPendingScreen';
import AddFundTxScreen from '../screens/AddFundTxScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import CollectionDetailScreen from '../screens/CollectionDetailScreen';
import { PassProvider } from '../state/PassContext';
import { PollProvider } from '../state/PollContext';
import { ClubRequestProvider } from '../state/ClubRequestContext';
import { ClubFundProvider } from '../state/ClubFundContext';
import { NotificationProvider } from '../state/NotificationContext';
import { FeatureProvider } from '../state/FeatureContext';
import { useAuth } from '../state/AuthContext';
import { color } from '../theme/tokens';

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { user, loading } = useAuth();
  if (loading) return null;   // đang đọc phiên đăng nhập đã lưu

  return (
    <PassProvider>
     <PollProvider>
     <ClubRequestProvider>
     <ClubFundProvider>
     <NotificationProvider>
     <FeatureProvider>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: color.ink,
          headerStyle: { backgroundColor: color.bg },
          headerShadowVisible: false,
          cardStyle: { backgroundColor: color.bg },
          headerBackTitle: 'Quay lại',
          // Vuốt từ mép trái để quay lại — chạy trên cả iOS và Android (JS stack).
          gestureEnabled: true,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Tạo tài khoản' }} />
          </>
        ) : (
          <>
        <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen
          name="VenueDetail"
          component={VenueDetailScreen}
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            cardStyle: { backgroundColor: 'transparent' },   // để lộ màn chính phía sau
            cardOverlayEnabled: false,
            gestureEnabled: false,                            // modal mờ dần, đóng bằng chạm nền
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
          }}
        />
        <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Đặt sân nhanh' }} />
        <Stack.Screen name="Gym" component={GymScreen} options={{ title: 'Thẻ hội viên' }} />
        <Stack.Screen name="DayPassPayment" component={DayPassPaymentScreen} options={{ title: 'Thanh toán' }} />
        <Stack.Screen
          name="DayPassConfirm"
          component={DayPassConfirmScreen}
          options={{ title: 'Trạng thái đơn', headerLeft: () => null, gestureEnabled: false }}
        />
        <Stack.Screen name="ClubDetail" component={ClubDetailScreen} options={({ route }) => ({ title: route.params.name })} />
        <Stack.Screen name="ClubPending" component={ClubPendingScreen} options={{ title: 'Chờ phê duyệt' }} />
        <Stack.Screen name="AddFundTx" component={AddFundTxScreen} options={{ title: 'Thêm khoản thu/chi' }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Thông báo' }} />
        <Stack.Screen name="CollectionDetail" component={CollectionDetailScreen} options={{ title: 'Chi tiết đợt thu' }} />
        <Stack.Screen name="JoinClub" component={JoinClubScreen} options={{ title: 'Tham gia CLB' }} />
        <Stack.Screen name="CreateClub" component={CreateClubScreen} options={{ title: 'Tạo câu lạc bộ' }} />
        <Stack.Screen name="CreatePoll" component={CreatePollScreen} options={{ title: 'Tạo bình chọn' }} />
          </>
        )}
      </Stack.Navigator>
     </FeatureProvider>
     </NotificationProvider>
     </ClubFundProvider>
     </ClubRequestProvider>
     </PollProvider>
    </PassProvider>
  );
}
