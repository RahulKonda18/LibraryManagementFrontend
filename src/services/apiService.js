import authService from './authService';

class ApiService {
  // Book endpoints
  async getBooks(page = 0, size = 9) {
    return authService.apiRequest(`/api/books?page=${page}&size=${size}`);
  }

  async getBooksByGenre(genre, page = 0, size = 9) {
    return authService.apiRequest(`/api/books/genre?genre=${genre}&page=${page}&size=${size}`);
  }

  async getBook(id) {
    return authService.apiRequest(`/api/books/${id}`);
  }

  async getGenres() {
    return authService.apiRequest('/api/books/genres');
  }

  async addBook(bookData) {
    return authService.apiRequest('/api/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  }

  async updateBook(id, bookData) {
    return authService.apiRequest(`/api/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
  }

  async deleteBook(id) {
    return authService.apiRequest(`/api/books/${id}`, {
      method: 'DELETE',
    });
  }

  async updateBookCopies(id, copies) {
    return authService.apiRequest(`/api/books/${id}/copies`, {
      method: 'PUT',
      body: JSON.stringify({ copies }),
    });
  }

  async borrowBook(bookId) {
    return authService.apiRequest(`/api/books/${bookId}/borrow`, {
      method: 'POST',
    });
  }

  async returnBook(bookId) {
    return authService.apiRequest(`/api/books/${bookId}/return`, {
      method: 'POST',
    });
  }

  // User endpoints
  async getAllUsers() {
    return authService.apiRequest('/api/users');
  }

  async getUsersByRole(role) {
    return authService.apiRequest(`/api/users/role/${role}`);
  }

  async getUser(id) {
    return authService.apiRequest(`/api/users/${id}`);
  }

  async updateUser(id, userData) {
    return authService.apiRequest(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return authService.apiRequest(`/api/users/${id}`, {
      method: 'DELETE',
    });
  }

  async register(userData) {
    return authService.apiRequest('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getWalletBalance(userId) {
    const response = await authService.apiRequest(`/api/users/${userId}/wallet`);
    // Convert to number if it's a string
    return typeof response === 'string' ? parseFloat(response) : response;
  }

  async getTotalFinesPaid(userId) {
    const response = await authService.apiRequest(`/api/users/${userId}/fines`);
    // Convert to number if it's a string
    return typeof response === 'string' ? parseFloat(response) : response;
  }

  async addToWallet(userId, amount) {
    return authService.apiRequest(`/api/users/${userId}/wallet/add`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  // Borrow endpoints
  async borrowBookWithUser(userId, bookId) {
    return authService.apiRequest(`/api/borrows/${userId}/books/${bookId}/borrow`, {
      method: 'POST',
    });
  }

  async returnBookWithUser(userId, bookId) {
    return authService.apiRequest(`/api/borrows/${userId}/books/${bookId}/return`, {
      method: 'POST',
    });
  }

  async payFine(userId, borrowRecordId) {
    return authService.apiRequest(`/api/borrows/${userId}/fines/${borrowRecordId}/pay`, {
      method: 'POST',
    });
  }

  async getBorrowHistory(userId) {
    return authService.apiRequest(`/api/borrows/${userId}/history`);
  }

  async getActiveBorrows(userId) {
    return authService.apiRequest(`/api/borrows/${userId}/active`);
  }

  async getUnpaidFines(userId) {
    return authService.apiRequest(`/api/borrows/${userId}/unpaid-fines`);
  }

  async getAllActiveBorrows() {
    return authService.apiRequest('/api/borrows/active');
  }

  async getAllUnpaidFines() {
    return authService.apiRequest('/api/borrows/unpaid-fines');
  }

  async getTotalFinesCollected() {
    const response = await authService.apiRequest('/api/borrows/total-fines');
    // Convert to number if it's a string
    return typeof response === 'string' ? parseFloat(response) : response;
  }

  // Admin endpoints
  async getAdminTotalFines() {
    const response = await authService.apiRequest('/api/admin/total-fines');
    // Convert to number if it's a string
    return typeof response === 'string' ? parseFloat(response) : response;
  }

  async getAdminActiveBorrows() {
    return authService.apiRequest('/api/admin/active-borrows');
  }

  async getAdminUnpaidFines() {
    return authService.apiRequest('/api/admin/unpaid-fines');
  }

  async getAdminSubscribers() {
    return authService.apiRequest('/api/admin/subscribers');
  }

  async getAdminAdmins() {
    return authService.apiRequest('/api/admin/admins');
  }

  async getAdminUsers() {
    return authService.apiRequest('/api/admin/users');
  }
}

const apiService = new ApiService();
export default apiService;
