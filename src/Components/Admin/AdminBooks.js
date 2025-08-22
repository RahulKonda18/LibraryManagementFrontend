import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Admin.css';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { getAuthHeaders } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publishedYear: '',
    genre: '',
    copies: ''
  });

  const fetchBooks = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/api/books?size=100', {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setBooks(data.content || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/books', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...formData,
          publishedYear: parseInt(formData.publishedYear),
          copies: parseInt(formData.copies)
        })
      });

      if (response.ok) {
        setFormData({ title: '', author: '', publishedYear: '', genre: '', copies: '' });
        setShowAddForm(false);
        fetchBooks();
      } else {
        console.error('Failed to add book');
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/books/${editingBook.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...formData,
          publishedYear: parseInt(formData.publishedYear),
          copies: parseInt(formData.copies)
        })
      });

      if (response.ok) {
        setEditingBook(null);
        setFormData({ title: '', author: '', publishedYear: '', genre: '', copies: '' });
        fetchBooks();
      } else {
        console.error('Failed to update book');
      }
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/books/${bookId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        if (response.ok) {
          fetchBooks();
        } else {
          console.error('Failed to delete book');
        }
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const startEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      publishedYear: book.publishedYear.toString(),
      genre: book.genre,
      copies: book.copies.toString()
    });
  };

  const cancelEdit = () => {
    setEditingBook(null);
    setFormData({ title: '', author: '', publishedYear: '', genre: '', copies: '' });
  };

  if (loading) {
    return <div className="admin-loading">Loading books...</div>;
  }

  return (
    <div className="admin-container">
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
            {books.map(book => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publishedYear}</td>
                <td>{book.genre}</td>
                <td>{book.copies}</td>
                <td>
                  <button 
                    className="admin-button small"
                    onClick={() => startEdit(book)}
                  >
                    Edit
                  </button>
                  <button 
                    className="admin-button small danger"
                    onClick={() => handleDeleteBook(book.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
    </div>
  );
};

export default AdminBooks;
