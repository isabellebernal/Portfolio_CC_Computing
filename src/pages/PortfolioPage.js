// src/pages/PortfolioPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as needed
import './PortfolioPage.css';

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
        <div className="edit-container">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
            className="input-field"
          />
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Name"
            className="input-field"
          />
          <input
            type="text"
            value={editProfilePic}
            onChange={(e) => setEditProfilePic(e.target.value)}
            placeholder="Profile Picture URL"
            className="input-field"
          />
          <textarea
            value={editAboutMe}
            onChange={(e) => setEditAboutMe(e.target.value)}
            placeholder="About Me"
            className="textarea-field"
          />
          <div className="edit-actions">
            <button onClick={handleSave} className="button-primary">Save</button>
            <button onClick={() => setIsEditing(false)} className="button-secondary">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="portfolio-container">
          <div className="portfolio-content">
            <div className="profile-info">
            {/*profile Image*/}
              {portfolio.profilePic && (
              <img
              src={portfolio.profilePic}
              alt={`${portfolio.name}'s profile`}
              className="profile-image"
              />
            )}
          {/*Text*/}
          <div>
            <h1 className="portfolio-name">{portfolio.name}</h1>
            <h2 className="about-heading">About Me</h2>
            <p className="portfolio-title">{portfolio.aboutMe}</p>
          </div>
        </div>
        
        {/*Buttons*/}
        <div className="button-group">
           <button onClick={() => setIsEditing(true)} className="button-primary">
              Edit
            </button>
            <button onClick={handleDelete} className="button-danger">
              Trash
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;