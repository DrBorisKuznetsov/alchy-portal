import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'src', 'data', 'blog');
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'blog-index.json');

function generateIndex() {
  console.log('📝 Генерирую индекс блога...');
  
  if (!fs.existsSync(BLOG_DIR)) {
    console.error('❌ Папка блога не найдена');
    return;
  }

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
  
  const posts = files.map(filename => {
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    return {
      slug: filename.replace('.md', ''),
      title: data.title || 'Без названия',
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || content.slice(0, 150) + '...',
      author: data.author || 'ALCHY',
      content: content // Оставляем контент для простоты отображения
    };
  });

  // Сортировка по дате
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
  console.log(`✅ Индекс создан: ${posts.length} статей`);
}

generateIndex();
