import React, { useState, useEffect, useCallback } from 'react';
import BookList from '../BookList';
import FilterBar from '../FilterBar';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';

const Home = () => {
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(9);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const { user } = useAuth();

  const fetchGenres = useCallback(async () => {
    try {
      const data = await apiService.getGenres();
      setGenres(data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  }, []);

  const fetchBooks = useCallback(async (pageParam = 0, sizeParam = 9, genreParam = 'all') => {
    try {
      const isAll = !genreParam || genreParam === 'all';
      let data;
      
      if (isAll) {
        data = await apiService.getBooks(pageParam, sizeParam);
      } else {
        data = await apiService.getBooksByGenre(genreParam, pageParam, sizeParam);
      }
      
      const booksPage = Array.isArray(data.content) ? data : { content: [], totalPages: 0, totalElements: 0 };
      setFilteredBooks(booksPage.content);
      setTotalPages(booksPage.totalPages || 0);
      setTotalElements(booksPage.totalElements || 0);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      // Fallback data for demo purposes
      const demo = [
        { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'fiction', year: 1925, cover: 'https://via.placeholder.com/150x200?text=The+Great+Gatsby' },
        { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'fiction', year: 1960, cover: 'https://via.placeholder.com/150x200?text=To+Kill+a+Mockingbird' },
        { id: 3, title: '1984', author: 'George Orwell', genre: 'sci-fi', year: 1949, cover: 'https://via.placeholder.com/150x200?text=1984' },
        { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'romance', year: 1813, cover: 'https://via.placeholder.com/150x200?text=Pride+and+Prejudice' },
        { id: 5, title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'fiction', year: 1937, cover: 'https://via.placeholder.com/150x200?text=The+Hobbit' },
        { id: 6, title: 'Sherlock Holmes', author: 'Arthur Conan Doyle', genre: 'mystery', year: 1887, cover: 'https://via.placeholder.com/150x200?text=Sherlock+Holmes' }
      ];
      setFilteredBooks(demo);
      setTotalPages(1);
      setTotalElements(6);
      setLoading(false);
    }
  }, []);

  // Fetch paginated books whenever page/size/genre changes
  useEffect(() => {
    fetchBooks(page, size, selectedGenre);
  }, [page, size, selectedGenre, fetchBooks]);

  // Fetch genres once
  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const goToPrevPage = () => setPage(prev => Math.max(prev - 1, 0));
  const goToNextPage = () => setPage(prev => Math.min(prev + 1, Math.max(totalPages - 1, 0)));

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre || 'all');
    setPage(0);
  };

  const handleBorrow = async (book) => {
    try {
      await apiService.borrowBookWithUser(user.id, book.id);
      fetchBooks(page, size, selectedGenre);
    } catch (error) {
      console.error('Borrow failed', error);
    }
  };

  const handleReturn = async (book) => {
    try {
      await apiService.returnBookWithUser(user.id, book.id);
      fetchBooks(page, size, selectedGenre);
    } catch (error) {
      console.error('Return failed', error);
    }
  };

  return (
    <main className="main-content">
      <FilterBar 
        genres={genres} 
        selectedGenre={selectedGenre} 
        onGenreChange={handleGenreChange} 
      />
      <BookList
        books={filteredBooks}
        loading={loading}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <button onClick={goToPrevPage} disabled={page <= 0} style={{ padding: '0.6rem 1.2rem', borderRadius: 0, border: '0px solid #ccd', background: page <= 0 ? '#eee' : '#333333', color: page <= 0 ? '#888' : '#fff', cursor: page <= 0 ? 'not-allowed' : 'pointer' }}>Prev</button>
        <div style={{ color: '#555', flex: 1, textAlign: 'center' }}>
          Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
          {totalElements > 0 && (
            <span style={{ marginLeft: 12, color: '#777' }}>
              • {Math.min(page * size + 1, totalElements)}-
              {Math.min((page + 1) * size, totalElements)} of {totalElements} items
            </span>
          )}
        </div>
        <button onClick={goToNextPage} disabled={totalPages === 0 || page >= totalPages - 1} style={{ padding: '0.6rem 1.2rem', borderRadius: 0, border: '0px solid #ccd', background: (totalPages === 0 || page >= totalPages - 1) ? '#eee' : '#333333', color: (totalPages === 0 || page >= totalPages - 1) ? '#888' : '#fff', cursor: (totalPages === 0 || page >= totalPages - 1) ? 'not-allowed' : 'pointer' }}>Next</button>
      </div>
    </main>
  );
};

export default Home;
