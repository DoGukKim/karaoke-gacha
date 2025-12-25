'use client';

import { useState, useCallback } from 'react';
import { generateHapticFeedback } from '@apps-in-toss/web-framework';

const DEFAULT_SHAKE_DURATION = 1700;
const HAPTIC_INTERVAL_MS = 1000;

interface UseGachaOptions {
  duration?: number;
  onComplete?: () => void;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const setIntervalImmediate = (callback: () => void, ms: number) => {
  callback();
  return setInterval(callback, ms);
};

export function useGacha(action: () => Promise<unknown> | unknown, options?: UseGachaOptions) {
  const { duration = DEFAULT_SHAKE_DURATION, onComplete } = options ?? {};
  const [isShaking, setIsShaking] = useState(false);

  const trigger = useCallback(async () => {
    setIsShaking(true);

    const intervalId = setIntervalImmediate(
      () => generateHapticFeedback({ type: 'wiggle' }),
      HAPTIC_INTERVAL_MS,
    );

    await Promise.all([action(), delay(duration)]);
    clearInterval(intervalId);

    if (onComplete) {
      onComplete();
    } else {
      setIsShaking(false);
    }
  }, [action, duration, onComplete]);

  return { isShaking, trigger };
}
