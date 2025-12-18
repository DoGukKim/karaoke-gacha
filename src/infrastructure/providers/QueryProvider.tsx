'use client';

import dynamic from 'next/dynamic';

/**
 * Query Provider
 * - 클라이언트에서만 렌더링 (SSR 비활성화)
 * - sessionStorage에 쿼리 캐시를 영속화
 * - PersistQueryClientProvider가 QueryClientProvider 역할도 수행
 */
const PersistQueryProvider = dynamic(
  () => import('./PersistQueryProvider').then((m) => m.PersistQueryProvider),
  { ssr: false },
);

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return <PersistQueryProvider>{children}</PersistQueryProvider>;
}
