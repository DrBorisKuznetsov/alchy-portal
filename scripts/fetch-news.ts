import Parser from 'rss-parser';
import fs from 'fs';
import path from 'path';

const parser = new Parser({
  timeout: 15000,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
});

const FEEDS = [
  // Зарубежные элитные
  { name: 'Electronic Design', url: 'https://www.electronicdesign.com/rss', limit: 8 },
  { name: 'EDN Design Ideas', url: 'https://www.edn.com/design-ideas/feed/', limit: 8 },
  { name: 'Microwave Journal', url: 'https://www.microwavejournal.com/rss/articles', limit: 5 },
  
  // Российские профессиональные
  { name: 'КиТ (Компоненты и Технологии)', url: 'https://kit-e.ru/feed/', limit: 10 },
  { name: 'Электронные компоненты', url: 'https://elcomdesign.ru/feed/', limit: 10 },
  
  // Хабр (ограничиваем, чтобы не захламлял)
  { name: 'Habr Схемотехника', url: 'https://habr.com/ru/rss/hub/electronics/all/', limit: 4 },
  { name: 'Habr Железо', url: 'https://habr.com/ru/rss/hub/hardware/all/', limit: 4 }
];

async function fetchNews() {
  console.log('📡 Сбор сбалансированного инженерного дайджеста...');
  let allNews: any[] = [];

  for (const feed of FEEDS) {
    try {
      console.log(`🔍 Запрос ${feed.name}...`);
      const data = await parser.parseURL(feed.url);
      
      const items = data.items.slice(0, feed.limit).map(i => {
        const snippet = i.contentSnippet || i.summary || i.content || '';
        const isHabr = feed.name.includes('Habr');
        
        return {
          title: i.title || 'Без названия',
          summary: snippet.replace(/<[^>]*>/g, '').slice(0, 180).trim() + '...',
          link: i.link,
          source: feed.name,
          pubDate: i.pubDate,
          lang: (isHabr || feed.name.includes('КиТ') || feed.name.includes('Электронные') ? 'ru' : 'en')
        };
      });
      
      allNews = [...allNews, ...items];
    } catch (e) {
      console.error(`⚠️ Пропущен источник ${feed.name}`);
    }
  }

  // Сортировка по дате
  allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const dataPath = path.join(process.cwd(), 'src', 'data', 'news.json');
  fs.writeFileSync(dataPath, JSON.stringify(allNews.slice(0, 50), null, 2));
  
  console.log(`✅ Дайджест сформирован (${allNews.length} статей). Баланс соблюден.`);
  process.exit(0);
}

fetchNews().catch(() => process.exit(1));
