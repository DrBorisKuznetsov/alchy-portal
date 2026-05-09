import Parser from 'rss-parser';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const parser = new Parser();
const genAI = new GoogleGenerativeAI(process.env.YOUTUBE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const FEEDS = [
  { name: 'Habr Схемотехника', url: 'https://habr.com/ru/rss/hub/electronics/all/' },
  { name: 'Hackaday', url: 'https://hackaday.com/blog/feed/' },
  { name: 'Electronics Weekly', url: 'https://www.electronicsweekly.com/news/feed/' }
];

async function processWithAI(newsItems: any[]) {
  const prompt = `
    Ты — инженер-электронщик. Переведи список новостей на технический русский язык.
    Удали мусор (гаджеты, смартфоны, общие IT-новости). 
    Оставь только: микроконтроллеры, схемотехника, PCB, силовая электроника.
    Верни строго JSON: [{"title": "Русский заголовок", "link": "url", "source": "source", "pubDate": "date"}]
    
    Новости:
    ${JSON.stringify(newsItems.map(n => ({ title: n.title, link: n.link, source: n.source, date: n.pubDate })))}
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\[.*\]/s);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  } catch (e) {
    console.error('AI Error:', e);
    // Если ИИ упал, возвращаем оригиналы (хотя бы Habr будет на русском)
    return newsItems.map(n => ({ title: n.title, link: n.link, source: n.source, pubDate: n.pubDate }));
  }
}

async function fetchNews() {
  console.log('📡 Запуск ИИ-перевода новостей на сервере...');
  let rawNews: any[] = [];

  for (const feed of FEEDS) {
    try {
      const data = await parser.parseURL(feed.url);
      rawNews = [...rawNews, ...data.items.slice(0, 10).map(i => ({ ...i, source: feed.name }))];
    } catch (e) {}
  }

  const BATCH_SIZE = 10;
  let processedNews: any[] = [];
  for (let i = 0; i < rawNews.length; i += BATCH_SIZE) {
    const batch = rawNews.slice(i, i + BATCH_SIZE);
    const aiResult = await processWithAI(batch);
    processedNews = [...processedNews, ...aiResult];
  }

  const dataPath = path.join(process.cwd(), 'src', 'data', 'news.json');
  fs.writeFileSync(dataPath, JSON.stringify(processedNews.slice(0, 30), null, 2));
  console.log(`✅ ИИ обработал ${processedNews.length} новостей.`);
}

fetchNews();
