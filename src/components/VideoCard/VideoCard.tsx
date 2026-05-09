import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Eye, ThumbsUp, Clock, ExternalLink } from 'lucide-react';
import type { Video } from '../../types';
import { formatCount, formatDuration, formatDate, truncateText, getVideoUrl } from '../../utils/format';
import './VideoCard.css';

interface VideoCardProps {
  video: Video;
  index?: number;
  featured?: boolean;
}

export default function VideoCard({ video, index = 0, featured = false }: VideoCardProps) {
  const videoUrl = getVideoUrl(video.id);
  const thumbnailUrl = video.thumbnails.high || video.thumbnails.medium;

  return (
    <motion.article
      className={`video-card ${featured ? 'video-card--featured' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      id={`video-card-${video.id}`}
    >
      {/* Thumbnail */}
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="video-card__thumbnail-wrapper"
      >
        <div className="video-card__thumbnail">
          {thumbnailUrl && !thumbnailUrl.includes('placeholder') ? (
            <img
              src={thumbnailUrl}
              alt={video.title}
              className="video-card__img"
              loading="lazy"
            />
          ) : (
            <div className="video-card__img-placeholder">
              <Play size={32} />
            </div>
          )}
          <div className="video-card__overlay">
            <div className="video-card__play-btn">
              <Play size={24} fill="white" />
            </div>
          </div>
          <span className="video-card__duration">
            <Clock size={12} />
            {formatDuration(video.duration)}
          </span>
        </div>
      </a>

      {/* Content */}
      <div className="video-card__content">
        {/* Playlist badge */}
        {video.playlistTitle && (
          <span className="badge badge-cyan video-card__series">
            {video.playlistTitle}
          </span>
        )}

        {/* Title */}
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="video-card__title"
        >
          <h3>{featured ? video.title : truncateText(video.title, 70)}</h3>
          <ExternalLink size={14} className="video-card__external" />
        </a>

        {/* Description */}
        {featured && (
          <p className="video-card__description">
            {truncateText(video.description, 160)}
          </p>
        )}

        {/* Meta */}
        <div className="video-card__meta">
          <span className="video-card__meta-item">
            <Eye size={14} />
            {formatCount(video.viewCount)}
          </span>
          <span className="video-card__meta-item">
            <ThumbsUp size={14} />
            {formatCount(video.likeCount)}
          </span>
          <span className="video-card__meta-date">
            {formatDate(video.publishedAt)}
          </span>
        </div>

        {/* Tags */}
        {video.tags.length > 0 && (
          <div className="video-card__tags">
            {video.tags.slice(0, 3).map((tag) => (
              <Link 
                key={tag} 
                to={`/catalog?tag=${encodeURIComponent(tag)}`}
                className="tag clickable-tag"
                onClick={() => {
                  // Если мы уже в каталоге, плавно скроллим вверх
                  if (window.location.pathname === '/catalog') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
