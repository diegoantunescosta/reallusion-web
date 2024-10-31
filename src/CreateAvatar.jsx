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
  '839fe982-9783-11ef-aec9-42010a7be016': 'animations.png',
  '65bd3596-9783-11ef-b686-42010a7be016': 'c3rti6htgosc1.webp',
  '4d0fc78e-9783-11ef-be07-42010a7be016': 'images.jpeg'
};

export default function CreateAvatarPage() {
  const [charData, setCharData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Estado para armazenar as informações do avatar em tempo real
  const [avatarInfo, setAvatarInfo] = useState({});

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
        console.log(data); // Log da resposta da API
        return data;
      } catch (error) {
        console.error(`Erro ao buscar avatar com ID ${charID}:`, error);
        return null;
      }
    };

    const fetchAvatars = async () => {
      setIsLoading(true);
      const avatarsPromises = charIDList.map(fetchAvatarByCharID);
      const avatarsData = await Promise.all(avatarsPromises);
      setCharData(avatarsData.filter(avatar => avatar !== null));
      setIsLoading(false);
    };

    fetchAvatars();
  }, []);

  const handleInputChange = (charID, field, value) => {
    // Atualiza o estado de avatarInfo com os novos valores
    setAvatarInfo((prevState) => ({
      ...prevState,
      [charID]: {
        ...(prevState[charID] || {}),
        [field]: value
      }
    }));

    // Salva automaticamente no localStorage
    localStorage.setItem(charID, JSON.stringify({
      ...(avatarInfo[charID] || {}),
      [field]: value
    }));
  };

  const handleSubmit = async (e, avatarData) => {
    e.preventDefault();

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

  return (
    <div className="container mt-5">
      {/* Card para a logo */}
      <div className="row justify-content-center mb-4">
        <div className="col-12 text-center"> {/* Remover col-md-6 para centralizar totalmente */}
          <Card className="shadow-sm mx-auto" style={{ borderRadius: '15px', maxWidth: '300px' }}> {/* Adicionar maxWidth */}
            <Card.Body>
              <img 
                src="LOGOTIPO HORIZONTAL 1 - PRETO.png" // Substitua pelo caminho do seu logo
                alt="Logo Euvatar"
                style={{ maxWidth: '80%', height: 'auto' }} // Ajuste o tamanho conforme necessário
              />
            </Card.Body>
          </Card>
        </div>
      </div>
  
      <div className="row justify-content-center">
        {isLoading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </Spinner>
          </div>
        ) : charData.length > 0 ? (
          charData.map((avatar) => (
            <div className="col-12 col-sm-6 col-md-4 mb-4 d-flex justify-content-center" key={avatar.character_id}>
              <Card className="text-center shadow-lg" style={{ width: '100%', maxWidth: '300px', borderRadius: '15px' }}>
                <Card.Img
                  variant="top"
                  src={avatarImages[avatar.character_id] || 'https://via.placeholder.com/200'}
                  alt="Modelo Placeholder"
                  className="card-img-top"
                  style={{ height: '150px', objectFit: 'contain', borderRadius: '15px 15px 0 0' }}
                  onError={(e) => {
                    console.error(`Imagem não encontrada para ID: ${avatar.character_id}`);
                    e.target.src = 'https://via.placeholder.com/200'; // Mostra uma imagem de placeholder
                  }}
                />
                <Card.Body className="p-4">
                  <Card.Title className="mb-3" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {avatar.character_name || 'Avatar Sem Nome'}
                  </Card.Title>
                  <form onSubmit={(e) => handleSubmit(e, {
                    charID: `new-${Date.now()}`,
                    charName: avatarInfo[avatar.character_id]?.charName || avatar.character_name || '',
                    voiceType: avatarInfo[avatar.character_id]?.voiceType || avatar.voice_type || '',
                    languageCode: avatarInfo[avatar.character_id]?.languageCode || avatar.language_code || '',
                    backstory: avatarInfo[avatar.character_id]?.backstory || avatar.backstory || ''
                  })}>
                    <div className="mb-3">
                    <label className="custom-label">Nome do Avatar</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={avatar.character_name || ''}
                      onChange={(e) => handleInputChange(avatar.character_id, 'charName', e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="custom-label">Tipo de Voz</label>
                    <select
                      className="form-select"
                      defaultValue={avatar.voice_type || ''}
                      onChange={(e) => handleInputChange(avatar.character_id, 'voiceType', e.target.value)}
                    >
                      {voiceOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="custom-label">Código de Idioma</label>
                    <select
                      className="form-select"
                      defaultValue={avatar.language_code || ''}
                      onChange={(e) => handleInputChange(avatar.character_id, 'languageCode', e.target.value)}
                    >
                      {languageOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="custom-label">História de Fundo</label>
                    <textarea
                      className="form-control"
                      defaultValue={avatar.backstory || ''}
                      onChange={(e) => handleInputChange(avatar.character_id, 'backstory', e.target.value)}
                    />
                  </div>

                    <Button variant="primary" type="submit" className="w-100">
                      Iniciar Interação
                    </Button>
                  </form>
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
    </div>
  );
}
