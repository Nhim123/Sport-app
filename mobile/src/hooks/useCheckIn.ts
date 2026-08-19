import { useCallback, useState } from 'react';

/** Toggle trạng thái check-in phòng gym. */
export function useCheckIn(initial = false) {
  const [checked, setChecked] = useState(initial);
  const toggle = useCallback(() => setChecked(c => !c), []);
  return { checked, toggle };
}
