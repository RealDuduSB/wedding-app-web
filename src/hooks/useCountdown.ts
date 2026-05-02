'use client';

import { useState, useEffect } from 'react';
import { calculateTimeLeft, CountdownState } from '@/lib/countdown';

export function useCountdown(
  targetDate: Date,
  initialState?: CountdownState
): CountdownState {
  const [timeLeft, setTimeLeft] = useState<CountdownState>(
    () => initialState ?? calculateTimeLeft(targetDate)
  );

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(targetDate));

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}
