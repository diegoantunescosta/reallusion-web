// index.jsx ou App.jsx (configuração do roteamento)
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateAvatarPage from './CreateAvatar';
import App from './App';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<CreateAvatarPage />} />
      <Route path="/app/:charID" element={<App />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);
