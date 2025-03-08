import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // Optional, but commonly included for global styles
import App from './App.js';  // Main App component
import reportWebVitals from './reportWebVitals';  // Optional, for measuring performance

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
