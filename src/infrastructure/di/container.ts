import { GetRandomSongsUseCase } from '@/features/song/usecase/getRandomSongs';
import { SongRepository } from '../adapters/SongRepository';

const songRepository = new SongRepository();

const getRandomSongsUseCase = new GetRandomSongsUseCase(songRepository);

export const container = {
  getRandomSongsUseCase,
};
