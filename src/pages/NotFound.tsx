import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found">
      <motion.div
        className="not-found__content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="not-found__code">404</span>
        <h1>Страница не найдена</h1>
        <p>Похоже, эта страница не существует или была перемещена.</p>
        <div className="not-found__actions">
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            На главную
          </Link>
          <Link to="/catalog" className="btn btn-secondary">
            <ArrowLeft size={16} />
            Каталог видео
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
