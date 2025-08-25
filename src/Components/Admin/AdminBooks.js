import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../services/apiService';
import './Admin.css';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(100);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [activeBorrowedBookIds, setActiveBorrowedBookIds] = useState(new Set());
  const [unpaidFineBookIds, setUnpaidFineBookIds] = useState(new Set());

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publishedYear: '',
    genre: '',
    copies: ''
  });

  const fetchBooks = useCallback(async (pageParam = 0, sizeParam = 100) => {
    try {
      const data = await apiService.getBooks(pageParam, sizeParam);
      setBooks(Array.isArray(data?.content) ? data.content : []);
      setTotalPages(data?.totalPages || 0);
      setTotalElements(data?.totalElements || 0);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks(page, size);
  }, [fetchBooks, page, size]);

  // Fetch active borrows to determine which books cannot be deleted
  useEffect(() => {
    const fetchActiveBorrows = async () => {
      try {
        const records = await apiService.getAllActiveBorrows();
        const ids = new Set(
          Array.isArray(records)
            ? records.map(r => r?.book?.id).filter(id => typeof id === 'number')
            : []
        );
        setActiveBorrowedBookIds(ids);
      } catch (error) {
        console.error('Error fetching active borrows:', error);
        setActiveBorrowedBookIds(new Set());
      }
    };
    fetchActiveBorrows();
  }, []);

  // Fetch unpaid fines to further restrict deletions
  useEffect(() => {
    const fetchUnpaidFines = async () => {
      try {
        const records = await apiService.getAllUnpaidFines();
        const ids = new Set(
          Array.isArray(records)
            ? records.map(r => r?.book?.id).filter(id => typeof id === 'number')
            : []
        );
        setUnpaidFineBookIds(ids);
      } catch (error) {
        console.error('Error fetching unpaid fines:', error);
        setUnpaidFineBookIds(new Set());
      }
    };
    fetchUnpaidFines();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await apiService.addBook({
        ...formData,
        publishedYear: parseInt(formData.publishedYear),
        copies: parseInt(formData.copies)
      });
      
      setFormData({ title: '', author: '', publishedYear: '', genre: '', copies: '' });
      setShowAddForm(false);
      fetchBooks(page, size);
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      await apiService.updateBook(editingBook.id, {
        ...formData,
        publishedYear: parseInt(formData.publishedYear),
        copies: parseInt(formData.copies)
      });
      
      setEditingBook(null);
      setFormData({ title: '', author: '', publishedYear: '', genre: '', copies: '' });
      fetchBooks(page, size);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await apiService.deleteBook(bookId);
        fetchBooks(page, size);
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const startEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title ?? '',
      author: book.author ?? '',
      publishedYear: book?.publishedYear !== undefined && book?.publishedYear !== null ? String(book.publishedYear) : '',
      genre: book.genre ?? '',
      copies: book?.copies !== undefined && book?.copies !== null ? String(book.copies) : ''
    });
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (_) {}
  };

  const cancelEdit = () => {
    setEditingBook(null);
    setFormData({ title: '', author: '', publishedYear: '', genre: '', copies: '' });
  };

  if (loading) {
    return <div className="admin-loading">Loading books...</div>;
  }

  const computeDeletionLock = (book) => {
    const isActiveBorrowed = activeBorrowedBookIds.has(book.id);
    const hasUnpaidFines = unpaidFineBookIds.has(book.id);
    return { hasAnyBorrowRecords: isActiveBorrowed || hasUnpaidFines };
  };

  const goToPrevPage = () => setPage(prev => Math.max(prev - 1, 0));
  const goToNextPage = () => setPage(prev => Math.min(prev + 1, Math.max(totalPages - 1, 0)));

  return (
    <div className="admin-container">
      {editingBook && (
        <div className="admin-form-container">
          <h3>Edit Book</h3>
          <form onSubmit={handleUpdateBook} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Published Year</label>
                <input
                  type="number"
                  name="publishedYear"
                  value={formData.publishedYear}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Genre</label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Copies</label>
                <input
                  type="number"
                  name="copies"
                  value={formData.copies}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="admin-button primary">Update Book</button>
              <button 
                type="button" 
                className="admin-button secondary"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-header">
        <h2>Manage Books</h2>
        <button 
          className="admin-button primary"
          onClick={() => setShowAddForm(true)}
        >
          Add New Book
        </button>
      </div>

      {showAddForm && (
        <div className="admin-form-container">
          <h3>Add New Book</h3>
          <form onSubmit={handleAddBook} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Published Year</label>
                <input
                  type="number"
                  name="publishedYear"
                  value={formData.publishedYear}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Genre</label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Copies</label>
                <input
                  type="number"
                  name="copies"
                  value={formData.copies}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="admin-button primary">Add Book</button>
              <button 
                type="button" 
                className="admin-button secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="books-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Year</th>
              <th>Genre</th>
              <th>Copies</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => {
              const { hasAnyBorrowRecords } = computeDeletionLock(book);
              return (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publishedYear}</td>
                <td>{book.genre}</td>
                <td>{book.copies}</td>
                <td>
                  <div className="admin-actions">
                    <button 
                      className="admin-button small"
                      onClick={() => startEdit(book)}
                    >
                      Edit
                    </button>
                    <button 
                      className="admin-button small danger"
                      onClick={() => handleDeleteBook(book.id)}
                      disabled={hasAnyBorrowRecords}
                      title={hasAnyBorrowRecords ? 'Cannot delete: active borrow or unpaid fines' : 'Delete book'}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', paddingTop: '0.5rem' }}>
        <button 
          onClick={goToPrevPage} 
          disabled={page <= 0}
          className="admin-button secondary"
        >
          Prev
        </button>
        <div style={{ color: '#555', flex: 1, textAlign: 'center' }}>
          Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
          {totalElements > 0 && (
            <span style={{ marginLeft: 12, color: '#777' }}>
              • {Math.min(page * size + 1, totalElements)}-
              {Math.min((page + 1) * size, totalElements)} of {totalElements} items
            </span>
          )}
        </div>
        <button 
          onClick={goToNextPage} 
          disabled={totalPages === 0 || page >= totalPages - 1}
          className="admin-button secondary"
        >
          Next
        </button>
      </div>

      {/* Edit form has been moved to the top */}
    </div>
  );
};

export default AdminBooks;
