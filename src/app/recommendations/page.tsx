'use client';

import { DEFAULT_RANDOM_SONG_COUNT } from '@/domain/song/model';
import { SongList, useRandomSongs, useGacha } from '@/features/song';
import { GachaMachine } from '@/view/widgets/GachaMachine/GachaMachine';
import { FixedBottomCTA } from '@toss/tds-mobile';

export default function RecommendationsPage() {
  const {
    data: songs,
    isLoading,
    error,
    refetch,
  } = useRandomSongs(DEFAULT_RANDOM_SONG_COUNT, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const { isShaking, trigger: handleRefetch } = useGacha(refetch);

  return (
    <div className="flex h-screen w-full flex-col">
      {isShaking ? (
        <div className="flex flex-1 items-center justify-center">
          <GachaMachine state="shake" />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <SongList songs={songs} isLoading={isLoading} error={error} />
        </div>
      )}

      <FixedBottomCTA onTap={handleRefetch} disabled={isShaking}>
        {isShaking ? '뽑는 중...' : '다시 뽑기'}
      </FixedBottomCTA>
    </div>
  );
}
