import { useState, useCallback } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import type { SortOption } from '../../types';
import './SearchBar.css';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
  totalCount: number;
  categories: string[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Новые' },
  { value: 'oldest', label: 'Старые' },
  { value: 'popular', label: 'Популярные' },
  { value: 'mostLiked', label: 'Рейтинг' },
];

export default function SearchBar({
  query,
  onQueryChange,
  sortOption,
  onSortChange,
  resultCount,
  totalCount,
  categories,
  activeCategory,
  onCategoryChange,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = useCallback(() => {
    onQueryChange('');
  }, [onQueryChange]);

  return (
    <div className="search-bar" id="search-bar">
      {/* Search Input */}
      <div className={`search-bar__input-wrapper ${isFocused ? 'search-bar__input-wrapper--focused' : ''}`}>
        <Search size={18} className="search-bar__icon" />
        <input
          type="text"
          className="search-bar__input"
          placeholder="Поиск по названию, описанию, тегам..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          id="search-input"
        />
        {query && (
          <button
            className="search-bar__clear"
            onClick={handleClear}
            aria-label="Очистить поиск"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Controls Row */}
      <div className="search-bar__controls">
        {/* Categories */}
        <div className="search-bar__categories">
          <button
            className={`tag ${activeCategory === '' ? 'active' : ''}`}
            onClick={() => onCategoryChange('')}
          >
            Все
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tag ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort & Count */}
        <div className="search-bar__right">
          <span className="search-bar__count">
            {resultCount} из {totalCount}
          </span>
          <div className="search-bar__sort">
            <SlidersHorizontal size={14} />
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="search-bar__select"
              id="sort-select"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
