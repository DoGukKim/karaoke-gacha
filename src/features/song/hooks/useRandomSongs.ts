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
