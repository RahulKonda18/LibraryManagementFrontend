import React from 'react';
import './BookList.css';

const BookList = ({ books, loading, onBorrow, onReturn }) => {
  // Ensure books is always an array
  const booksArray = Array.isArray(books) ? books : [];
  
  if (loading) {
    return (
      <div className="book-list-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading books...</p>
        </div>
      </div>
    );
  }

  if (!booksArray || booksArray.length === 0) {
    return (
      <div className="book-list-container">
        <div className="no-books">
          <h3>No books found</h3>
          <p>Try selecting a different genre or check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="book-list-container">
      <div className="book-grid">
        {booksArray.map((book) => {
          const available =
            typeof book.availableCopies === 'number'
              ? book.availableCopies
              : typeof book.copiesAvailable === 'number'
                ? book.copiesAvailable
                : (typeof book.copies === 'number' ? book.copies : 0);
          const displayYear = book.year ?? book.publishedYear ?? '';
          const availabilityClass = available > 10
            ? 'availability-high'
            : available > 5
              ? 'availability-medium'
              : available > 0
                ? 'availability-low'
                : 'availability-none';

          return (
            <div key={book.id} className={`book-card ${availabilityClass}`}>
              <div className="book-cover placeholder">
                <span className="placeholder-text">{book.title}</span>
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <div className="book-meta">
                  <span className="book-genre">{book.genre}</span>
                  <span className="book-year">{displayYear}</span>
                </div>
                <div className="book-availability-row">
                  <span className="book-availability-label">Available:</span>
                  <span className="book-availability-count">{available}</span>
                </div>
                <div className="book-actions">
                  <button
                    className="book-btn borrow"
                    onClick={() => onBorrow && onBorrow(book)}
                    disabled={available <= 0}
                  >
                    Borrow
                  </button>
                  <button
                    className="book-btn return"
                    onClick={() => onReturn && onReturn(book)}
                  >
                    Return
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookList;
