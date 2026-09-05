import { NavigatorScreenParams } from '@react-navigation/native';
import { DayPassKind, GymMode } from '../types';

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Club: undefined;
  Bookings: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  VenueDetail: { id: string; name: string };
  Booking: { venueId: string; name: string };
  Gym: { mode?: GymMode } | undefined;
  DayPassPayment: { kind: DayPassKind };
  DayPassConfirm: { kind: DayPassKind };
  ClubDetail: { id: string; name: string };
};
