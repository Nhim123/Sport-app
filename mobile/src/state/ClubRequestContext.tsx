import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { joinRequestsSeed } from '../data/mock';
import { JoinRequest } from '../types';

interface Ctx {
  // Quản trị: yêu cầu chờ duyệt của một CLB + duyệt/từ chối
  pendingFor: (clubId: string) => JoinRequest[];
  approve: (id: string) => void;
  reject: (id: string) => void;
  // Khách: trạng thái yêu cầu của chính mình
  myPendingClubId: string | null;
  requestJoin: (clubId: string) => void;
  cancelRequest: () => void;
}

const ClubRequestContext = createContext<Ctx | null>(null);

/** Luồng phê duyệt thành viên CLB (dùng chung màn quản trị & màn chờ duyệt của khách). */
export function ClubRequestProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<JoinRequest[]>(joinRequestsSeed);
  const [myPendingClubId, setMyPendingClubId] = useState<string | null>(null);

  const pendingFor = useCallback((clubId: string) => requests.filter(r => r.clubId === clubId), [requests]);
  const approve = useCallback((id: string) => setRequests(prev => prev.filter(r => r.id !== id)), []);
  const reject = useCallback((id: string) => setRequests(prev => prev.filter(r => r.id !== id)), []);

  const requestJoin = useCallback((clubId: string) => setMyPendingClubId(clubId), []);
  const cancelRequest = useCallback(() => setMyPendingClubId(null), []);

  return (
    <ClubRequestContext.Provider value={{ pendingFor, approve, reject, myPendingClubId, requestJoin, cancelRequest }}>
      {children}
    </ClubRequestContext.Provider>
  );
}

export function useClubRequests() {
  const ctx = useContext(ClubRequestContext);
  if (!ctx) throw new Error('useClubRequests phải nằm trong <ClubRequestProvider>');
  return ctx;
}
