'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomCTA, Post, Paragraph } from '@toss/tds-mobile';
import { adaptive } from '@toss/tds-colors';
import { GachaMachine } from '@/view/widgets/GachaMachine/GachaMachine';
import { usePrefetchRandomSongs } from '@/features/song';
import { DEFAULT_RANDOM_SONG_COUNT } from '@/domain/song/model';

const SHAKE_DURATION = 1700;

export default function Home() {
  const router = useRouter();
  const [isShaking, setIsShaking] = useState(false);
  const { prefetch } = usePrefetchRandomSongs(DEFAULT_RANDOM_SONG_COUNT);

  const handleGacha = () => {
    setIsShaking(true);
    prefetch();

    setTimeout(() => {
      router.push('/recommendations');
    }, SHAKE_DURATION);
  };

  return (
    <div className="flex h-screen w-screen flex-col">
      <Post.H2 paddingBottom={0} color={adaptive.grey900}>
        <Paragraph.Text>어떤 노래를 불러볼까요?</Paragraph.Text>
      </Post.H2>

      <div className="flex w-full flex-auto items-center justify-center pt-5">
        <GachaMachine state={isShaking ? 'shake' : 'floating'} />
      </div>

      <BottomCTA.Single onTap={handleGacha} disabled={isShaking}>
        {isShaking ? '뽑는 중...' : '노래 뽑기'}
      </BottomCTA.Single>
    </div>
  );
}
