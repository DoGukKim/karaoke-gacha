import { createClient } from '@supabase/supabase-js';

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

const ARTWORK_SIZE = 300;
function getArtwork(images: SpotifyImage[]): string {
  if (images.length === 0) return '';
  const preferred = images.find((img) => img.width === ARTWORK_SIZE && img.height === ARTWORK_SIZE);
  return preferred?.url ?? images[1]?.url ?? images[0].url;
}

function toSong(track: SpotifyTrack): Song {
  return {
    title: track.name,
    artist: track.artists.map((a) => a.name).join(', '),
    artwork_url: getArtwork(track.album.images),
    spotify_url: track.external_urls?.spotify ?? '',
  };
}

function isValidTrack(
  item: SpotifyPlaylistItem,
): item is SpotifyPlaylistItem & { track: SpotifyTrack } {
  return item.track !== null && !item.track.is_local;
}

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
async function getPlaylistTracks(token: string, playlistId: string): Promise<Song[]> {
  const allTracks: Song[] = [];
  const headers = { Authorization: `Bearer ${token}`, 'Accept-Language': 'ko-KR,ko;q=0.9' };

  let url: string | null = `${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks?market=KR&limit=50`;

  while (url) {
    const res = await fetch(url, { headers });
    const data: SpotifyPlaylistResponse = await res.json();

    if (data.error) {
      console.error(`api error: ${data.error.message}`);
      break;
    }

    const tracks = data.items.filter(isValidTrack).map((item) => toSong(item.track));
    allTracks.push(...tracks);
    url = data.next;
  }

  return allTracks;
}

type SongKey = { title: string; artist: string };

function toSongKey(song: SongKey): string {
  return `${song.title}|${song.artist}`;
}

async function seedSongs(songs: Song[]) {
  if (songs.length === 0) return;

  const { data: existing } = await supabase.from('songs').select('title, artist');
  const existingSet = new Set((existing ?? []).map(toSongKey));
  const newSongs = songs.filter((s) => !existingSet.has(toSongKey(s)));

  if (newSongs.length === 0) {
    console.log('no new songs');
    return;
  }

  const { error } = await supabase.from('songs').insert(newSongs);
  if (error) throw error;

  const duplicateCount = songs.length - newSongs.length;
  console.log(`${newSongs.length} songs saved (${duplicateCount} duplicates skipped)`);
}

const PLAYLIST_ID_REGEX = /playlist\/([a-zA-Z0-9]+)/;

function extractPlaylistId(input: string): string {
  return input.match(PLAYLIST_ID_REGEX)?.[1] ?? input;
}

const COMMANDS = { CLEAR: 'clear' } as const;

async function clearAllSongs() {
  const { error } = await supabase.from('songs').delete().not('id', 'is', null);
  if (error) throw error;
  console.log('all songs deleted');
}

function showHelp(): never {
  console.log(`
Usage: pnpm seed <command>

Commands:
  pnpm seed clear                  # Delete all songs
  pnpm seed <playlist_url_or_id>   # Add playlist
  pnpm seed p1 p2 p3               # Add multiple playlists

Examples:
  pnpm seed clear
  pnpm seed 37i9dQZF1DXdPec7aLTmlC
  pnpm seed https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC
  `);
  process.exit(1);
}

async function processPlaylists(inputs: string[]) {
  const token = await getSpotifyToken();

  for (const input of inputs) {
    const playlistId = extractPlaylistId(input);
    console.log(`\nplaylist: ${playlistId}`);

    const songs = await getPlaylistTracks(token, playlistId);
    console.log(`  ${songs.length} songs found`);

    await seedSongs(songs);
  }
}

async function main() {
  const inputs = process.argv.slice(2);

  if (inputs.length === 0) showHelp();
  if (inputs[0] === COMMANDS.CLEAR) return clearAllSongs();

  await processPlaylists(inputs);
}

main().catch(console.error);
