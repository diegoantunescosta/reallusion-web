// index.jsx ou App.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateAvatarPage from './CreateAvatar';
import App from './App';
import LoginPage from './LoginPage'; // Importe a nova página de login

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} /> {/* Página de login como rota inicial */}
      <Route path="/create-avatar" element={<CreateAvatarPage />} />
      <Route path="/app/:charID" element={<App />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);
