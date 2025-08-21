import React from 'react';
import './FilterBar.css';

const FilterBar = ({ genres, selectedGenre, onGenreChange }) => {
  return (
    <div className="filter-bar">
      <div className="filter-container">
        <h3>Filter by Genre:</h3>
        <div className="filter-buttons">
          <button
            key="all"
            className={`filter-btn ${selectedGenre === 'all' ? 'active' : ''}`}
            onClick={() => onGenreChange('all')}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre}
              className={`filter-btn ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => onGenreChange(genre)}
            >
              {genre.charAt(0).toUpperCase() + genre.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
