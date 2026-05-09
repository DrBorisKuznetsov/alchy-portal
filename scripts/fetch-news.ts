import Parser from 'rss-parser';
import fs from 'fs';
import path from 'path';

// Используем таймаут, чтобы не висеть вечно
const parser = new Parser({
  timeout: 10000, 
});

const FEEDS = [
  { name: 'Analog Devices', url: 'https://www.analog.com/en/about-ad/news-room/press-releases/rss.xml' },
  { name: 'TI Analog Wire', url: 'https://e2e.ti.com/blogs_/b/analogwire/posts/default.aspx?Output=rss' },
  { name: 'EDN Design Ideas', url: 'https://www.edn.com/design-ideas/feed/' },
  { name: 'Habr Электроника', url: 'https://habr.com/ru/rss/hub/electronics/all/' },
  { name: 'Habr Схемотехника', url: 'https://habr.com/ru/rss/hub/hardware/all/' }
];

async function fetchNews() {
  console.log('📡 Сбор инженерного контента (Безопасный режим)...');
  let allNews: any[] = [];

  for (const feed of FEEDS) {
    try {
      console.log(`🔍 Запрос ${feed.name}...`);
      const data = await parser.parseURL(feed.url);
      
      const items = data.items.slice(0, 10).map(i => ({
        title: i.title || 'Без названия',
        summary: i.contentSnippet?.slice(0, 150) || 'Техническая статья',
        link: i.link,
        source: feed.name,
        pubDate: i.pubDate,
        lang: (feed.name.includes('Habr') ? 'ru' : 'en')
      }));
      
      allNews = [...allNews, ...items];
    } catch (e) {
      console.error(`⚠️ Пропущен источник ${feed.name} (Таймаут или ошибка)`);
    }
  }

  allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const dataPath = path.join(process.cwd(), 'src', 'data', 'news.json');
  fs.writeFileSync(dataPath, JSON.stringify(allNews.slice(0, 40), null, 2));
  
  console.log(`✅ Данные сохранены. Завершение процесса...`);
  
  // ЖЕСТКОЕ ЗАВЕРШЕНИЕ, чтобы не вешать билд
  process.exit(0);
}

fetchNews().catch(() => process.exit(1));
