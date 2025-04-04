// src/components/PortfolioList.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function PortfolioList({ refresh }) {
    const [portfolios, setPortfolios] = useState([]);
    const navigate = useNavigate();

    const fetchPortfolios = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "portfolios"));
            const portfoliosList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPortfolios(portfoliosList);
        } catch (e) {
            console.error("Error fetching portfolios: ", e);
        }
    };

    useEffect(() => {
        fetchPortfolios();
    }, [refresh]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this portfolio?")) {
            try {
                await deleteDoc(doc(db, "portfolios", id));
                // Refresh the list after deletion
                fetchPortfolios();
            } catch (e) {
                console.error("Error deleting portfolio: ", e);
            }
        }
    };

    const handleEdit = (id) => {
        // Navigate to the detailed PortfolioPage for editing
        navigate(`/portfolio/${id}`);
    };

    return (
        <div className="portfolio-list">
            {portfolios.map(portfolio => (
                <div key={portfolio.id} className="portfolio-item">
                    <div className="portfolio-card-created">
                        <span className="document-icon">📄</span>
                    </div>
                    <p className="portfolio-title">{portfolio.title}</p>
                    <div className="portfolio-actions">
                        <button onClick={() => handleEdit(portfolio.id)}>Edit</button>
                        <button onClick={() => handleDelete(portfolio.id)}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PortfolioList;
