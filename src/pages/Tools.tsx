import { motion } from 'framer-motion';
import RCFilter from '../components/Calculators/RCFilter';
import { Wrench, Info } from 'lucide-react';
import './Tools.css';

export default function Tools() {
  return (
    <div className="tools-page" id="tools-page">
      {/* Hero Section */}
      <section className="tools-hero">
        <div className="container">
          <motion.div 
            className="tools-hero__content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="badge badge-primary mb-4">
              <Wrench size={14} />
              Engineering Tools
            </div>
            <h1 className="display-4 mb-4">Инженерные калькуляторы</h1>
            <p className="lead text-muted max-w-2xl mx-auto">
              Инструменты для быстрого расчета схем, параметров компонентов и проектирования электроники. 
              Все калькуляторы сопровождаются визуализациями и ссылками на соответствующие видео.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="tools-content container section-padding">
        <div className="tools-grid">
          {/* Main Calculator Area */}
          <div className="tools-main">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <RCFilter />
            </motion.div>
          </div>

          {/* Sidebar / More Tools */}
          <aside className="tools-sidebar">
            <div className="tools-info-card">
              <div className="tools-info-header">
                <Info size={20} className="text-primary" />
                <h3>Как это работает?</h3>
              </div>
              <p>
                Мы используем классические формулы физики и электроники. 
                Графики строятся в реальном времени, чтобы вы могли видеть 
                влияние номиналов компонентов на характеристики схемы.
              </p>
            </div>

            <div className="tools-upcoming">
              <h3>Скоро появятся:</h3>
              <ul className="upcoming-list">
                <li>
                  <span className="dot"></span>
                  Делитель напряжения
                </li>
                <li>
                  <span className="dot"></span>
                  Ширина дорожки PCB (IPC-2221)
                </li>
                <li>
                  <span className="dot"></span>
                  Расчет Buck/Boost конвертера
                </li>
                <li>
                  <span className="dot"></span>
                  SNR и ENOB калькулятор
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
