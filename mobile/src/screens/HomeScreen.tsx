import { useCallback, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../components/Screen';
import { HomeHeader } from '../components/home/HomeHeader';
import { SearchBar } from '../components/home/SearchBar';
import { FilterChipGroup, ChipOption } from '../components/chips/FilterChipGroup';
import { PromoCarousel } from '../components/home/PromoCarousel';
import { HeroCard } from '../components/cards/HeroCard';
import { VenueCard } from '../components/cards/VenueCard';
import { SectionHeader } from '../components/primitives/SectionHeader';
import { useFilterTab } from '../hooks/useFilterTab';
import { FilterTab, Venue, Promo } from '../types';
import { RootStackParamList } from '../navigation/types';
import { filterVenues, pickHero, listTitle, filterPromos } from '../data/mock';
import { space } from '../theme/tokens';

const TABS: ChipOption<FilterTab>[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pickle', label: '🏓 Pickleball' },
  { key: 'gym', label: '🏋️ Gym' },
];

export default function HomeScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { tab, setTab } = useFilterTab('all');
  const [query, setQuery] = useState('');

  const hero = useMemo(() => pickHero(tab), [tab]);
  const venues = useMemo(() => filterVenues(tab), [tab]);
  const promoList = useMemo(() => filterPromos(tab), [tab]);

  const openVenue = useCallback((v: Venue) => {
    if (v.sport === 'gym') nav.navigate('Gym');
    else nav.navigate('VenueDetail', { id: v.id, name: v.name });
  }, [nav]);

  const openPromo = useCallback((_p: Promo) => {
    nav.navigate('MainTabs', { screen: 'Search' });
  }, [nav]);

  return (
    <Screen>
      <FlatList
        data={venues}
        keyExtractor={v => v.id}
        contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <VenueCard venue={item} onPress={() => openVenue(item)} />}
        ListHeaderComponent={
          <View>
            <HomeHeader greeting="Chào buổi sáng 👋" name="Minh Khang" avatarIcon="person" />
            <SearchBar value={query} onChangeText={setQuery} placeholder="Tìm sân, phòng gym gần bạn…" />
            <PromoCarousel promos={promoList} onPressPromo={openPromo} />
            <FilterChipGroup value={tab} options={TABS} onChange={setTab} />
            <HeroCard venue={hero} onPress={() => openVenue(hero)} />
            <SectionHeader title={listTitle(tab)} actionLabel="Xem tất cả" onAction={() => nav.navigate('MainTabs', { screen: 'Search' })} />
          </View>
        }
      />
    </Screen>
  );
}
