'use server';

import { Song } from '@/domain/song/model';
import { container } from '@/infrastructure/di/container';

export async function getRandomSongsAction(count: number): Promise<Song[]> {
  // 1. DI 컨테이너에서 Usecase 주입받음 (Hook은 몰라도 됨)
  const getRandomSongsUseCase = container.getRandomSongsUseCase;

  // 2. 실행 및 결과 반환
  // (여기서 반환되는 데이터는 직렬화되어 클라이언트로 넘어감)
  const songs = await getRandomSongsUseCase.execute(count);

  return songs || [];
}
