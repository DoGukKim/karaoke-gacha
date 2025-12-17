import { QueryClient } from '@tanstack/react-query';

const HOUR = 1000 * 60 * 60;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: HOUR, // 1시간 동안 fresh 상태 유지
        gcTime: HOUR * 24, // 24시간 동안 캐시 유지 (persist용)
        retry: 1,
      },
    },
  });
}

// 브라우저 환경: 싱글톤
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  // 서버: 항상 새 인스턴스 (요청 간 데이터 공유 방지)
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  // 브라우저: 싱글톤 재사용
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
