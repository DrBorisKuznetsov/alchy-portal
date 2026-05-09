import { motion } from 'framer-motion';
import { CirclePlay, Heart, ChevronRight, Zap, BookOpen, Users } from 'lucide-react';
import channelData from '../../data/channel.json';
import { formatCount } from '../../utils/format';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="hero-section">
      {/* Background effects */}
      <div className="hero__bg">
        <div className="hero__grid" />
        <div className="hero__glow hero__glow--1" />
        <div className="hero__glow hero__glow--2" />
        <div className="hero__noise" />
      </div>

      <div className="container hero__container">
        <motion.div
          className="hero__content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <motion.div
            className="hero__eyebrow"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Zap size={14} />
            <span>Инженерный образовательный хаб</span>
          </motion.div>

          {/* Title */}
          <h1 className="hero__title">
            Making the{' '}
            <span className="hero__title-accent">complex</span>{' '}
            simple
          </h1>

          {/* Subtitle */}
          <p className="hero__subtitle">
            Электроника, микроконтроллеры, автоматизация — глубокие разборы для
            инженеров, разработчиков и продвинутых любителей
          </p>

          {/* CTA Buttons */}
          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <a
              href="https://www.youtube.com/@ALCHY_CHANNAL"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg hero__cta-primary"
              id="hero-youtube-btn"
            >
              <CirclePlay size={20} />
              Смотреть на YouTube
              <ChevronRight size={16} />
            </a>
            <a
              href="https://boosty.to"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-lg"
              id="hero-boosty-btn"
            >
              <Heart size={18} />
              Поддержать
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="hero__stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="hero__stat">
              <Users size={16} className="hero__stat-icon" />
              <span className="hero__stat-value">{formatCount(channelData.subscriberCount)}</span>
              <span className="hero__stat-label">подписчиков</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <BookOpen size={16} className="hero__stat-icon" />
              <span className="hero__stat-value">{channelData.videoCount}</span>
              <span className="hero__stat-label">видео</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <Zap size={16} className="hero__stat-icon" />
              <span className="hero__stat-value">{formatCount(channelData.viewCount)}</span>
              <span className="hero__stat-label">просмотров</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
