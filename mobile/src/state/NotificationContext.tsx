import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { notifications as seed } from '../data/mock';
import { AppNotification } from '../types';

interface Ctx {
  items: AppNotification[];
  unread: number;
  addNotification: (n: Omit<AppNotification, 'id'>) => void;
}

const NotificationContext = createContext<Ctx | null>(null);
const uid = () => 'nt' + Math.random().toString(36).slice(2, 8);

/** Danh sách thông báo động — thêm khoản thu sẽ đẩy thông báo tới đây. */
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<AppNotification[]>(seed);

  const addNotification = useCallback((n: Omit<AppNotification, 'id'>) => {
    setItems(prev => [{ id: uid(), ...n }, ...prev]);
  }, []);

  const unread = useMemo(() => items.filter(n => n.unread).length, [items]);

  return (
    <NotificationContext.Provider value={{ items, unread, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications phải nằm trong <NotificationProvider>');
  return ctx;
}
