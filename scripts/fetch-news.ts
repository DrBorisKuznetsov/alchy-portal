import Parser from 'rss-parser';
import fs from 'fs';
import path from 'path';

const parser = new Parser({
  timeout: 15000,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
});

const FEEDS = [
  { name: 'Electronic Design', url: 'https://www.electronicdesign.com/rss' },
  { name: 'EDN Design Ideas', url: 'https://www.edn.com/design-ideas/feed/' },
  { name: 'Microwave Journal', url: 'https://www.microwavejournal.com/rss/articles' },
  { name: 'SemiEngineering', url: 'https://semiengineering.com/feed/' },
  { name: 'Habr Электроника', url: 'https://habr.com/ru/rss/hub/electronics/all/' },
  { name: 'Habr Схемотехника', url: 'https://habr.com/ru/rss/hub/hardware/all/' }
];

async function fetchNews() {
  console.log('📡 Сбор инженерного дайджеста...');
  let allNews: any[] = [];

  for (const feed of FEEDS) {
    try {
      console.log(`🔍 Запрос ${feed.name}...`);
      const data = await parser.parseURL(feed.url);
      
      const items = data.items.slice(0, 10).map(i => {
        // У некоторых RSS summary лежит в разных полях
        const snippet = i.contentSnippet || i.summary || i.content || '';
        
        return {
          title: i.title || 'Без названия',
          summary: snippet.replace(/<[^>]*>/g, '').slice(0, 180).trim() + '...',
          link: i.link,
          source: feed.name,
          pubDate: i.pubDate,
          lang: (feed.name.includes('Habr') ? 'ru' : 'en')
        };
      });
      
      allNews = [...allNews, ...items];
    } catch (e) {
      console.error(`⚠️ Пропущен источник ${feed.name}`);
    }
  }

  allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const dataPath = path.join(process.cwd(), 'src', 'data', 'news.json');
  fs.writeFileSync(dataPath, JSON.stringify(allNews.slice(0, 45), null, 2));
  
  console.log(`✅ Дайджест сформирован (${allNews.length} статей).`);
  process.exit(0);
}

fetchNews().catch(() => process.exit(1));
