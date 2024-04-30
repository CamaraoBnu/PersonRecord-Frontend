import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { LastButtonProvider } from './contexts/LastButtonContext';
import App from './App';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LastButtonProvider>
      <App />
    </LastButtonProvider>
  </React.StrictMode>
);
