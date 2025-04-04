// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PortfolioPage from './pages/PortfolioPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
	    <Route path="/portfolio/:id" element={<PortfolioPage />} />
        </Routes>
    );
}

export default App;