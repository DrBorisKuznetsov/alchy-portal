import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import Hero from '../components/Hero/Hero';
import VideoCard from '../components/VideoCard/VideoCard';
import SeriesCard from '../components/SeriesCard/SeriesCard';
import videosData from '../data/videos.json';
import seriesData from '../data/series.json';
import type { Video, Series } from '../types';
import './Home.css';

const videos = videosData as Video[];
const series = seriesData as Series[];

export default function Home() {
  const latestVideos = [...videos].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  ).slice(0, 6);

  const featuredVideo = latestVideos[0];
  const restVideos = latestVideos.slice(1, 5);

  const popularVideos = [...videos].sort((a, b) => b.viewCount - a.viewCount).slice(0, 4);

  const topSeries = [...series].sort((a, b) => a.order - b.order).slice(0, 4);

  return (
    <div className="home-page">
      <Hero />

      {/* Latest Videos Section */}
      <section className="section" id="latest-videos">
        <div className="container">
          <div className="home-section-header">
            <div>
              <div className="home-section-label">
                <Sparkles size={14} />
                <span>Новое</span>
              </div>
              <h2 className="section-title">Последние видео</h2>
              <p className="section-subtitle">
                Свежие выпуски с канала ALCHY
              </p>
            </div>
            <Link to="/catalog" className="btn btn-secondary" id="view-all-btn">
              Все видео
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="home-videos-grid">
            {featuredVideo && (
              <VideoCard video={featuredVideo} index={0} featured />
            )}
            {restVideos.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Videos */}
      <section className="section section--alt" id="popular-videos">
        <div className="container">
          <div className="home-section-header">
            <div>
              <div className="home-section-label home-section-label--amber">
                <TrendingUp size={14} />
                <span>Популярное</span>
              </div>
              <h2 className="section-title">Самое просматриваемое</h2>
              <p className="section-subtitle">
                Видео, которые зацепили больше всего
              </p>
            </div>
          </div>

          <div className="home-popular-grid">
            {popularVideos.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Series Section */}
      <section className="section" id="series-section">
        <div className="container">
          <div className="home-section-header">
            <div>
              <h2 className="section-title">Серии и курсы</h2>
              <p className="section-subtitle">
                Структурированные плейлисты для последовательного обучения
              </p>
            </div>
            <Link to="/series" className="btn btn-secondary">
              Все серии
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="home-series-grid">
            {topSeries.map((s, i) => (
              <SeriesCard key={s.id} series={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" id="cta-section">
        <div className="container">
          <motion.div
            className="home-cta glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="home-cta__content">
              <h2>Хотите сотрудничать?</h2>
              <p>
                Если вы представляете компанию или бренд в сфере электроники —
                давайте обсудим возможности интеграции и спонсорства.
              </p>
            </div>
            <Link to="/sponsors" className="btn btn-primary btn-lg">
              Узнать подробнее
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
