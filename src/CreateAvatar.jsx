import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Spinner } from 'react-bootstrap';

// Opções de voz
const voiceOptions = [
  { value: 'WPTBRMale 1', label: 'Masculina' },
  { value: 'WJAJPFemale 2', label: 'Feminina' }
];

// Opções de idioma
const languageOptions = [
  { value: 'ja-JP', label: 'Japonês (ja-JP)' },
  { value: 'en-US', label: 'Inglês (en-US)' },
  { value: 'pt-BR', label: 'Português (pt-BR)' },
];

// Lista de charIDs específicos
const charIDList = [
  '839fe982-9783-11ef-aec9-42010a7be016',
  '65bd3596-9783-11ef-b686-42010a7be016',
  '4d0fc78e-9783-11ef-be07-42010a7be016',
];

// Mapeamento de imagens para cada charID
const avatarImages = {
  '839fe982-9783-11ef-aec9-42010a7be016': '96d1425510379eca8f16aa09a4e676fc.jpg',
  '65bd3596-9783-11ef-b686-42010a7be016': 'c3rti6htgosc1.webp',
  '4d0fc78e-9783-11ef-be07-42010a7be016': 'images.jpeg'
};

export default function CreateAvatarPage() {
  const [charName, setCharName] = useState('');
  const [voiceType, setVoiceType] = useState('');
  const [languageCode, setLanguageCode] = useState('');
  const [backstory, setBackstory] = useState('');
  const [charID, setCharID] = useState('');
  const [existingAvatars, setExistingAvatars] = useState([]);
  const [isNewAvatar, setIsNewAvatar] = useState(true);
  const [showAvatarList, setShowAvatarList] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedAvatarImage, setSelectedAvatarImage] = useState(null);
  const [newAvatarID, setNewAvatarID] = useState('');
  const [isCharacterSelected, setIsCharacterSelected] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Novo estado para controle de carregamento
  const navigate = useNavigate();

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
      setIsLoading(true); // Começa o carregamento
      const avatarsPromises = charIDList.map(fetchAvatarByCharID);
      const avatarsData = await Promise.all(avatarsPromises);
      setExistingAvatars(avatarsData.filter(avatar => avatar !== null));
      setIsLoading(false); // Termina o carregamento
    };

    fetchAvatars();
  }, []);

  const handleSelectAvatar = async (avatar) => {
    const newCharID = `new-${Date.now()}`;
    setCharID(newCharID);
    setCharName(avatar.character_name || '');
    setVoiceType(avatar.voice_type || '');
    setLanguageCode(avatar.language_code || '');
    setBackstory(avatar.backstory || '');
    setNewAvatarID(newCharID);
    setSelectedAvatar(avatar);
    setSelectedAvatarImage(avatarImages[avatar.character_id] || 'https://via.placeholder.com/200');

    // Aqui, redireciona para a página de interação com o avatar
    try {
      const interactionResponse = await fetch('URL_DA_PAGINA_DE_INTERACAO', { // substitua pela URL real
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CONVAI-API-KEY': 'c103e89ceeca0fdbb5c3093b13189909'
        },
        body: JSON.stringify({ charID: avatar.character_id }) // ou qualquer outra informação necessária
      });

      if (interactionResponse.ok) {
        const charID = await interactionResponse.json();
        navigate(`/app/${charID}`); // Ajuste a navegação para a página de interação com o avatar
      } else {
        throw new Error('Falha ao iniciar interação com o avatar');
      }
    } catch (error) {
      console.error('Erro ao iniciar interação com o avatar:', error);
    }
    
    setShowAvatarList(false);
    setIsCharacterSelected(true);
    setIsNewAvatar(false);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const avatarData = { charID, charName, voiceType, languageCode, backstory };

    try {
      const url = 'https://api.convai.com/character/create';

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
      navigate(`/app/${charID}`);
    } catch (error) {
      console.error('Erro ao salvar o avatar:', error);
    }
  };

  const handleCreateNewAvatar = () => {
    setCharID('');
    setCharName('');
    setVoiceType('');
    setLanguageCode('');
    setBackstory('');
    setIsNewAvatar(true);
    setShowAvatarList(false);
    setSelectedAvatarImage(null);
    setIsCharacterSelected(false);
    setShowForm(true);
  };

  const handleChooseExistingAvatar = () => {
    setShowAvatarList(!showAvatarList);
    setShowForm(false);
    setIsNewAvatar(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{isNewAvatar ? 'Criar Novo Avatar' : 'Escolher Avatar Existente'}</h2>

      <div className="d-flex justify-content-center mb-4">
        <Button variant="success" className="me-2" onClick={handleCreateNewAvatar}>
          Criar Novo Avatar
        </Button>
        <Button variant="success" onClick={handleChooseExistingAvatar}>
          Escolher Avatar Existente
        </Button>
      </div>

      {showAvatarList && (
        <div className="row justify-content-center">
          {isLoading ? ( // Verifica se está carregando
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Carregando...</span>
              </Spinner>
            </div>
          ) : existingAvatars.length > 0 ? (
            existingAvatars.map((avatar) => (
              <div className="col-12 col-sm-6 col-md-4 mb-4 d-flex justify-content-center" key={avatar.character_id}>
                <Card className="text-center" style={{ width: '100%', maxWidth: '300px' }}>
                  <Card.Img
                    variant="top"
                    src={avatarImages[avatar.character_id] || 'https://via.placeholder.com/200'} // Adiciona uma imagem placeholder
                    alt="Modelo Placeholder"
                    className="card-img-top"
                    style={{ height: '150px', objectFit: 'contain' }} // Ajuste o tamanho da imagem
                  />
                  <Card.Body>
                    <Card.Title>{avatar.character_name || 'Avatar Sem Nome'}</Card.Title>
                    <Card.Text>
                      <strong>Tipo de Voz:</strong> {avatar.voice_type} <br />
                      <strong>Código de Idioma:</strong> {avatar.language_code} <br />
                      <strong>História de Fundo:</strong> {avatar.backstory}
                    </Card.Text>
                    <Button variant="primary" onClick={() => handleSelectAvatar(avatar)}>
                      Selecionar Avatar
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <div className="text-center">
              <p>Nenhum avatar encontrado. Tente novamente mais tarde.</p>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4">
          <h4>{isNewAvatar ? 'Criação de Novo Avatar' : 'Interagindo com Avatar Selecionado'}</h4>
          <div className="mb-3">
            <label htmlFor="charName" className="form-label">Nome do Avatar:</label>
            <input
              type="text"
              id="charName"
              value={charName}
              onChange={(e) => setCharName(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="voiceType" className="form-label">Tipo de Voz:</label>
            <select
              id="voiceType"
              value={voiceType}
              onChange={(e) => setVoiceType(e.target.value)}
              className="form-select"
              required
            >
              {voiceOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="languageCode" className="form-label">Código de Idioma:</label>
            <select
              id="languageCode"
              value={languageCode}
              onChange={(e) => setLanguageCode(e.target.value)}
              className="form-select"
              required
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="backstory" className="form-label">História de Fundo:</label>
            <textarea
              id="backstory"
              value={backstory}
              onChange={(e) => setBackstory(e.target.value)}
              className="form-control"
              rows="3"
              required
            />
          </div>

          <Button type="submit" variant="primary">
            {isNewAvatar ? 'Criar Avatar' : 'Salvar Avatar'}
          </Button>
        </form>
      )}
    </div>
  );
}
