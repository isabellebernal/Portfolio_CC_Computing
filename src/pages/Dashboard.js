// src/pages/Dashboard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CreatePortfolioCard from '../components/CreatePortfolioCard';
import PortfolioList from '../components/PortfolioList';
import './Dashboard.css';

function Dashboard() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handlePortfolioCreated = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="logo">Logo</div>
                <Link to="/dashboard" className="dashboard-link">Dashboard</Link>
            </header>
            <main className="dashboard-main">
                <h1>My Portfolio</h1>
                <p>Start Creating a portfolio for your next job role</p>
                <div className="portfolio-container">
                    <CreatePortfolioCard onPortfolioCreated={handlePortfolioCreated} />
                    <PortfolioList refresh={refreshKey} />
                </div>
            </main>
        </div>
    );
}

export default Dashboard;