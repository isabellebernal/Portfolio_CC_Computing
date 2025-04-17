// src/index.js
import React from 'react';
<<<<<<< HEAD
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css'; // Import global styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
=======
import { createRoot } from 'react-dom/client'; // Updated import
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = createRoot(document.getElementById('root')); // Create a root
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
>>>>>>> 7c07938e89741543b03d3ecd0504f7b3e92ee0f0
);