import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ClubScreen from '../screens/ClubScreen';
import BookingsScreen from '../screens/BookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Placeholder } from '../screens/PlaceholderScreen';
import { TabParamList } from './types';
import { color } from '../theme/tokens';

const Tab = createBottomTabNavigator<TabParamList>();

const SearchScreen = () => <Placeholder title="Tìm kiếm" />;

const ICON: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home', Search: 'search', Club: 'people', Bookings: 'calendar', Profile: 'person',
};

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: color.ink,
        tabBarInactiveTintColor: color.navIdle,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
        tabBarStyle: { backgroundColor: color.surface, borderTopColor: color.line, borderTopWidth: 1, paddingTop: 6 },
        tabBarIcon: ({ color: c }) => <Ionicons name={ICON[route.name]} size={22} color={c} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Trang chủ' }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarLabel: 'Tìm' }} />
      <Tab.Screen name="Club" component={ClubScreen} options={{ tabBarLabel: 'CLB' }} />
      <Tab.Screen name="Bookings" component={BookingsScreen} options={{ tabBarLabel: 'Lịch' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Tôi' }} />
    </Tab.Navigator>
  );
}
