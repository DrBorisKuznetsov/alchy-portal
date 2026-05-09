import Parser from 'rss-parser';
import fs from 'fs';
import path from 'path';

const parser = new Parser();

const FEEDS = [
  { name: 'Habr Electronics', url: 'https://habr.com/ru/rss/hub/electronics/all/', lang: 'ru' },
  { name: 'Hackaday', url: 'https://hackaday.com/blog/feed/', lang: 'en' },
  { name: 'Electronics Weekly', url: 'https://www.electronicsweekly.com/news/feed/', lang: 'en' }
];

async function fetchNews() {
  console.log('📡 Сбор новостей из мира электроники...');
  let allNews: any[] = [];

  for (const feed of FEEDS) {
    try {
      console.log(`🔍 Проверка ${feed.name}...`);
      const data = await parser.parseURL(feed.url);
      
      const items = data.items.slice(0, 10).map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        source: feed.name,
        lang: feed.lang,
        contentSnippet: item.contentSnippet?.slice(0, 200) + '...'
      }));
      
      allNews = [...allNews, ...items];
    } catch (error) {
      console.error(`❌ Ошибка загрузки ${feed.name}:`, error);
    }
  }

  // Сортировка по дате (свежие сверху)
  allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const dataPath = path.join(process.cwd(), 'src', 'data', 'news.json');
  fs.writeFileSync(dataPath, JSON.stringify(allNews.slice(0, 30), null, 2));
  
  console.log(`✅ Готово! Сохранено ${allNews.length} новостей в ${dataPath}`);
}

fetchNews();
