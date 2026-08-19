import { useState } from 'react';
import { FilterTab } from '../types';

export function useFilterTab(initial: FilterTab = 'all') {
  const [tab, setTab] = useState<FilterTab>(initial);
  return { tab, setTab };
}
