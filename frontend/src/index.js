// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';  // Import the new root API
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

// Create a root for the app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app inside the root using React Router
root.render(
  <Router>
    <App />
  </Router>
);
