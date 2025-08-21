import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>📚 Library Management System</h3>
          <p>Your gateway to knowledge and imagination</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#books">Browse Books</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Info</h4>
          <p>📍 123 Library Street</p>
          <p>📧 info@library.com</p>
          <p>📞 (555) 123-4567</p>
        </div>
        
        <div className="footer-section">
          <h4>Hours</h4>
          <p>Mon-Fri: 9AM - 8PM</p>
          <p>Sat-Sun: 10AM - 6PM</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Library Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
