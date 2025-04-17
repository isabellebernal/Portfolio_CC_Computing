// src/pages/PortfolioPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc, updateDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase'; // Adjust the path as needed
import './PortfolioPage.css';

const PortfolioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState('portfolio'); // Toggle between 'portfolio' and 'blog'

  // States for editable fields (portfolio)
  const [editTitle, setEditTitle] = useState('');
  const [editName, setEditName] = useState('');
  const [editAboutMe, setEditAboutMe] = useState('');
  const [editProfilePic, setEditProfilePic] = useState('');
  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState({ title: '', description: '' });
  const [showSectionInput, setShowSectionInput] = useState(false);

  // States for blog
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: '', description: '', image: null });
  const [showBlogInput, setShowBlogInput] = useState(false);

  // Fetch portfolio and blog data from Firestore
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const portfolioRef = doc(db, 'portfolios', id);
        const portfolioSnap = await getDoc(portfolioRef);
        if (portfolioSnap.exists()) {
          const data = portfolioSnap.data();
          setPortfolio(data);
          setEditTitle(data.title || '');
          setEditName(data.name || '');
          setEditAboutMe(data.aboutMe || '');
          setEditProfilePic(data.profilePic || '');
          setSections(data.sections || []);
        } else {
          console.error('No such portfolio!');
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBlogs = async () => {
      try {
        const blogsRef = collection(db, 'portfolios', id, 'blogs');
        const blogsSnap = await getDocs(blogsRef);
        const blogsList = blogsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogsList);
        console.log('Fetched blogs:', blogsList); // Debug log
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchPortfolio();
    fetchBlogs();
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

  // Save portfolio changes when editing
  const handleSave = async () => {
    try {
      const portfolioRef = doc(db, 'portfolios', id);
      await updateDoc(portfolioRef, {
        title: editTitle,
        name: editName,
        aboutMe: editAboutMe,
        profilePic: editProfilePic,
        sections: sections,
      });
      setPortfolio({ ...portfolio, title: editTitle, name: editName, aboutMe: editAboutMe, profilePic: editProfilePic, sections });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating portfolio:', error);
    }
  };

  // Add a new section
  const handleAddSection = () => {
    if (newSection.title.trim() && newSection.description.trim()) {
      setSections([...sections, { ...newSection, id: Date.now() }]);
      setNewSection({ title: '', description: '' });
      setShowSectionInput(false);
    } else {
      alert('Please fill in both title and description.');
    }
  };

  // Remove a section
  const handleRemoveSection = (sectionId) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  // Add a new blog post
  const handleAddBlog = async () => {
    console.log('Attempting to add blog:', newBlog); // Debug log
    if (!newBlog.title.trim() || !newBlog.description.trim() || !newBlog.image) {
      alert('Please fill in all fields and upload an image.');
      return;
    }

    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `blog-images/${id}/${newBlog.image.name}`);
      const snapshot = await uploadBytes(imageRef, newBlog.image);
      console.log('Image uploaded, snapshot:', snapshot); // Debug log
      const imageUrl = await getDownloadURL(imageRef);
      console.log('Image URL:', imageUrl); // Debug log

      // Add blog post to Firestore
      const blogsRef = collection(db, 'portfolios', id, 'blogs');
      const newBlogDoc = await addDoc(blogsRef, {
        title: newBlog.title,
        description: newBlog.description,
        imageUrl: imageUrl,
        createdAt: new Date(),
      });
      console.log('Blog added to Firestore, doc ID:', newBlogDoc.id); // Debug log

      // Update local state
      const newBlogEntry = {
        id: newBlogDoc.id,
        title: newBlog.title,
        description: newBlog.description,
        imageUrl: imageUrl,
        createdAt: new Date(),
      };
      setBlogs([...blogs, newBlogEntry]);
      console.log('Updated blogs state:', [...blogs, newBlogEntry]); // Debug log

      // Reset form
      setNewBlog({ title: '', description: '', image: null });
      setShowBlogInput(false);
    } catch (error) {
      console.error('Error adding blog:', error);
      alert('Failed to add blog. Check console for details.');
    }
  };

  // Remove a blog post
  const handleRemoveBlog = async (blogId) => {
    try {
      await deleteDoc(doc(db, 'portfolios', id, 'blogs', blogId));
      setBlogs(blogs.filter(blog => blog.id !== blogId));
    } catch (error) {
      console.error('Error removing blog:', error);
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
          <div className="view-toggle">
            <h2 className={viewMode === 'portfolio' ? 'active' : ''}>Portfolio</h2>
            <button
              onClick={() => setViewMode(viewMode === 'portfolio' ? 'blog' : 'portfolio')}
              className="toggle-button"
            >
              {viewMode === 'portfolio' ? 'Blog' : 'Portfolio'}
            </button>
          </div>
          {viewMode === 'portfolio' ? (
            <>
              <textarea
                value={editAboutMe}
                onChange={(e) => setEditAboutMe(e.target.value)}
                placeholder="About Me"
                className="textarea-field"
              />
              {showSectionInput && (
                <div className="section-input">
                  <input
                    type="text"
                    value={newSection.title}
                    onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                    placeholder="Section Title"
                    className="input-field"
                  />
                  <textarea
                    value={newSection.description}
                    onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                    placeholder="Section Description"
                    className="textarea-field"
                  />
                  <div className="edit-actions">
                    <button onClick={handleAddSection} className="button-primary">Add Section</button>
                    <button onClick={() => setShowSectionInput(false)} className="button-secondary">Cancel</button>
                  </div>
                </div>
              )}
              {sections.map(section => (
                <div key={section.id} className="section-preview">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => {
                      const updatedSections = sections.map(s =>
                        s.id === section.id ? { ...s, title: e.target.value } : s
                      );
                      setSections(updatedSections);
                    }}
                    className="input-field"
                  />
                  <textarea
                    value={section.description}
                    onChange={(e) => {
                      const updatedSections = sections.map(s =>
                        s.id === section.id ? { ...s, description: e.target.value } : s
                      );
                      setSections(updatedSections);
                    }}
                    className="textarea-field"
                  />
                  <button onClick={() => handleRemoveSection(section.id)} className="button-danger">Remove</button>
                </div>
              ))}
              <div className="edit-actions">
                <button onClick={handleSave} className="button-primary">Save</button>
                <button onClick={() => setIsEditing(false)} className="button-secondary">Cancel</button>
                <button onClick={() => setShowSectionInput(true)} className="button-secondary">Add Section</button>
              </div>
            </>
          ) : (
            <>
              {showBlogInput && (
                <div className="blog-input">
                  <input
                    type="text"
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                    placeholder="Blog Post Title"
                    className="input-field"
                  />
                  <textarea
                    value={newBlog.description}
                    onChange={(e) => setNewBlog({ ...newBlog, description: e.target.value })}
                    placeholder="Blog Post Description"
                    className="textarea-field"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewBlog({ ...newBlog, image: e.target.files[0] })}
                    className="input-field"
                  />
                  <div className="edit-actions">
                    <button onClick={handleAddBlog} className="button-primary">Add Blog Post</button>
                    <button onClick={() => setShowBlogInput(false)} className="button-secondary">Cancel</button>
                  </div>
                </div>
              )}
              {blogs.map(blog => (
                <div key={blog.id} className="blog-preview">
                  <input
                    type="text"
                    value={blog.title}
                    onChange={(e) => {
                      const updatedBlogs = blogs.map(b =>
                        b.id === blog.id ? { ...b, title: e.target.value } : b
                      );
                      setBlogs(updatedBlogs);
                    }}
                    className="input-field"
                  />
                  <textarea
                    value={blog.description}
                    onChange={(e) => {
                      const updatedBlogs = blogs.map(b =>
                        b.id === blog.id ? { ...b, description: e.target.value } : b
                      );
                      setBlogs(updatedBlogs);
                    }}
                    className="textarea-field"
                  />
                  {blog.imageUrl && (
                    <img src={blog.imageUrl} alt="Blog" className="blog-image-preview" />
                  )}
                  <button onClick={() => handleRemoveBlog(blog.id)} className="button-danger">Remove</button>
                </div>
              ))}
              <div className="edit-actions">
                <button onClick={handleSave} className="button-primary">Save</button>
                <button onClick={() => setIsEditing(false)} className="button-secondary">Cancel</button>
                <button onClick={() => setShowBlogInput(true)} className="button-secondary">Add Blog Post</button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="portfolio-container">
          <div className="portfolio-content">
            <div className="profile-info">
              {portfolio.profilePic && (
                <img
                  src={portfolio.profilePic}
                  alt={`${portfolio.name}'s profile`}
                  className="profile-image"
                />
              )}
              <div>
                <h1 className="portfolio-name">{portfolio.name}</h1>
                <div className="view-toggle">
                  <h2 className={viewMode === 'portfolio' ? 'active' : ''}>About me</h2>
                  <button
                    onClick={() => setViewMode(viewMode === 'portfolio' ? 'blog' : 'portfolio')}
                    className="toggle-button"
                  >
                    {viewMode === 'portfolio' ? 'Blog' : 'Portfolio'}
                  </button>
                </div>
                {viewMode === 'portfolio' && (
                  <p className="portfolio-title">{portfolio.aboutMe}</p>
                )}
              </div>
            </div>
            {viewMode === 'portfolio' ? (
              <div className="sections-container">
                {portfolio.sections && portfolio.sections.length > 0 ? (
                  portfolio.sections.map((section, index) => (
                    <div key={index} className="section-display">
                      <h3>{section.title}</h3>
                      <p>{section.description}</p>
                    </div>
                  ))
                ) : (
                  <p>No sections available.</p>
                )}
              </div>
            ) : (
              <div className="blogs-container">
                {blogs.length > 0 ? (
                  blogs.map((blog, index) => (
                    <div key={index} className="blog-display">
                      <h3>{blog.title}</h3>
                      {blog.imageUrl && (
                        <img src={blog.imageUrl} alt={blog.title} className="blog-image" />
                      )}
                      <p>{blog.description}</p>
                    </div>
                  ))
                ) : (
                  <p>No blog posts available.</p>
                )}
              </div>
            )}
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