'use client';

import { ThemeProvider } from '@toss/tds-mobile';
import { useEffect, useState, type ReactNode } from 'react';

type ProviderComponent = React.ComponentType<{ children: ReactNode }>;

/**
 * 토스 앱(React Native WebView) 환경인지 확인
 */
function isReactNativeWebView(): boolean {
  if (typeof window === 'undefined') return false;
  // React Native WebView 환경 감지
  return 'ReactNativeWebView' in window;
}

/**
 * TDS Provider - 환경에 따라 적절한 Provider 사용
 * - 토스 앱 환경 (React Native WebView): TDSMobileAITProvider 사용
 * - 브라우저 환경: ThemeProvider 사용
 */
export function TDSProvider({ children }: { children: ReactNode }) {
  const [AITProvider, setAITProvider] = useState<ProviderComponent | null>(null);
  const [isNativeEnv, setIsNativeEnv] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const isNative = isReactNativeWebView();
    setIsNativeEnv(isNative);

    if (isNative) {
      // React Native WebView 환경에서만 TDSMobileAITProvider 로드
      import('@toss/tds-mobile-ait')
        .then((mod) => {
          setAITProvider(() => mod.TDSMobileAITProvider);
        })
        .catch(() => {
          setAITProvider(null);
        })
        .finally(() => setIsReady(true));
    } else {
      // 브라우저 환경에서는 바로 ready
      setIsReady(true);
    }
  }, []);

  // 로딩 중이거나 브라우저 환경에서는 ThemeProvider 사용
  if (!isReady || !isNativeEnv) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  // React Native 환경에서 TDSMobileAITProvider 로드 성공
  if (AITProvider) {
    return <AITProvider>{children}</AITProvider>;
  }

  // fallback
  return <ThemeProvider>{children}</ThemeProvider>;
}
