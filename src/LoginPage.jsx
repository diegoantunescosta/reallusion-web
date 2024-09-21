import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simular autenticação e salvar o token
    if (email === 'teste@teste.com' && password === '123456') {
      localStorage.setItem('authToken', 'dummy-token'); // Salva o token
      navigate('/create-avatar/33c4f9c8-7629-11ef-8a3d-42010a7be011'); // Navega para criação de avatar
    } else {
      alert('Credenciais inválidas');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ margin: '10px 0', padding: '10px' }}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ margin: '10px 0', padding: '10px' }}
          required
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
      <button
        onClick={() => navigate('/register')}
        style={{ marginTop: '20px', padding: '10px', backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer' }}
      >
        Cadastre-se
      </button>
    </div>
  );
}
