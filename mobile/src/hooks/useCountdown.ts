import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Đếm ngược N giây (cho mã QR check-in có thời hạn).
 * start() bắt đầu lại từ đầu; tự dừng và về 0 khi hết giờ.
 */
export function useCountdown(seconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) { clearInterval(timer.current); timer.current = null; }
  }, []);

  const start = useCallback(() => {
    clear();
    setSecondsLeft(seconds);
    setRunning(true);
  }, [seconds, clear]);

  const stop = useCallback(() => {
    clear();
    setRunning(false);
    setSecondsLeft(0);
  }, [clear]);

  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) { clear(); setRunning(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return clear;
  }, [running, clear]);

  return { secondsLeft, running, start, stop };
}
