import { createClient } from '@supabase/supabase-js';

// Spotify API 타입
interface SpotifyImage {
  url: string;
  width: number;
  height: number;
}

interface SpotifyTrack {
  name: string;
  is_local: boolean;
  artists: { name: string }[];
  album: { images: SpotifyImage[] };
  external_urls?: { spotify: string };
}

interface SpotifyPlaylistItem {
  track: SpotifyTrack | null;
}

interface SpotifyPlaylistResponse {
  items: SpotifyPlaylistItem[];
  next: string | null;
  error?: { message: string };
}

// 앱 내부 타입
interface Song {
  title: string;
  artist: string;
  artwork_url: string;
  spotify_url: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function getSpotifyToken() {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
      ).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token;
}

function getArtwork300(images: SpotifyImage[]): string {
  // 300x300 이미지 찾기, 없으면 중간 사이즈 (보통 index 1)
  const target = images.find((img) => img.width === 300 && img.height === 300);
  return target?.url ?? images[1]?.url ?? images[0]?.url ?? '';
}

async function getPlaylistTracks(token: string, playlistId: string): Promise<Song[]> {
  const allTracks: Song[] = [];

  let url: string | null =
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?market=KR&limit=50`;

  while (url) {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept-Language': 'ko-KR,ko;q=0.9', // 한국어 우선
      },
    });
    const data: SpotifyPlaylistResponse = await res.json();

    if (data.error) {
      console.error(`❌ API 에러: ${data.error.message}`);
      break;
    }

    const tracks = data.items
      .filter(
        (item): item is SpotifyPlaylistItem & { track: SpotifyTrack } =>
          item.track !== null && !item.track.is_local,
      )
      .map((item) => ({
        title: item.track.name,
        artist: item.track.artists.map((a) => a.name).join(', '),
        artwork_url: getArtwork300(item.track.album.images),
        spotify_url: item.track.external_urls?.spotify ?? '',
      }));

    allTracks.push(...tracks);
    url = data.next;
  }

  return allTracks;
}

async function seedSongs(songs: Song[]) {
  // 중복 제거 (title + artist 기준)
  const { data: existing } = await supabase.from('songs').select('title, artist');
  const existingSet = new Set(
    (existing as { title: string; artist: string }[] | null)?.map(
      (s) => `${s.title}|${s.artist}`,
    ) ?? [],
  );

  const newSongs = songs.filter((s) => !existingSet.has(`${s.title}|${s.artist}`));

  if (newSongs.length === 0) {
    console.log('ℹ️ 새로운 곡 없음');
    return;
  }

  const { error } = await supabase.from('songs').insert(newSongs);
  if (error) throw error;
  console.log(`✅ ${newSongs.length}곡 저장 (중복 ${songs.length - newSongs.length}곡 제외)`);
}

function extractPlaylistId(input: string): string {
  // URL 또는 ID 둘 다 지원
  const match = input.match(/playlist\/([a-zA-Z0-9]+)/);
  return match ? match[1] : input;
}

async function clearAllSongs() {
  const { error } = await supabase.from('songs').delete().not('id', 'is', null);
  if (error) throw error;
  console.log('🗑️ 모든 노래 삭제 완료');
}

async function main() {
  const inputs = process.argv.slice(2);

  if (inputs.length === 0) {
    console.log(`
사용법: pnpm seed <command>

명령어:
  pnpm seed clear                  # 모든 노래 삭제
  pnpm seed <playlist_url_or_id>   # 플레이리스트 추가
  pnpm seed p1 p2 p3               # 여러 플레이리스트 추가

예시:
  pnpm seed clear
  pnpm seed 37i9dQZF1DXdPec7aLTmlC
  pnpm seed https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC
    `);
    process.exit(1);
  }

  // clear 명령어
  if (inputs[0] === 'clear') {
    await clearAllSongs();
    return;
  }

  const token = await getSpotifyToken();

  for (const input of inputs) {
    const playlistId = extractPlaylistId(input);
    console.log(`\n📀 플레이리스트: ${playlistId}`);

    const songs = await getPlaylistTracks(token, playlistId);
    console.log(`   ${songs.length}곡 발견`);

    await seedSongs(songs);
  }
}

main().catch(console.error);
