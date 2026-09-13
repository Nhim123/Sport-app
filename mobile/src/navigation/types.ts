import { NavigatorScreenParams } from '@react-navigation/native';
import { PaymentOrder, GymMode } from '../types';

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Club: undefined;
  Bookings: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  // Xác thực (khi chưa đăng nhập)
  Login: undefined;
  Register: undefined;
  MainTabs: NavigatorScreenParams<TabParamList>;
  VenueDetail: { id: string; name: string };
  Booking: { venueId: string; name: string };
  Gym: { mode?: GymMode } | undefined;
  DayPassPayment: { order: PaymentOrder };
  DayPassConfirm: { order: PaymentOrder };
  ClubDetail: { id: string; name: string };
  JoinClub: undefined;
  CreateClub: undefined;
  CreatePoll: { club: string };
};
