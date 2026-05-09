import { motion } from 'framer-motion';
import SeriesCard from '../components/SeriesCard/SeriesCard';
import seriesData from '../data/series.json';
import type { Series as SeriesType } from '../types';
import './SeriesPage.css';

const series = seriesData as SeriesType[];

export default function SeriesPage() {
  const sortedSeries = [...series].sort((a, b) => a.order - b.order);

  return (
    <div className="series-page">
      <div className="container">
        <motion.div
          className="series-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="section-title">Серии и курсы</h1>
          <p className="section-subtitle">
            Структурированные плейлисты для системного изучения.
            Каждая серия — это последовательный путь от основ к глубокому пониманию.
          </p>
        </motion.div>

        <div className="series-grid">
          {sortedSeries.map((s, i) => (
            <SeriesCard key={s.id} series={s} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
