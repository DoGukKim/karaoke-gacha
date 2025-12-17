'use client';

import dynamic from 'next/dynamic';

const TDSClientProvider = dynamic(
  () => import('@toss/tds-mobile-ait').then((m) => m.TDSMobileAITProvider),
  { ssr: false },
);

export function TDSProvider({ children }: { children: React.ReactNode }) {
  return <TDSClientProvider>{children}</TDSClientProvider>;
}
