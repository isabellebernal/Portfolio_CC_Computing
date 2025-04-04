// src/components/CreatePortfolioCard.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function CreatePortfolioCard({ onPortfolioCreated }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [portfolioTitle, setPortfolioTitle] = useState('');

    const handleCreatePortfolio = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPortfolioTitle('');
    };

    const handleCreatePortfolioSubmit = async () => {
        if (portfolioTitle.trim()) {
            try {
                const docRef = await addDoc(collection(db, "portfolios"), {
                    title: portfolioTitle,
                    createdAt: new Date(),
                });
                console.log("Portfolio created with ID: ", docRef.id);
                setIsModalOpen(false);
                setPortfolioTitle('');
                onPortfolioCreated(); // Notify parent to refresh the list
            } catch (e) {
                console.error("Error creating portfolio: ", e);
            }
        }
    };

    return (
        <>
            <div className="portfolio-card" onClick={handleCreatePortfolio}>
                <span className="plus-icon">+</span>
                <p>Create Portfolio</p>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Create New Portfolio</h2>
                        <p>Add a title for your new portfolio</p>
                        <input
                            type="text"
                            value={portfolioTitle}
                            onChange={(e) => setPortfolioTitle(e.target.value)}
                            placeholder="e.g., Jonathan's Portfolio"
                            className="modal-input"
                        />
                        <div className="modal-actions">
                            <button onClick={handleCloseModal} className="modal-cancel">
                                Cancel
                            </button>
                            <button onClick={handleCreatePortfolioSubmit} className="modal-create">
                                Create
                            </button>
                        </div>
                        <button className="modal-close" onClick={handleCloseModal}>
                            ×
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default CreatePortfolioCard;