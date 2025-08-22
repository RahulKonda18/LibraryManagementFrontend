import React, { createContext, useContext, useState, useEffect } from 'react';
// Removed jwtDecode import since we're using session tokens

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        // For session tokens, we'll just validate they exist
        // In a real app, you'd want to validate with the server
        const sessionData = JSON.parse(atob(token));
        const currentTime = Date.now();
        
        // Check if token is older than 24 hours
        if (currentTime - sessionData.timestamp > 24 * 60 * 60 * 1000) {
          // Token has expired
          logout();
        } else {
          // Set user data from session - use the full sessionData which contains all user info
          setUser({
            id: sessionData.id,
            username: sessionData.username,
            name: sessionData.name,
            email: sessionData.email,
            role: sessionData.role,
            walletBalance: sessionData.walletBalance
          });
        }
      } catch (error) {
        console.error('Error decoding session token:', error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const userData = await response.json();
      
      // Since the API doesn't return a JWT token, we'll create a simple session token
      const sessionToken = btoa(JSON.stringify({ 
        id: userData.id, 
        username: userData.username, 
        name: userData.name,
        email: userData.email,
        role: userData.role,
        walletBalance: userData.walletBalance,
        timestamp: Date.now() 
      }));
      
      localStorage.setItem('token', sessionToken);
      setToken(sessionToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (name, username, email, password) => {
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
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
        throw new Error(errorData.message || 'Signup failed');
      }

      const userData = await response.json();
      
      // Since the API doesn't return a JWT token, we'll create a simple session token
      const sessionToken = btoa(JSON.stringify({ 
        id: userData.id, 
        username: userData.username, 
        name: userData.name,
        email: userData.email,
        role: userData.role,
        walletBalance: userData.walletBalance,
        timestamp: Date.now() 
      }));
      
      localStorage.setItem('token', sessionToken);
      setToken(sessionToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
    };
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    getAuthHeaders,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
