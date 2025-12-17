import { z } from 'zod';
import { Song } from '@/domain/song/model';

export const SongSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1),
  artist: z.string().min(1),
  artwork_url: z.url(),
  spotify_url: z.url(),
});

export type SongDTO = z.infer<typeof SongSchema>;
export const SongDTOListSchema = z.array(SongSchema);

export const toDomain = (dto: SongDTO): Song => {
  return {
    id: dto.id,
    title: dto.title,
    artist: dto.artist,
    artWorkUrl: dto.artwork_url,
    spotifyUrl: dto.spotify_url,
  };
};

export const toDomainList = (dtos: SongDTO[]): Song[] => {
  return dtos.map(toDomain);
};
