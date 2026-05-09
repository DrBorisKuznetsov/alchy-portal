import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  CirclePlay,
  BookOpen,
  Layers,
  User,
  Handshake,
  ExternalLink,
  Zap,
} from 'lucide-react';
import logo from '../../assets/logo.png';
import './Header.css';

const navItems = [
  { path: '/', label: 'Главная', icon: Cpu },
  { path: '/catalog', label: 'Каталог', icon: BookOpen },
  { path: '/series', label: 'Серии', icon: Layers },
  { path: '/tools', label: 'Инструменты', icon: Zap },
  { path: '/about', label: 'О канале', icon: User },
  { path: '/sponsors', label: 'Спонсорам', icon: Handshake },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`header ${isScrolled ? 'header--scrolled' : ''}`}
      id="main-header"
    >
      <div className="header__inner container">
        {/* Logo */}
        <Link to="/" className="header__logo" id="logo-link">
          <div className="header__logo-icon">
            <img src={logo} alt="ALCHY Logo" />
          </div>
          <span className="header__logo-text">ALCHY</span>
          <span className="header__logo-badge">PORTAL</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="header__nav hide-mobile" id="main-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`header__nav-link ${isActive ? 'header__nav-link--active' : ''}`}
                id={`nav-${item.path.replace('/', '') || 'home'}`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    className="header__nav-indicator"
                    layoutId="nav-indicator"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* YouTube Button */}
        <a
          href="https://www.youtube.com/@ALCHY_CHANNEL"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm header__yt-btn hide-mobile"
          id="header-youtube-btn"
        >
          <CirclePlay size={16} />
          YouTube
          <ExternalLink size={12} />
        </a>

        {/* Mobile Menu Toggle */}
        <button
          className="header__mobile-toggle hide-desktop"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          id="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="header__mobile-menu hide-desktop"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            id="mobile-menu"
          >
            <nav className="header__mobile-nav">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`header__mobile-link ${isActive ? 'header__mobile-link--active' : ''}`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <a
                href="https://www.youtube.com/@ALCHY_CHANNEL"
                target="_blank"
                rel="noopener noreferrer"
                className="header__mobile-link header__mobile-link--yt"
              >
                <CirclePlay size={20} />
                <span>YouTube</span>
                <ExternalLink size={14} />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
