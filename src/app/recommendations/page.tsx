'use client';

import { useState } from 'react';
import { DEFAULT_RANDOM_SONG_COUNT } from '@/domain/song/model';
import { SongList, useRandomSongs } from '@/features/song';
import { GachaMachine } from '@/view/widgets/GachaMachine/GachaMachine';
import { FixedBottomCTA } from '@toss/tds-mobile';

const SHAKE_DURATION = 1700;

export default function RecommendationsPage() {
  const [isShaking, setIsShaking] = useState(false);
  const {
    data: songs = [],
    isLoading,
    error,
    refetch,
  } = useRandomSongs(DEFAULT_RANDOM_SONG_COUNT, {
    // staleTime: Infinity,
    // refetchOnWindowFocus: false,
    // refetchOnMount: false,
  });

  const handleRefetch = () => {
    setIsShaking(true);
    refetch();

    setTimeout(() => {
      setIsShaking(false);
    }, SHAKE_DURATION);
  };

  if (isShaking) {
    return (
      <div className="flex h-screen w-full flex-col">
        <div className="flex flex-1 items-center justify-center">
          <GachaMachine state="shake" />
        </div>
        <FixedBottomCTA disabled>뽑는 중...</FixedBottomCTA>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <SongList songs={songs} isLoading={isLoading} error={error} />
      <FixedBottomCTA onTap={handleRefetch}>다시 뽑기</FixedBottomCTA>
    </div>
  );
}
