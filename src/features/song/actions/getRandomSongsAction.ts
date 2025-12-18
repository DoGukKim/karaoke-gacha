// 인앱토스는 아직 SSR 지원하지 않음. 'use server' 사용 불가.

import { Song } from '@/domain/song/model';
import { container } from '@/infrastructure/di/container';

export async function getRandomSongsAction(count: number): Promise<Song[]> {
  const getRandomSongsUseCase = container.getRandomSongsUseCase;
  const songs = await getRandomSongsUseCase.execute(count);
  return songs || [];
}
