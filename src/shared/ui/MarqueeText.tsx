'use client';

import { useRef, useEffect, useState } from 'react';
import { clsx } from 'clsx';

interface MarqueeTextProps {
  children: string;
  className?: string;
}

export function MarqueeText({ children, className }: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(5);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;

    if (container && text) {
      const isOverflowing = text.scrollWidth > container.clientWidth;
      setShouldAnimate(isOverflowing);

      if (isOverflowing) {
        const duration = Math.max(3, text.scrollWidth / 80);
        setAnimationDuration(duration);
      }
    }
  }, [children]);

  return (
    <div
      ref={containerRef}
      className={clsx('relative w-full max-w-full min-w-0 overflow-hidden whitespace-nowrap', className)}
    >
      <div
        className={clsx('inline-flex', shouldAnimate && 'animate-marquee')}
        style={{ animationDuration: `${animationDuration}s` }}
      >
        <span ref={textRef} className={shouldAnimate ? 'pr-12' : ''}>
          {children}
        </span>
        {shouldAnimate && <span className="pr-12">{children}</span>}
      </div>
    </div>
  );
}
