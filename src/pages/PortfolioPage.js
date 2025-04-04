// src/pages/PortfolioPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as needed

const PortfolioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // States for editable fields
  const [editTitle, setEditTitle] = useState('');
  const [editName, setEditName] = useState('');
  const [editAboutMe, setEditAboutMe] = useState('');
  const [editProfilePic, setEditProfilePic] = useState('');

  // Fetch portfolio data from Firestore
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const portfolioRef = doc(db, 'portfolios', id);
        const portfolioSnap = await getDoc(portfolioRef);
        if (portfolioSnap.exists()) {
          const data = portfolioSnap.data();
          setPortfolio(data);
          // Initialize editing fields with fetched data
          setEditTitle(data.title || '');
          setEditName(data.name || '');
          setEditAboutMe(data.aboutMe || '');
          setEditProfilePic(data.profilePic || '');
        } else {
          console.error('No such portfolio!');
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [id]);

  // Delete portfolio function (trash button)
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this portfolio?')) {
      try {
        await deleteDoc(doc(db, 'portfolios', id));
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting portfolio:', error);
      }
    }
  };

  // Save changes when editing
  const handleSave = async () => {
    try {
      const portfolioRef = doc(db, 'portfolios', id);
      await updateDoc(portfolioRef, {
        title: editTitle,
        name: editName,
        aboutMe: editAboutMe,
        profilePic: editProfilePic,
      });
      // Update local state and exit edit mode
      setPortfolio({ ...portfolio, title: editTitle, name: editName, aboutMe: editAboutMe, profilePic: editProfilePic });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating portfolio:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!portfolio) return <p>Portfolio not found.</p>;

  return (
    <div className="portfolio-page">
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
          />
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Name"
          />
          <input
            type="text"
            value={editProfilePic}
            onChange={(e) => setEditProfilePic(e.target.value)}
            placeholder="Profile Picture URL"
          />
          <textarea
            value={editAboutMe}
            onChange={(e) => setEditAboutMe(e.target.value)}
            placeholder="About Me"
          />
          <div className="edit-actions">
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="portfolio-details">
          <h1>{portfolio.title}</h1>
          {portfolio.profilePic && (
            <img
              src={portfolio.profilePic}
              alt={`${portfolio.name}'s profile`}
              className="portfolio-profile-pic"
            />
          )}
          <h2>{portfolio.name}</h2>
          <p>{portfolio.aboutMe}</p>
          <div className="action-buttons">
            <button onClick={() => setIsEditing(true)} className="edit-button">
              Edit
            </button>
            <button onClick={handleDelete} className="delete-button">
              Trash
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;