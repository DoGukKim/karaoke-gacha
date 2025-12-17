'use client';

import { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { getQueryClient } from '../lib/tanstackQuery/client';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());
  const [persister, setPersister] = useState<ReturnType<
    typeof createSyncStoragePersister
  > | null>(null);

  useEffect(() => {
    setPersister(
      createSyncStoragePersister({
        storage: window.sessionStorage,
      })
    );
  }, []);

  if (!persister) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      {children}
    </PersistQueryClientProvider>
  );
}
