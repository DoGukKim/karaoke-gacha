import { Song } from '@/domain/song/model';
import { ISongRepository } from '../ports/repository';

export class GetRandomSongsUseCase {
  constructor(private readonly songRepository: ISongRepository) {}

  async execute(count: number): Promise<Song[]> {
    return await this.songRepository.getRandomSongs(count);
  }
}
