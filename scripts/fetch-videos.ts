/**
 * ALCHY Portal — YouTube Data API v3 Fetcher
 * 
 * Загружает все видео и плейлисты с канала @ALCHY_CHANNAL
 * и сохраняет в src/data/videos.json, series.json, channel.json
 * 
 * Использование:
 *   npx tsx scripts/fetch-videos.ts <YOUR_API_KEY>
 * 
 * Квота: ~10 units на полный цикл (из 10,000 дневных)
 */

const API_BASE = 'https://www.googleapis.com/youtube/v3';
const CHANNEL_HANDLE = '@ALCHY_CHANNAL';

// ─── Types ───────────────────────────────────────────────

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    medium: string;
    high: string;
    maxres?: string;
  };
  duration: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags: string[];
  playlistId?: string;
  playlistTitle?: string;
}

interface YouTubeSeries {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoCount: number;
  videoIds: string[];
  order: number;
}

interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  publishedAt: string;
  thumbnail: string;
  banner: string;
}

// ─── API Helpers ─────────────────────────────────────────

let apiKey = '';
let quotaUsed = 0;

async function ytFetch(endpoint: string, params: Record<string, string>): Promise<any> {
  const url = new URL(`${API_BASE}/${endpoint}`);
  url.searchParams.set('key', apiKey);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`YouTube API error (${res.status}): ${err}`);
  }
  quotaUsed++;
  return res.json();
}

// ─── Channel Info ────────────────────────────────────────

async function fetchChannelInfo(): Promise<{ channel: YouTubeChannel; uploadsPlaylistId: string }> {
  console.log('📡 Загрузка информации о канале...');

  // Search for channel by handle
  const searchData = await ytFetch('search', {
    part: 'snippet',
    q: CHANNEL_HANDLE,
    type: 'channel',
    maxResults: '1',
  });
  quotaUsed += 99; // search.list costs 100 units total

  if (!searchData.items?.length) {
    throw new Error(`Канал ${CHANNEL_HANDLE} не найден`);
  }

  const channelId = searchData.items[0].snippet.channelId;

  // Get full channel details
  const channelData = await ytFetch('channels', {
    part: 'snippet,statistics,contentDetails,brandingSettings',
    id: channelId,
  });

  const ch = channelData.items[0];
  const uploadsPlaylistId = ch.contentDetails.relatedPlaylists.uploads;

  const channel: YouTubeChannel = {
    id: ch.id,
    title: ch.snippet.title,
    description: ch.snippet.description,
    customUrl: ch.snippet.customUrl || CHANNEL_HANDLE,
    subscriberCount: parseInt(ch.statistics.subscriberCount || '0'),
    videoCount: parseInt(ch.statistics.videoCount || '0'),
    viewCount: parseInt(ch.statistics.viewCount || '0'),
    publishedAt: ch.snippet.publishedAt,
    thumbnail: ch.snippet.thumbnails?.high?.url || ch.snippet.thumbnails?.default?.url || '',
    banner: ch.brandingSettings?.image?.bannerExternalUrl || '',
  };

  console.log(`  ✅ ${channel.title} — ${channel.subscriberCount} подписчиков, ${channel.videoCount} видео`);

  return { channel, uploadsPlaylistId };
}

// ─── Playlists (Series) ──────────────────────────────────

async function fetchPlaylists(channelId: string): Promise<YouTubeSeries[]> {
  console.log('📋 Загрузка плейлистов...');

  const allPlaylists: YouTubeSeries[] = [];
  let pageToken = '';
  let order = 1;

  do {
    const params: Record<string, string> = {
      part: 'snippet,contentDetails',
      channelId,
      maxResults: '50',
    };
    if (pageToken) params.pageToken = pageToken;

    const data = await ytFetch('playlists', params);

    for (const item of data.items || []) {
      allPlaylists.push({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description || '',
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || '',
        videoCount: item.contentDetails.itemCount,
        videoIds: [], // will be filled later
        order: order++,
      });
    }

    pageToken = data.nextPageToken || '';
  } while (pageToken);

  console.log(`  ✅ Найдено ${allPlaylists.length} плейлистов`);
  return allPlaylists;
}

// ─── Playlist Items ──────────────────────────────────────

async function fetchPlaylistVideoIds(playlistId: string): Promise<string[]> {
  const videoIds: string[] = [];
  let pageToken = '';

  do {
    const params: Record<string, string> = {
      part: 'contentDetails',
      playlistId,
      maxResults: '50',
    };
    if (pageToken) params.pageToken = pageToken;

    const data = await ytFetch('playlistItems', params);

    for (const item of data.items || []) {
      videoIds.push(item.contentDetails.videoId);
    }

    pageToken = data.nextPageToken || '';
  } while (pageToken);

  return videoIds;
}

// ─── Video Details ───────────────────────────────────────

async function fetchVideoDetails(videoIds: string[]): Promise<YouTubeVideo[]> {
  const videos: YouTubeVideo[] = [];

  // Batch by 50 (1 API call per 50 videos)
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);

    const data = await ytFetch('videos', {
      part: 'snippet,contentDetails,statistics',
      id: batch.join(','),
    });

    for (const item of data.items || []) {
      videos.push({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description || '',
        publishedAt: item.snippet.publishedAt,
        thumbnails: {
          medium: item.snippet.thumbnails?.medium?.url || '',
          high: item.snippet.thumbnails?.high?.url || '',
          maxres: item.snippet.thumbnails?.maxres?.url,
        },
        duration: item.contentDetails.duration,
        viewCount: parseInt(item.statistics.viewCount || '0'),
        likeCount: parseInt(item.statistics.likeCount || '0'),
        commentCount: parseInt(item.statistics.commentCount || '0'),
        tags: item.snippet.tags || [],
      });
    }

    console.log(`  📦 Загружено ${Math.min(i + 50, videoIds.length)}/${videoIds.length} видео`);
  }

  return videos;
}

// ─── Main ────────────────────────────────────────────────

async function main() {
  apiKey = process.argv[2];

  if (!apiKey) {
    console.error('❌ Укажите API ключ: npx tsx scripts/fetch-videos.ts YOUR_API_KEY');
    process.exit(1);
  }

  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   ALCHY Portal — YouTube Data Fetcher    ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');

  try {
    // 1. Fetch channel info
    const { channel, uploadsPlaylistId } = await fetchChannelInfo();

    // 2. Fetch all playlists
    const playlists = await fetchPlaylists(channel.id);

    // 3. Fetch all video IDs from uploads playlist
    console.log('📹 Загрузка списка всех видео...');
    const allVideoIds = await fetchPlaylistVideoIds(uploadsPlaylistId);
    console.log(`  ✅ Найдено ${allVideoIds.length} видео`);

    // 4. Fetch video details
    console.log('📊 Загрузка деталей видео...');
    const allVideos = await fetchVideoDetails(allVideoIds);

    // 5. Map videos to playlists
    console.log('🔗 Привязка видео к плейлистам...');
    for (const playlist of playlists) {
      const playlistVideoIds = await fetchPlaylistVideoIds(playlist.id);
      playlist.videoIds = playlistVideoIds;

      // Tag videos with playlist info
      for (const vid of allVideos) {
        if (playlistVideoIds.includes(vid.id) && !vid.playlistId) {
          vid.playlistId = playlist.id;
          vid.playlistTitle = playlist.title;
        }
      }

      console.log(`  📋 ${playlist.title}: ${playlistVideoIds.length} видео`);
    }

    // 6. Sort videos by publish date (newest first)
    allVideos.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    // 7. Save to files
    const fs = await import('fs');
    const path = await import('path');
    const dataDir = path.join(process.cwd(), 'src', 'data');

    fs.writeFileSync(
      path.join(dataDir, 'channel.json'),
      JSON.stringify(channel, null, 2),
      'utf-8'
    );

    fs.writeFileSync(
      path.join(dataDir, 'videos.json'),
      JSON.stringify(allVideos, null, 2),
      'utf-8'
    );

    fs.writeFileSync(
      path.join(dataDir, 'series.json'),
      JSON.stringify(playlists, null, 2),
      'utf-8'
    );

    // 8. Summary
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('✅ Данные успешно загружены!');
    console.log('');
    console.log(`  📺 Канал: ${channel.title}`);
    console.log(`  👥 Подписчиков: ${channel.subscriberCount.toLocaleString()}`);
    console.log(`  📹 Видео загружено: ${allVideos.length}`);
    console.log(`  📋 Плейлистов: ${playlists.length}`);
    console.log(`  👁️ Всего просмотров: ${channel.viewCount.toLocaleString()}`);
    console.log(`  📊 API квота использована: ~${quotaUsed} units из 10,000`);
    console.log('');
    console.log('  Файлы обновлены:');
    console.log('    → src/data/channel.json');
    console.log('    → src/data/videos.json');
    console.log('    → src/data/series.json');
    console.log('═══════════════════════════════════════');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Ошибка:', (error as Error).message);
    console.error('');
    console.error('Возможные причины:');
    console.error('  1. Неверный API ключ');
    console.error('  2. YouTube Data API v3 не включен в Google Cloud Console');
    console.error('  3. Превышена квота API');
    process.exit(1);
  }
}

main();
