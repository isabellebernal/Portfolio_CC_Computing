// src/components/Header.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import './Header.css';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="site-header">
      <div className="header-content">
        <Link to="/dashboard" className="header-logo">
          Portfolio App
        </Link>
        <button onClick={toggleTheme} className="theme-toggle-button">
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>
    </header>
  );
};

export default Header;