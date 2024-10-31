// App.jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience';
import { KeyboardControls, Loader } from '@react-three/drei';
import { useConvaiClient } from './hooks/useConvaiClient';
import ChatBubble from './components/chat/Chat';
import { useParams } from 'react-router-dom'; // Para obter o parâmetro da URL

function App() {
  const { charID } = useParams(); // Obter o charID da URL

  // Verifica se o charID é válido
  if (!charID) {
    return <div>Character ID is missing</div>;
  }

  // Substitua com a sua API Key
  const { client, loading, error } = useConvaiClient(charID, 'bfa06dc135b71e3c6f0b2a311e044fd4');

  // Mostra um indicador de carregamento se o cliente estiver sendo inicializado
  if (loading) {
    return <div>Loading...</div>;
  }

  // Se ocorrer um erro ao criar o cliente
  if (error) {
    return <div>Error loading character: {error.message}</div>;
  }

  return (
    <>
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
          { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
          { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
          { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
          { name: 'sprint', keys: ['Shift'] },
          { name: 'jump', keys: ['Space'] },
        ]}
      >
        <Loader />
        <Canvas
          shadows
          camera={{
            position: [0, 0.8, 3],
            fov: 75,
          }}
        >
          <Experience client={client} />
        </Canvas>
      </KeyboardControls>
      <ChatBubble client={client} />
    </>
  );
}

export default App;
