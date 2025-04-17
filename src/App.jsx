// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider
import Header from './components/Header'; // We'll create this next
import Dashboard from './pages/Dashboard';
import PortfolioPage from './pages/PortfolioPage';

function App() {
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
}

export default App;