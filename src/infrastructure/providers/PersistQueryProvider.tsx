'use client';

import { useState } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { getQueryClient } from '../lib/tanstackQuery/client';

/**
 * Persist Query Provider (클라이언트 전용)
 *
 * @see https://tanstack.com/query/v5/docs/react/plugins/createAsyncStoragePersister
 *
 * - dynamic import로 SSR을 건너뛰고 클라이언트에서만 렌더링
 * - sessionStorage에 쿼리 캐시 영속화
 * - createAsyncStoragePersister 사용 (createSyncStoragePersister는 deprecated)
 * - PersistQueryClientProvider가 QueryClientProvider 역할도 수행
 */
export function PersistQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState<QueryClient>(getQueryClient);

  const [persister] = useState(() =>
    createAsyncStoragePersister({ storage: window.sessionStorage }),
  );

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      {children}
    </PersistQueryClientProvider>
  );
}
