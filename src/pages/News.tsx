import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { 
  Calendar, User, ExternalLink, Newspaper, 
  MessageSquare, Send, Link as LinkIcon, Check 
} from 'lucide-react';
import { useState } from 'react';
import blogIndex from '../data/blog-index.json';
import newsDataRaw from '../data/news.json';
import './News.css';

interface NewsItem {
  title: string;
  summary: string;
  link: string;
  source: string;
  pubDate: string;
  lang: string;
}

const newsData = newsDataRaw as NewsItem[];

export default function News() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareToTelegram = (url: string, title: string) => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(tgUrl, '_blank');
  };

  return (
    <div className="news-page" id="news-page">
      <Helmet>
        <title>Инженерный дайджест | ALCHY Portal</title>
        <meta name="description" content="Свежие технические статьи и разработки от Analog Devices, Texas Instruments и мировых лидеров электроники на русском языке." />
      </Helmet>
      <div className="container">
        {/* Header */}
        <motion.div 
          className="news-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="section-title">Инженерный дайджест</h1>
          <p className="section-subtitle">Глубокая аналитика и свежие разработки от лидеров индустрии</p>
        </motion.div>

        <div className="news-layout">
          {/* Main Feed: Blog Posts */}
          <main className="news-feed">
            <h2 className="news-section-title">
              <MessageSquare size={20} />
              Заметки автора
            </h2>
            
            {blogIndex.map((post, i) => (
              <motion.article 
                key={post.slug}
                className="blog-post glass-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="blog-post__meta">
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>{new Date(post.date).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="meta-item">
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                </div>
                
                <h3 className="blog-post__title">{post.title}</h3>
                
                <div className="blog-post__content prose">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
                
                <div className="blog-post__footer">
                  <div className="badge badge-outline">ALCHY Insights</div>
                </div>
              </motion.article>
            ))}
          </main>

          {/* Sidebar: World News */}
          <aside className="news-sidebar">
            <h2 className="news-section-title">
              <Newspaper size={20} />
              Мировой дайджест
            </h2>
            
            <div className="external-news-list">
              {newsData.map((item, i) => (
                <motion.a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-item glass-card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="news-item__source">
                    <span className={`lang-badge lang-badge--${item.lang}`}>
                      {item.lang.toUpperCase()}
                    </span>
                    <span>{item.source}</span>
                  </div>
                  <h4 className="news-item__title">{item.title}</h4>
                  <p className="news-item__summary">{item.summary}</p>
                  <p className="news-item__date">
                    {new Date(item.pubDate).toLocaleDateString('ru-RU')}
                  </p>
                  
                  <div className="news-item__actions">
                    <button 
                      onClick={(e) => { e.preventDefault(); shareToTelegram(item.link, item.title); }}
                      className="action-btn"
                      title="Поделиться в Telegram"
                    >
                      <Send size={14} />
                    </button>
                    <button 
                      onClick={(e) => { e.preventDefault(); copyToClipboard(item.link, `news-${i}`); }}
                      className="action-btn"
                      title="Скопировать ссылку"
                    >
                      {copiedId === `news-${i}` ? <Check size={14} className="text-success" /> : <LinkIcon size={14} />}
                    </button>
                  </div>
                  <ExternalLink size={14} className="news-item__link-icon" />
                </motion.a>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
