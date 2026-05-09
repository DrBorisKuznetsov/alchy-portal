import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import VideoCard from '../components/VideoCard/VideoCard';
import SearchBar from '../components/SearchBar/SearchBar';
import videosData from '../data/videos.json';
import seriesData from '../data/series.json';
import type { Video, Series, SortOption } from '../types';
import './Catalog.css';

const videos = videosData as Video[];
const series = seriesData as Series[];

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const initialSeries = searchParams.get('series') || '';

  const [query, setQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [activeCategory, setActiveCategory] = useState(initialSeries);

  const categories = useMemo(() => {
    return [...new Set(
      series.map(s => s.id)
    )];
  }, []);

  const categoryLabels = useMemo(() => {
    const map: Record<string, string> = {};
    series.forEach(s => { map[s.id] = s.title; });
    return map;
  }, []);

  const filteredVideos = useMemo(() => {
    let result = [...videos];

    // Filter by search query
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter by category/series
    if (activeCategory) {
      result = result.filter((v) => v.playlistId === activeCategory);
    }

    // Sort
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
        break;
      case 'popular':
        result.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'mostLiked':
        result.sort((a, b) => b.likeCount - a.likeCount);
        break;
    }

    return result;
  }, [query, sortOption, activeCategory]);

  return (
    <div className="catalog-page">
      <div className="container">
        {/* Page Header */}
        <motion.div
          className="catalog-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="section-title">Каталог видео</h1>
          <p className="section-subtitle">
            Полная библиотека контента канала ALCHY. Ищите, фильтруйте, изучайте.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          sortOption={sortOption}
          onSortChange={setSortOption}
          resultCount={filteredVideos.length}
          totalCount={videos.length}
          categories={categories.map(c => categoryLabels[c] || c)}
          activeCategory={categoryLabels[activeCategory] || activeCategory}
          onCategoryChange={(label) => {
            const id = Object.entries(categoryLabels).find(
              ([, v]) => v === label
            )?.[0] || '';
            setActiveCategory(id);
          }}
        />

        {/* Video Grid */}
        {filteredVideos.length > 0 ? (
          <div className="catalog-grid">
            {filteredVideos.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            className="catalog-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>Видео не найдены</p>
            <span>Попробуйте изменить параметры поиска</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
