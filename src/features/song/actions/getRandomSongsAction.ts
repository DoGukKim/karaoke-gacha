// 인앱토스는 아직 SSR 지원하지 않음. 'use server' 사용 불가.
// DI 의존은 원칙상 허용되지 않으나 규모를 고려해 타협.

import { Song } from '@/domain/song/model';
import { container } from '@/infrastructure/di/container';

export async function getRandomSongsAction(count: number): Promise<Song[]> {
  const getRandomSongsUseCase = container.getRandomSongsUseCase;
  const songs = await getRandomSongsUseCase.execute(count);
  return songs || [];
}
