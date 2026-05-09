import { motion } from 'framer-motion';
import {
  Zap, BookOpen, Users, Eye,
  CirclePlay, Code2, Heart, Mail,
  ExternalLink, Award, Target, Lightbulb, Home,
} from 'lucide-react';
import channelData from '../data/channel.json';
import { formatCount } from '../utils/format';
import './About.css';

const skills = [
  { category: 'Микроконтроллеры', items: ['STM32', 'ESP32', 'Arduino', 'RISC-V'] },
  { category: 'Электроника', items: ['Аналоговое проектирование', 'Силовая электроника', 'EMC/EMI', 'АЦП/ЦАП'] },
  { category: 'PCB Design', items: ['KiCad', 'Altium Designer', 'DRC/DFM', 'High-speed routing'] },
  { category: 'Программирование', items: ['C/C++', 'Python', 'MATLAB', 'VHDL'] },
  { category: 'Инструменты', items: ['LTspice', 'Oscilloscope', 'Logic Analyzer', 'Spectrum Analyzer'] },
  { category: 'IoT & Автоматизация', items: ['MQTT', 'Home Assistant', 'SCADA', 'Modbus'] },
];

const stats = [
  { icon: Users, value: formatCount(channelData.subscriberCount), label: 'Подписчиков', color: 'cyan' },
  { icon: BookOpen, value: String(channelData.videoCount), label: 'Видео', color: 'violet' },
  { icon: Eye, value: formatCount(channelData.viewCount), label: 'Просмотров', color: 'emerald' },
  { icon: Award, value: '3+', label: 'Года на YouTube', color: 'amber' },
];

export default function About() {
  return (
    <div className="about-page">
      <div className="container">
        {/* Header */}
        <motion.div
          className="about-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="section-title">О канале ALCHY</h1>
          <p className="section-subtitle">
            Making the complex simple — делаем сложное простым
          </p>
        </motion.div>

        {/* Stats */}
        <div className="about-stats">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className={`about-stat glass-card about-stat--${stat.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <stat.icon size={24} className="about-stat__icon" />
              <span className="about-stat__value">{stat.value}</span>
              <span className="about-stat__label">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Mission */}
        <motion.section
          className="about-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="about-mission glass-card">
            <div className="about-mission__content">
              <div className="about-mission__icon">
                <Target size={28} />
              </div>
              <h2>Миссия канала</h2>
              <p>
                ALCHY — это образовательный YouTube-канал для инженеров, разработчиков
                и продвинутых любителей электроники. Мы разбираем сложные темы на
                понятные составляющие: от теории до практической реализации.
              </p>
              <p>
                Наш канал подойдёт вам, если вы:
              </p>
              <ul className="about-mission__list">
                <li><Home size={16} /> R&D инженер или проектировщик электроники</li>
                <li><Zap size={16} /> Специалист по автоматизации (DCS/SCADA/I&C)</li>
                <li><Lightbulb size={16} /> Embedded-разработчик</li>
                <li><BookOpen size={16} /> Студент, углубляющий знания</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Skills */}
        <motion.section
          className="about-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="about-section__title">Тематика и экспертиза</h2>
          <div className="about-skills-grid">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.category}
                className="about-skill glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <h3>{skill.category}</h3>
                <div className="about-skill__items">
                  {skill.items.map((item) => (
                    <span key={item} className="tag">{item}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Links */}
        <motion.section
          className="about-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="about-section__title">Где нас найти</h2>
          <div className="about-links">
            <a
              href="https://www.youtube.com/@ALCHY_CHANNEL"
              target="_blank"
              rel="noopener noreferrer"
              className="about-link glass-card"
            >
              <CirclePlay size={24} />
              <div>
                <h4>YouTube</h4>
                <p>Основной канал</p>
              </div>
              <ExternalLink size={16} />
            </a>
            <a
              href="https://github.com/alchy-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="about-link glass-card"
            >
              <Code2 size={24} />
              <div>
                <h4>GitHub</h4>
                <p>Исходники проектов</p>
              </div>
              <ExternalLink size={16} />
            </a>
            <a
              href="https://boosty.to"
              target="_blank"
              rel="noopener noreferrer"
              className="about-link glass-card"
            >
              <Heart size={24} />
              <div>
                <h4>Boosty</h4>
                <p>Поддержка канала</p>
              </div>
              <ExternalLink size={16} />
            </a>
            <a
              href="mailto:contact@alchy.dev"
              className="about-link glass-card"
            >
              <Mail size={24} />
              <div>
                <h4>Email</h4>
                <p>Деловые предложения</p>
              </div>
              <ExternalLink size={16} />
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
