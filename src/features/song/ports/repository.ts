import { Song } from '@/domain/song/model';

export interface ISongRepository {
  getRandomSongs(count: number): Promise<Song[]>;
}
