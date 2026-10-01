import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { clubFund, clubMembers, fundCollectionsSeed } from '../data/mock';
import { ClubFundTx, FundCollection } from '../types';

interface Ctx {
  txs: ClubFundTx[];
  balance: number;
  income: number;
  expense: number;
  addTx: (t: { label: string; amount: number; kind: 'in' | 'out'; collectionId?: string }) => void;
  // Đợt thu quỹ (ai đã đóng)
  collections: FundCollection[];
  collectionById: (id?: string) => FundCollection | undefined;
  addCollection: (c: { clubId: string; label: string; amount: number; perMember: number }) => string;
  setPaid: (collectionId: string, memberId: string, paid: boolean) => void;
}

const ClubFundContext = createContext<Ctx | null>(null);
const uid = () => Math.random().toString(36).slice(2, 8);
const today = () => { const d = new Date(); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`; };

/** Quỹ CLB: giao dịch + đợt thu (theo dõi người đã đóng). Số dư suy ra động. */
export function ClubFundProvider({ children }: { children: ReactNode }) {
  const [txs, setTxs] = useState<ClubFundTx[]>(clubFund.txs);
  const [collections, setCollections] = useState<FundCollection[]>(fundCollectionsSeed);

  const addTx = useCallback((t: { label: string; amount: number; kind: 'in' | 'out'; collectionId?: string }) => {
    setTxs(prev => [{ id: uid(), label: t.label, amount: t.amount, kind: t.kind, date: today(), collectionId: t.collectionId }, ...prev]);
  }, []);

  const addCollection = useCallback((c: { clubId: string; label: string; amount: number; perMember: number }) => {
    const id = 'col' + uid();
    const payers = clubMembers.map(m => ({ memberId: m.id, name: m.name, initials: m.initials, paid: false }));
    setCollections(prev => [{ id, clubId: c.clubId, label: c.label, perMember: c.perMember, payers }, ...prev]);
    setTxs(prev => [{ id: uid(), label: c.label, amount: c.amount, kind: 'in', date: today(), collectionId: id }, ...prev]);
    return id;
  }, []);

  const setPaid = useCallback((collectionId: string, memberId: string, paid: boolean) => {
    setCollections(prev => prev.map(col =>
      col.id !== collectionId ? col : { ...col, payers: col.payers.map(p => p.memberId === memberId ? { ...p, paid } : p) },
    ));
  }, []);

  const collectionById = useCallback((id?: string) => (id ? collections.find(c => c.id === id) : undefined), [collections]);

  const { income, expense, balance } = useMemo(() => {
    const inc = txs.filter(t => t.kind === 'in').reduce((s, t) => s + t.amount, 0);
    const exp = txs.filter(t => t.kind === 'out').reduce((s, t) => s + t.amount, 0);
    return { income: inc, expense: exp, balance: inc - exp };
  }, [txs]);

  return (
    <ClubFundContext.Provider value={{ txs, balance, income, expense, addTx, collections, collectionById, addCollection, setPaid }}>
      {children}
    </ClubFundContext.Provider>
  );
}

export function useClubFund() {
  const ctx = useContext(ClubFundContext);
  if (!ctx) throw new Error('useClubFund phải nằm trong <ClubFundProvider>');
  return ctx;
}
