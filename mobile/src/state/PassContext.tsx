import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { DayPassKind } from '../types';

interface PassState { personal: boolean; club: boolean }
interface Ctx {
  active: PassState;
  purchase: (kind: DayPassKind) => void;
  reset: (kind?: DayPassKind) => void;
  joinedClub: boolean;              // đã tạo/tham gia CLB nào chưa (tài khoản mời truy cập)
  joinClub: () => void;
}

const PassContext = createContext<Ctx | null>(null);

/** Giữ trạng thái vé ngày đã mua (cá nhân/CLB) xuyên suốt luồng đặt vé → thanh toán → thẻ hội viên. */
export function PassProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<PassState>({ personal: false, club: false });
  const [joinedClub, setJoinedClub] = useState(false);

  const purchase = useCallback((kind: DayPassKind) => {
    setActive(s => ({ ...s, [kind]: true }));
  }, []);
  const reset = useCallback((kind?: DayPassKind) => {
    setActive(s => (kind ? { ...s, [kind]: false } : { personal: false, club: false }));
  }, []);
  const joinClub = useCallback(() => setJoinedClub(true), []);

  return (
    <PassContext.Provider value={{ active, purchase, reset, joinedClub, joinClub }}>
      {children}
    </PassContext.Provider>
  );
}

export function usePasses() {
  const ctx = useContext(PassContext);
  if (!ctx) throw new Error('usePasses phải nằm trong <PassProvider>');
  return ctx;
}
