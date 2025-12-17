'use client';

import { Result, Skeleton } from '@toss/tds-mobile';
import type { Song } from '@/domain/song/model';
import { SongItem } from './SongItem';
import { SpotifyIcon } from '@/shared/ui/icons';

interface SongListProps {
  songs: Song[];
  isLoading?: boolean;
  error?: Error | null;
}

export function SongList({ songs, isLoading, error }: SongListProps) {
  const handleSpotifyClick = (spotifyUrl: string) => {
    window.open(spotifyUrl, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return <Skeleton />;
  }

  if (error) {
    return (
      <Result
        figure={<span className="text-5xl">😢</span>}
        title="노래를 불러오지 못했어요"
        description={error.message}
      />
    );
  }

  if (songs.length === 0) {
    return (
      <Result
        figure={<span className="text-5xl">🎵</span>}
        title="추천할 노래가 없어요"
        description="다시 시도해주세요"
      />
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="flex w-full flex-col px-5">
        {songs.map((song) => (
          <SongItem key={song.id} song={song} onSpotifyClick={handleSpotifyClick} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5">
        <SpotifyIcon size={21} />
        <span className="text-xs text-gray-400">Music from Spotify</span>
      </div>
    </div>
  );
}
