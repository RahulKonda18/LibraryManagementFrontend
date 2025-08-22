import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/" className="nav-brand-link">
            <h1>📚 Library Management</h1>
          </Link>
        </div>
        
        {isAuthenticated ? (
          <div className="nav-menu">
            <ul className="nav-items">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              
              {isAdmin ? (
                // Admin Navigation
                <>
                  <li className="nav-item">
                    <Link to="/admin/books" className="nav-link">Modify Books</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/admin/subscribers" className="nav-link">Add Subscribers</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/admin/remove-subscribers" className="nav-link">Remove Subscribers</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/admin/fines" className="nav-link">Fine Collections</Link>
                  </li>
                </>
              ) : (
                // Subscriber Navigation
                <>
                  <li className="nav-item">
                    <Link to="/wallet" className="nav-link">Wallet Balance</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/borrow-history" className="nav-link">Borrow History</Link>
                  </li>
                </>
              )}
            </ul>
            
            <div className="user-menu">
              <span className="user-name">
                Welcome, {user?.name || user?.username || 'User'}!
                {!isAdmin && user?.walletBalance !== undefined && (
                  <span className="wallet-balance"> (₹{user.walletBalance})</span>
                )}
              </span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="nav-menu">
            <ul className="nav-items">
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="nav-link signup-link">Sign Up</Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;