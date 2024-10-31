// LoginPage.jsx
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function LoginPage() {
  const navigate = useNavigate();

  // Função para gerenciar o sucesso do login
  const handleLoginSuccess = (credentialResponse) => {
    console.log('Login com sucesso:', credentialResponse);
    navigate('/create-avatar'); // Navega para a página de criação de avatar após o login
  };

  // Função para gerenciar erros no login
  const handleLoginError = () => {
    console.log('Erro ao realizar login');
  };

  return (
    <GoogleOAuthProvider clientId="523729213609-24gkt8pfpnu9eq9kmhri0otrp2u8jad8.apps.googleusercontent.com">
      {/* Vídeo de fundo */}
      <div className="video-background">
        <video autoPlay muted loop className="video-foreground">
          <source src="4990233-hd_1920_1080_30fps.mp4" type="video/mp4" /> {/* Substitua pelo caminho do seu vídeo */}
          Seu navegador não suporta vídeos.
        </video>
      </div>
      
      <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100">
        {/* Imagem centralizada no topo */}
        <img 
          src="LOGOTIPO HORIZONTAL 1 - BRANCO.png" // Substitua pelo caminho da sua imagem
          alt="Logo Euvatar"
          style={{ maxWidth: '300px', marginBottom: '2rem' }} // Ajuste o tamanho conforme necessário
        />
        <Card style={{ maxWidth: '400px', padding: '2rem', borderRadius: '15px' }} className="shadow-lg text-center">
          <Card.Body>
            <Card.Title style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              Bem-vindo ao Euvatar
            </Card.Title>
            <Card.Text style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#555' }}>
              Faça login para começar a criar e interagir com seus avatares personalizados
            </Card.Text>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
            />
          </Card.Body>
        </Card>
      </Container>
    </GoogleOAuthProvider>
  );
}
//video