import Parser from 'rss-parser';
import fs from 'fs';
import path from 'path';

const parser = new Parser();

const FEEDS = [
  { name: 'Habr Схемотехника', url: 'https://habr.com/ru/rss/hub/electronics/all/' },
  { name: 'Habr Железо', url: 'https://habr.com/ru/rss/hub/hardware/all/' },
  { name: 'Hackaday', url: 'https://hackaday.com/blog/feed/' },
  { name: 'Electronics Weekly', url: 'https://www.electronicsweekly.com/news/feed/' }
];

// Ключевые слова для фильтрации "мусора"
const STOP_WORDS = [
  'iphone', 'samsung', 'xiaomi', 'смартфон', 'игра', 'game', 'crypto', 'криптовалюта',
  'nft', 'акции', 'market', 'биржа', 'смарт-часы', 'ноутбук'
];

const KEEP_WORDS = [
  'mcu', 'stm32', 'esp32', 'pcb', 'pcap', 'adc', 'dac', 'analog', 'fpga', 'risc-v',
  'chip', 'semiconductor', 'power', 'sensor', 'датчик', 'контроллер', 'схема'
];

async function fetchNews() {
  console.log('📡 Сбор и фильтрация инженерных новостей...');
  let allNews: any[] = [];

  for (const feed of FEEDS) {
    try {
      console.log(`🔍 Скачиваю ${feed.name}...`);
      const data = await parser.parseURL(feed.url);
      
      const filteredItems = data.items.filter(item => {
        const title = item.title?.toLowerCase() || '';
        // Убираем мусор
        const hasStopWord = STOP_WORDS.some(word => title.includes(word));
        if (hasStopWord) return false;
        
        // Если это западный источник, проверяем наличие инженерных терминов
        if (feed.name === 'Hackaday' || feed.name === 'Electronics Weekly') {
           return KEEP_WORDS.some(word => title.includes(word)) || title.length > 50;
        }
        
        return true;
      });

      allNews = [...allNews, ...filteredItems.map(i => ({
        title: i.title,
        link: i.link,
        source: feed.name,
        pubDate: i.pubDate,
        lang: (feed.name.includes('Habr') ? 'ru' : 'en')
      }))];
    } catch (e) {
      console.error(`❌ Ошибка ${feed.name}:`, e);
    }
  }

  allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const dataPath = path.join(process.cwd(), 'src', 'data', 'news.json');
  fs.writeFileSync(dataPath, JSON.stringify(allNews.slice(0, 40), null, 2));
  
  console.log(`✅ Лента очищена. Сохранено ${allNews.length} новостей.`);
}

fetchNews();
