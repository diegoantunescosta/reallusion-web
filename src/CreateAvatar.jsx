import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const voiceOptions = [
  { value: 'WPTBRMale 1', label: 'Masculina' },
  { value: 'WJAJPFemale 2', label: 'Feminina' }
];

const languageOptions = [
  { value: 'ja-JP', label: 'Japonês (ja-JP)' },
  { value: 'en-US', label: 'Inglês (en-US)' },
  { value: 'pt-BR', label: 'Português (pt-BR)' },
];

// Lista de charIDs específicos
const charIDList = [
  '33c4f9c8-7629-11ef-8a3d-42010a7be011',
  '935f6300-7570-11ef-ae44-42010a7be011',
  '26aa85fa-7629-11ef-aa51-42010a7be011',
  '22521efa-7629-11ef-974c-42010a7be011'
];

export default function CreateAvatarPage() {
  const [charName, setCharName] = useState('');
  const [voiceType, setVoiceType] = useState('');
  const [languageCode, setLanguageCode] = useState('');
  const [backstory, setBackstory] = useState('');
  const [charID, setCharID] = useState('');
  const [existingAvatars, setExistingAvatars] = useState([]);
  const [isNewAvatar, setIsNewAvatar] = useState(true);
  const [showAvatarList, setShowAvatarList] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [newAvatarID, setNewAvatarID] = useState('');
  const navigate = useNavigate();

  // Carregar os avatares específicos
  useEffect(() => {
    const fetchAvatarByCharID = async (charID) => {
      try {
        const response = await fetch('https://api.convai.com/character/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CONVAI-API-KEY': 'c103e89ceeca0fdbb5c3093b13189909'
          },
          body: JSON.stringify({ charID })
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(`Erro ao buscar avatar com ID ${charID}:`, error);
        return null;
      }
    };

    const fetchAvatars = async () => {
      const avatarsPromises = charIDList.map(fetchAvatarByCharID);
      const avatarsData = await Promise.all(avatarsPromises);
      setExistingAvatars(avatarsData.filter(avatar => avatar !== null));
    };

    fetchAvatars();
  }, []);

  // Duplicar e carregar dados do avatar selecionado
  const handleSelectAvatar = async (charID) => {
    try {
      const response = await fetch('https://api.convai.com/character/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CONVAI-API-KEY': 'c103e89ceeca0fdbb5c3093b13189909'
        },
        body: JSON.stringify({ charID })
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar os dados do avatar');
      }

      const data = await response.json();
      const avatar = data;

      // Gerar um novo charID para o avatar duplicado
      const newCharID = `new-${Date.now()}`; // Substitua com o método real de geração de novo charID, se disponível

      setCharID(newCharID);
      setCharName(avatar.character_name || '');
      setVoiceType(avatar.voice_type || '');
      setLanguageCode(avatar.language_code || '');
      setBackstory(avatar.backstory || '');
      setNewAvatarID(newCharID);
      setIsNewAvatar(true);

      setSelectedAvatar({
        name: avatar.character_name,
        voiceType: avatar.voice_type,
        languageCode: avatar.language_code,
        modelLink: avatar.model_details?.modelLink,
        modelPlaceholder: avatar.model_details?.modelPlaceholder,
        backstory: avatar.backstory
      });

      setShowAvatarList(false);
    } catch (error) {
      console.error('Erro ao carregar os dados do avatar:', error);
    }
  };

  // Submeter criação ou atualização do avatar
  const handleSubmit = async (e) => {
    e.preventDefault();
    const avatarData = { charID, charName, voiceType, languageCode, backstory };

    try {
      const url = isNewAvatar
        ? 'https://api.convai.com/character/create' // Endpoint fictício, ajuste conforme necessário
        : 'https://api.convai.com/character/update';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CONVAI-API-KEY': 'c103e89ceeca0fdbb5c3093b13189909'
        },
        body: JSON.stringify(avatarData),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar o avatar');
      }

      const data = await response.json();
      const charID = data.charID || avatarData.charID;

      localStorage.setItem('CHARACTER_ID', charID);

      console.log('Avatar salvo com sucesso:', charID);
      navigate(`/app/${charID}`);
    } catch (error) {
      console.error('Erro ao salvar o avatar:', error);
    }
  };

  // Função para criar um novo avatar
  const handleCreateNewAvatar = () => {
    setCharID('');
    setCharName('');
    setVoiceType('');
    setLanguageCode('');
    setBackstory('');
    setIsNewAvatar(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h2>{isNewAvatar ? 'Criar Novo Avatar' : 'Atualizar Avatar'}</h2>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleCreateNewAvatar}
          style={{ marginRight: '10px', padding: '10px', backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer' }}
        >
          Criar Novo Avatar
        </button>

        <button
          onClick={() => setShowAvatarList(!showAvatarList)}
          style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer' }}
        >
          {isNewAvatar ? 'Escolher Avatar Existente' : 'Selecionar Outro Avatar para Clonar'}
        </button>
      </div>

      {showAvatarList && (
        <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h4>Selecione um Avatar para Clonar:</h4>
          {existingAvatars.length > 0 ? (
            <ul>
              {existingAvatars.map((avatar) => (
                <li
                  key={avatar.character_id}
                  style={{ cursor: 'pointer', padding: '5px' }}
                  onClick={() => handleSelectAvatar(avatar.character_id)}
                >
                  {avatar.character_name || avatar.character_id}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum avatar encontrado.</p>
          )}
        </div>
      )}

      {selectedAvatar && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Detalhes do Avatar Selecionado</h3>
          <p><strong>Nome:</strong> {selectedAvatar.name}</p>
          <p><strong>Tipo de Voz:</strong> {selectedAvatar.voiceType}</p>
          <p><strong>Código de Idioma:</strong> {selectedAvatar.languageCode}</p>
          <p><strong>História de Fundo:</strong> {selectedAvatar.backstory}</p>
          <p><strong>Modelo 3D:</strong> <a href={selectedAvatar.modelLink} target="_blank" rel="noopener noreferrer">Modelo</a></p>
          <img src={selectedAvatar.modelPlaceholder} alt="Modelo Placeholder" style={{ width: '200px', height: 'auto' }} />
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <input
          type="text"
          placeholder="Nome do Avatar"
          value={charName}
          onChange={(e) => setCharName(e.target.value)}
          style={{ margin: '10px 0', padding: '10px' }}
          required
        />
        <select
          value={voiceType}
          onChange={(e) => setVoiceType(e.target.value)}
          style={{ margin: '10px 0', padding: '10px' }}
          required
        >
          <option value="">Selecione um Tipo de Voz</option>
          {voiceOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <select
          value={languageCode}
          onChange={(e) => setLanguageCode(e.target.value)}
          style={{ margin: '10px 0', padding: '10px' }}
          required
        >
          <option value="">Selecione um Código de Idioma</option>
          {languageOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <textarea
          placeholder="História de Fundo"
          value={backstory}
          onChange={(e) => setBackstory(e.target.value)}
          style={{ margin: '10px 0', padding: '10px' }}
        />
        <button
          type="submit"
          style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer' }}
        >
          {isNewAvatar ? 'Criar Avatar' : 'Atualizar Avatar'}
        </button>
      </form>
    </div>
  );
}
