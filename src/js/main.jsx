import React from 'react';
import ReactDOM from 'react-dom/client';

// Estils
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import '../styles/index.css';

// Components
import Home from './components/Home';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);