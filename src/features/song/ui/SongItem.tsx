'use client';

import Image from 'next/image';
import type { Song } from '@/domain/song/model';
import { SpotifyIcon } from '@/shared/ui/icons';
import { MarqueeText } from '@/shared/ui';

interface SongItemProps {
  song: Song;
  onSpotifyClick?: (spotifyUrl: string) => void;
}

export function SongItem({ song, onSpotifyClick }: SongItemProps) {
  const handleClick = () => {
    onSpotifyClick?.(song.spotifyUrl);
  };

  return (
    <div className="flex w-full items-center gap-3 py-2">
      <Image
        src={song.artWorkUrl}
        alt={`${song.title} - ${song.artist}`}
        width={48}
        height={48}
        className="shrink-0 rounded"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden">
        <MarqueeText className="text-base font-bold text-gray-700">{song.title}</MarqueeText>
        <MarqueeText className="text-sm text-gray-500">{song.artist}</MarqueeText>
      </div>

      <SpotifyIcon size={24} onClick={handleClick} className="shrink-0 cursor-pointer" />
    </div>
  );
}
