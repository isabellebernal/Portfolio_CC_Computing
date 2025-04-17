// src/App.js
import React from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider
import Header from './components/Header'; // We'll create this next
=======
import { Routes, Route, Navigate } from 'react-router-dom';
>>>>>>> 7c07938e89741543b03d3ecd0504f7b3e92ee0f0
import Dashboard from './pages/Dashboard';
import PortfolioPage from './pages/PortfolioPage';

function App() {
<<<<<<< HEAD
  return (
    <ThemeProvider>
      <Router>
        <Header /> {/* Add the header with the theme toggle button */}
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portfolio/:id" element={<PortfolioPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
=======
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
	    <Route path="/portfolio/:id" element={<PortfolioPage />} />
        </Routes>
    );
>>>>>>> 7c07938e89741543b03d3ecd0504f7b3e92ee0f0
}

export default App;