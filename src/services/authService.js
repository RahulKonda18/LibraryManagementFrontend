import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8080';
const TOKEN_COOKIE_NAME = 'jwt_token';
const USER_COOKIE_NAME = 'user_data';

class AuthService {
  // Get JWT token from cookie
  getToken() {
    return Cookies.get(TOKEN_COOKIE_NAME);
  }

  // Get user data from cookie
  getUser() {
    const userData = Cookies.get(USER_COOKIE_NAME);
    return userData ? JSON.parse(userData) : null;
  }

  // Set JWT token in cookie (expires in 24 hours)
  setToken(token) {
    Cookies.set(TOKEN_COOKIE_NAME, token, { expires: 1 }); // 1 day
  }

  // Set user data in cookie
  setUser(user) {
    Cookies.set(USER_COOKIE_NAME, JSON.stringify(user), { expires: 1 });
  }

  // Remove all auth cookies
  clearAuth() {
    Cookies.remove(TOKEN_COOKIE_NAME);
    Cookies.remove(USER_COOKIE_NAME);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Check if user is admin
  isAdmin() {
    const user = this.getUser();
    return user?.role === 'ADMIN';
  }

  // Check if user is subscriber
  isSubscriber() {
    const user = this.getUser();
    return user?.role === 'SUBSCRIBER';
  }

  // Login user
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store token and user data in cookies
      this.setToken(data.token);
      this.setUser(data.user);
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  // Register user
  async register(name, username, email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          username, 
          email, 
          password,
          role: 'SUBSCRIBER'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const userData = await response.json();
      
      // For registration, we don't automatically log in the user
      // They need to login separately
      return { success: true, user: userData };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  }

  // Logout user
  logout() {
    this.clearAuth();
  }

  // Get auth headers for API requests
  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  // Make authenticated API request
  async apiRequest(endpoint, options = {}) {
    const headers = this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      this.logout();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // Handle different response types
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      // For non-JSON responses (like plain text numbers), return the text
      return response.text();
    }
  }
}

const authService = new AuthService();
export default authService;
