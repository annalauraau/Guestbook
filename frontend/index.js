// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';  // We'll create this next

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')  // Make sure you have a div with id="root" in your HTML
);
