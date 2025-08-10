import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// No BrowserRouter here; we'll add it inside App.js

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
