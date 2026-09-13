import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { clubPolls as seed } from '../data/mock';
import { ClubPoll, ClubPollOption } from '../types';

interface Ctx {
  polls: ClubPoll[];
  vote: (pollId: string, optionId: string) => void;   // chọn / đổi / rút phiếu
  addPoll: (poll: ClubPoll) => void;                   // tạo cuộc bình chọn mới
  addOption: (pollId: string, label: string) => void;  // thành viên thêm phương án
  pollForDay: (dayKey?: string) => ClubPoll | undefined;
  pollsForClub: (club: string) => ClubPoll[];
}

const PollContext = createContext<Ctx | null>(null);
const uid = () => Math.random().toString(36).slice(2, 9);

/** Giữ trạng thái bình chọn CLB dùng chung giữa màn Câu lạc bộ và màn Lịch. */
export function PollProvider({ children }: { children: ReactNode }) {
  const [polls, setPolls] = useState<ClubPoll[]>(seed);

  const vote = useCallback((pollId: string, optionId: string) => {
    setPolls(prev => prev.map(p => {
      if (p.id !== pollId) return p;
      const chosen = p.myVotes.includes(optionId);
      const dec = (id: string) => (o: ClubPollOption) => o.id === id ? { ...o, votes: Math.max(0, o.votes - 1) } : o;

      if (chosen) {
        // Chạm lại lựa chọn đang chọn → rút phiếu.
        return { ...p, myVotes: p.myVotes.filter(v => v !== optionId), options: p.options.map(dec(optionId)) };
      }
      if (p.allowMultiple) {
        // Chọn nhiều: thêm phiếu cho lựa chọn này.
        return { ...p, myVotes: [...p.myVotes, optionId], options: p.options.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o) };
      }
      // Chọn một: chuyển phiếu sang lựa chọn mới (bỏ lựa chọn cũ nếu có).
      const prev1 = p.myVotes[0];
      return {
        ...p,
        myVotes: [optionId],
        options: p.options.map(o => {
          if (o.id === optionId) return { ...o, votes: o.votes + 1 };
          if (o.id === prev1) return { ...o, votes: Math.max(0, o.votes - 1) };
          return o;
        }),
      };
    }));
  }, []);

  const addPoll = useCallback((poll: ClubPoll) => setPolls(prev => [poll, ...prev]), []);

  const addOption = useCallback((pollId: string, label: string) => {
    const text = label.trim();
    if (!text) return;
    setPolls(prev => prev.map(p =>
      p.id === pollId ? { ...p, options: [...p.options, { id: uid(), label: text, votes: 0 }] } : p,
    ));
  }, []);

  const pollForDay = useCallback(
    (dayKey?: string) => (dayKey ? polls.find(p => p.dayKey === dayKey) : undefined),
    [polls],
  );
  const pollsForClub = useCallback((club: string) => polls.filter(p => p.club === club), [polls]);

  return (
    <PollContext.Provider value={{ polls, vote, addPoll, addOption, pollForDay, pollsForClub }}>
      {children}
    </PollContext.Provider>
  );
}

export function usePolls() {
  const ctx = useContext(PollContext);
  if (!ctx) throw new Error('usePolls phải nằm trong <PollProvider>');
  return ctx;
}
