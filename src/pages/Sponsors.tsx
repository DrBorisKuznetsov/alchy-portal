import { motion } from 'framer-motion';
import {
  Users, Eye, Globe, BarChart3,
  Mail, MessageSquare, ArrowRight,
  Check, Star, Zap, Crown,
} from 'lucide-react';
import channelData from '../data/channel.json';
import { formatCount } from '../utils/format';
import './Sponsors.css';

const audienceStats = [
  { icon: Users, value: formatCount(channelData.subscriberCount), label: 'Подписчиков' },
  { icon: Eye, value: formatCount(channelData.viewCount), label: 'Просмотров' },
  { icon: Globe, value: 'RU/EN', label: 'Аудитория' },
  { icon: BarChart3, value: '85%', label: '25-44 лет' },
];

const tiers = [
  {
    name: 'Упоминание',
    icon: Star,
    price: 'Базовый',
    features: [
      'Упоминание в видео',
      'Логотип в описании',
      'Ссылка на ваш продукт',
    ],
    color: 'cyan',
  },
  {
    name: 'Интеграция',
    icon: Zap,
    price: 'Стандарт',
    features: [
      'Всё из "Упоминания"',
      'Демонстрация продукта в видео',
      'Отдельный сегмент 2-3 мин',
      'Пост в Telegram',
    ],
    highlighted: true,
    color: 'violet',
  },
  {
    name: 'Посвящённое видео',
    icon: Crown,
    price: 'Премиум',
    features: [
      'Всё из "Интеграции"',
      'Полное видео о вашем продукте',
      'Обзор / тестирование',
      'Размещение на портале',
      'Публикация на GitHub',
    ],
    color: 'amber',
  },
];

const audienceProfile = [
  'R&D инженеры и проектировщики электроники',
  'Embedded-разработчики (STM32, ESP32)',
  'Специалисты по автоматизации (SCADA/DCS)',
  'Студенты технических вузов',
  'Продвинутые DIY-энтузиасты',
];

export default function Sponsors() {
  return (
    <div className="sponsors-page">
      <div className="container">
        {/* Header */}
        <motion.div
          className="sponsors-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="section-title">Сотрудничество и спонсорство</h1>
          <p className="section-subtitle">
            Расскажите о вашем продукте целевой аудитории инженеров и разработчиков
          </p>
        </motion.div>

        {/* Audience Stats */}
        <div className="sponsors-stats">
          {audienceStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="sponsors-stat glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <stat.icon size={24} className="sponsors-stat__icon" />
              <span className="sponsors-stat__value">{stat.value}</span>
              <span className="sponsors-stat__label">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Audience Profile */}
        <motion.section
          className="sponsors-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="sponsors-section__title">Кто смотрит канал</h2>
          <div className="sponsors-audience glass-card">
            <ul className="sponsors-audience__list">
              {audienceProfile.map((item) => (
                <li key={item}>
                  <Check size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="sponsors-audience__note">
              Это высокоплатёжная аудитория профессионалов, которая принимает решения
              о закупке инструментов, компонентов и оборудования.
            </p>
          </div>
        </motion.section>

        {/* Tiers */}
        <motion.section
          className="sponsors-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="sponsors-section__title">Форматы сотрудничества</h2>
          <div className="sponsors-tiers">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                className={`sponsors-tier glass-card ${tier.highlighted ? 'sponsors-tier--highlighted' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                {tier.highlighted && (
                  <span className="sponsors-tier__badge badge badge-violet">Популярный</span>
                )}
                <div className={`sponsors-tier__icon sponsors-tier__icon--${tier.color}`}>
                  <tier.icon size={24} />
                </div>
                <h3>{tier.name}</h3>
                <span className="sponsors-tier__price">{tier.price}</span>
                <ul className="sponsors-tier__features">
                  {tier.features.map((f) => (
                    <li key={f}>
                      <Check size={14} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`mailto:${channelData.email}`}
                  className={`btn ${tier.highlighted ? 'btn-primary' : 'btn-secondary'} sponsors-tier__btn`}
                >
                  Обсудить
                  <ArrowRight size={16} />
                </a>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact CTA */}
        <motion.section
          className="sponsors-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="sponsors-cta glass-card">
            <MessageSquare size={32} className="sponsors-cta__icon" />
            <h2>Готовы обсудить?</h2>
            <p>
              Напишите нам, и мы подберём оптимальный формат интеграции
              для вашего продукта и бюджета.
            </p>
            <a href={`mailto:${channelData.email}`} className="btn btn-primary btn-lg">
              <Mail size={18} />
              Связаться
              <ArrowRight size={16} />
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
