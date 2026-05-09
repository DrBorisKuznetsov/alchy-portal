import Parser from 'rss-parser';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const parser = new Parser();
const genAI = new GoogleGenerativeAI(process.env.YOUTUBE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const FEEDS = [
  { name: 'Analog Devices', url: 'https://www.analog.com/en/about-ad/news-room/press-releases/rss.xml' },
  { name: 'TI Analog Wire', url: 'https://e2e.ti.com/blogs_/b/analogwire/posts/default.aspx?Output=rss' },
  { name: 'EDN Design Ideas', url: 'https://www.edn.com/design-ideas/feed/' },
  { name: 'Habr Электроника', url: 'https://habr.com/ru/rss/hub/electronics/all/' },
  { name: 'Habr Схемотехника', url: 'https://habr.com/ru/rss/hub/hardware/all/' }
];

async function processWithAI(newsItems: any[]) {
  const prompt = `
    Ты — ведущий инженер-электронщик. Твоя задача — составить дайджест для коллег.
    Перед тобой список статей от Analog Devices, TI, EDN и Habr.
    
    1. Переведи заголовок на качественный технический русский.
    2. Напиши ОДНО предложение-саммари на русском: о чем эта статья (суть).
    3. Верни строго JSON: [{"title": "Заголовок", "summary": "Суть", "link": "url", "source": "source", "pubDate": "date"}]
    
    Список:
    ${JSON.stringify(newsItems.map(n => ({ title: n.title, link: n.link, source: n.source, date: n.pubDate })))}
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\[.*\]/s);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  } catch (e) {
    console.error('AI Error:', e);
    return newsItems.map(n => ({ title: n.title, summary: 'Техническая статья', link: n.link, source: n.source, pubDate: n.pubDate }));
  }
}

async function fetchNews() {
  console.log('📡 Сбор глубокого инженерного контента...');
  let rawNews: any[] = [];

  for (const feed of FEEDS) {
    try {
      const data = await parser.parseURL(feed.url);
      rawNews = [...rawNews, ...data.items.slice(0, 8).map(i => ({ ...i, source: feed.name }))];
    } catch (e) {
       console.error(`Error fetching ${feed.name}:`, e);
    }
  }

  const BATCH_SIZE = 8;
  let processedNews: any[] = [];
  for (let i = 0; i < rawNews.length; i += BATCH_SIZE) {
    const batch = rawNews.slice(i, i + BATCH_SIZE);
    const aiResult = await processWithAI(batch);
    processedNews = [...processedNews, ...aiResult];
  }

  const dataPath = path.join(process.cwd(), 'src', 'data', 'news.json');
  fs.writeFileSync(dataPath, JSON.stringify(processedNews.slice(0, 30), null, 2));
  console.log(`✅ Инженерный дайджест (AD/TI/EDN) готов!`);
}

fetchNews();
