import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, ChevronRight, BookOpen } from 'lucide-react';
import type { Series } from '../../types';
import './SeriesCard.css';

interface SeriesCardProps {
  series: Series;
  index?: number;
}

export default function SeriesCard({ series, index = 0 }: SeriesCardProps) {
  return (
    <motion.div
      className="series-card glass-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      id={`series-card-${series.id}`}
    >
      <div className="series-card__header">
        <div className="series-card__icon">
          <BookOpen size={24} />
        </div>
        <div className="series-card__count">
          <Play size={12} />
          <span>{series.videoCount} видео</span>
        </div>
      </div>

      <h3 className="series-card__title">{series.title}</h3>
      <p className="series-card__description">{series.description}</p>

      <Link
        to={`/catalog?series=${series.id}`}
        className="series-card__link"
      >
        <span>Смотреть серию</span>
        <ChevronRight size={16} />
      </Link>
    </motion.div>
  );
}
