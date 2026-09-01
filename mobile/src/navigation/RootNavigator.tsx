import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import VenueDetailScreen from '../screens/VenueDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import GymScreen from '../screens/GymScreen';
import DayPassPaymentScreen from '../screens/DayPassPaymentScreen';
import DayPassConfirmScreen from '../screens/DayPassConfirmScreen';
import { PassProvider } from '../state/PassContext';
import { color } from '../theme/tokens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <PassProvider>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: color.ink,
          headerStyle: { backgroundColor: color.bg },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: color.bg },
          headerBackTitle: 'Quay lại',
        }}
      >
        <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="VenueDetail" component={VenueDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Đặt sân nhanh' }} />
        <Stack.Screen name="Gym" component={GymScreen} options={{ title: 'Thẻ hội viên' }} />
        <Stack.Screen name="DayPassPayment" component={DayPassPaymentScreen} options={{ title: 'Thanh toán' }} />
        <Stack.Screen name="DayPassConfirm" component={DayPassConfirmScreen} options={{ title: 'Hoàn tất', headerBackVisible: false, gestureEnabled: false }} />
      </Stack.Navigator>
    </PassProvider>
  );
}
