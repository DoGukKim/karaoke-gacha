'use client';

import { useState, useCallback } from 'react';

const DEFAULT_SHAKE_DURATION = 1700;

interface UseGachaOptions {
  duration?: number;
  onComplete?: () => void;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useGacha(action: () => Promise<unknown> | unknown, options?: UseGachaOptions) {
  const { duration = DEFAULT_SHAKE_DURATION, onComplete } = options ?? {};
  const [isShaking, setIsShaking] = useState(false);

  const trigger = useCallback(async () => {
    setIsShaking(true);
    await Promise.all([action(), delay(duration)]);

    if (onComplete) {
      onComplete();
    } else {
      setIsShaking(false);
    }
  }, [action, duration, onComplete]);

  return { isShaking, trigger };
}
