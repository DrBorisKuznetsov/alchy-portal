import { Link } from 'react-router-dom';
import {
  CirclePlay,
  Code2,
  Mail,
  Heart,
  ExternalLink,
} from 'lucide-react';
import logo from '../../assets/logo.png';
import './Footer.css';

const footerLinks = {
  portal: [
    { label: 'Каталог видео', path: '/catalog' },
    { label: 'Серии', path: '/series' },
    { label: 'О канале', path: '/about' },
    { label: 'Спонсорам', path: '/sponsors' },
  ],
  resources: [
    { label: 'YouTube', href: 'https://www.youtube.com/@ALCHY_CHANNEL', icon: CirclePlay },
    { label: 'GitHub', href: 'https://github.com/alchy-hub/alchy-hub.github.io', icon: Code2 },
    { label: 'Boosty', href: 'https://boosty.to', icon: Heart },
  ],
  topics: [
    'STM32', 'ESP32', 'PCB Design',
    'Аналоговая электроника', 'Силовая электроника',
    'EMC/EMI', 'IoT',
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="main-footer">
      <div className="container">
        {/* Top Section */}
        <div className="footer__top">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <div className="footer__logo-icon">
                <img src={logo} alt="ALCHY Logo" />
              </div>
              <span className="footer__logo-text">ALCHY</span>
              <span className="footer__logo-badge">PORTAL</span>
            </Link>
            <p className="footer__description">
              Making the complex simple: электроника, микроконтроллеры, автоматизация.
              Образовательный портал для инженеров.
            </p>
            <div className="footer__socials">
              <a
                href="https://www.youtube.com/@ALCHY_CHANNEL"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="YouTube"
              >
                <CirclePlay size={18} />
              </a>
              <a
                href="https://github.com/alchy-hub/alchy-hub.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="GitHub"
              >
                <Code2 size={18} />
              </a>
              <a
                href="mailto:contact@alchy.dev"
                className="footer__social-link"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="footer__links-group">
            <h4 className="footer__links-title">Портал</h4>
            <ul className="footer__links">
              {footerLinks.portal.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__links-group">
            <h4 className="footer__links-title">Ресурсы</h4>
            <ul className="footer__links">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer__link"
                  >
                    <link.icon size={14} />
                    {link.label}
                    <ExternalLink size={10} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__links-group">
            <h4 className="footer__links-title">Темы</h4>
            <div className="footer__tags">
              {footerLinks.topics.map((topic) => (
                <span key={topic} className="tag">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Bottom Section */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} ALCHY Portal. Все права защищены.
          </p>
          <p className="footer__built-with">
            Сделано с <Heart size={12} className="footer__heart" /> для инженерного сообщества
          </p>
        </div>
      </div>
    </footer>
  );
}
