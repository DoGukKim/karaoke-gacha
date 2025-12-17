import { Song } from '@/domain/song/model';
import { container } from '@/infrastructure/di/container';

export async function getRandomSongsAction(count: number): Promise<Song[]> {
  const getRandomSongsUseCase = container.getRandomSongsUseCase;
  const songs = await getRandomSongsUseCase.execute(count);
  return songs || [];
}
