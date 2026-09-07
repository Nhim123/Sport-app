import { createMaterialTopTabNavigator, MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import ClubScreen from '../screens/ClubScreen';
import BookingsScreen from '../screens/BookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Placeholder } from '../screens/PlaceholderScreen';
import { TabParamList } from './types';
import { color, font } from '../theme/tokens';

// Material top tabs đặt ở đáy → vuốt ngang chuyển giữa 5 trang chính.
// Dùng thanh tab tự vẽ thay cho TabBar mặc định của react-native-tab-view
// (bản v3 không tương thích pager-view v8 nên TabBar mặc định bị crash).
const Tab = createMaterialTopTabNavigator<TabParamList>();

const SearchScreen = () => <Placeholder title="Tìm kiếm" />;

const ICON: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home', Search: 'search', Club: 'people', Bookings: 'calendar', Profile: 'person',
};
const LABEL: Record<keyof TabParamList, string> = {
  Home: 'Trang chủ', Search: 'Tìm', Club: 'CLB', Bookings: 'Lịch', Profile: 'Tôi',
};

function BottomBar({ state, navigation }: MaterialTopTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { height: 58 + insets.bottom, paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const name = route.name as keyof TabParamList;
        const tint = focused ? color.ink : color.navIdle;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            style={styles.item}
          >
            <Ionicons name={ICON[name]} size={22} color={tint} />
            <Text style={[styles.label, { color: tint }]}>{LABEL[name]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function TabNavigator() {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      tabBar={props => <BottomBar {...props} />}
      screenOptions={{ swipeEnabled: true, lazy: true }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Club" component={ClubScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: color.surface, borderTopWidth: 1, borderTopColor: color.line,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, paddingTop: 8 },
  label: { fontSize: 10, fontWeight: '700' },
});
