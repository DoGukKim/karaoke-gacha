// 리액트 쿼리를 의존하는 것은 원칙상 허용되지 않으나, 상태 관리의 표준 도구로 사용되기 때문에 허용.
'use client';

import {
  FetchQueryOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { Song } from '@/domain/song/model';
import { getRandomSongsAction } from '../actions/getRandomSongsAction';
import { songKeys } from './keys';

type UseRandomSongsOptions = Omit<UseQueryOptions<Song[], Error>, 'queryKey' | 'queryFn'>;
type UsePrefetchRandomSongsOptions = Omit<FetchQueryOptions<Song[], Error>, 'queryKey' | 'queryFn'>;

export function useRandomSongs(count: number, options?: UseRandomSongsOptions) {
  return useQuery<Song[], Error>({
    queryKey: songKeys.random(count),
    queryFn: () => getRandomSongsAction(count),
    ...options,
  });
}

export function usePrefetchRandomSongs(count: number, options?: UsePrefetchRandomSongsOptions) {
  const queryClient = useQueryClient();

  const prefetch = async () => {
    queryClient.removeQueries({ queryKey: songKeys.random(count) });

    await queryClient.prefetchQuery({
      queryKey: songKeys.random(count),
      queryFn: () => getRandomSongsAction(count),
      ...options,
    });
  };

  return { prefetch };
}
