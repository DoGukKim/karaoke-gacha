import { Song } from '@/domain/song/model';
import { ISongRepository } from '@/features/song/ports/repository';
import { supabaseClient } from '../lib/supabase/client';
import { SongDTOListSchema, toDomainList } from '../schemas/song';
import { z } from 'zod';

export class SongRepository implements ISongRepository {
  async getRandomSongs(count: number): Promise<Song[]> {
    const { data, error } = await supabaseClient.rpc('get_random_songs', {
      p_count: count,
    });

    if (error) throw new Error(error.message);

    const result = SongDTOListSchema.safeParse(data);
    if (!result.success) {
      // TODO: sentry로 로깅하기
      console.error('Song validation failed:', z.treeifyError(result.error));
      throw new Error('Invalid song data from server');
    }

    return toDomainList(result.data);
  }
}
