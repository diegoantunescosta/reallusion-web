
Aqui está uma versão resumida e consolidada da documentação README para as funcionalidades de criação, duplicação e atualização de personagens usando a API da Convai:

---

# Convai API - Gestão de Personagens

Esta documentação cobre as operações básicas para criar, duplicar e atualizar personagens na **API Convai**.

## Criação de Personagem

### Endpoint

- **URL**: `https://api.convai.com/character/create`
- **Método HTTP**: POST

### Cabeçalhos

- `key`: CONVAI-API-KEY
- `value`: `{api-key}` (substitua `{api-key}` pela sua chave de API pessoal)

### Corpo da Requisição (Body)

```json
{
  "charName": "Diego",
  "voiceType": "MALE",
  "backstory": "Diego é um cientista de dados que utiliza conhecimentos de matemática, estatística e programação para extrair insights valiosos a partir de grandes volumes de dados..."
}
```

### Exemplo de Requisição

```bash
curl -X POST https://api.convai.com/character/create \
  -H "Content-Type: application/json" \
  -H "CONVAI-API-KEY: {api-key}" \
  -d '{
    "charName": "Diego",
    "voiceType": "MALE",
    "backstory": "Diego é um cientista de dados que utiliza conhecimentos de matemática, estatística e programação..."
  }'
```

### Resposta

```json
{
  "charID": "57a0c93e-7472-11ef-ac22-42010a7be011"
}
```

- `charID`: Identificador único do personagem criado.

## Duplicação de Personagem

### Endpoint

- **URL**: `https://api.convai.com/user/clone_character`
- **Método HTTP**: POST

### Cabeçalhos

- `key`: CONVAI-API-KEY
- `value`: `{api-key}`

### Corpo da Requisição (Body)

```json
{
  "charID": "57a0c93e-7472-11ef-ac22-42010a7be011",
  "KB": true
}
```

### Exemplo de Requisição

```bash
curl -X POST https://api.convai.com/user/clone_character \
  -H "Content-Type: application/json" \
  -H "CONVAI-API-KEY: {api-key}" \
  -d '{
    "charID": "57a0c93e-7472-11ef-ac22-42010a7be011",
    "KB": true
  }'
```

### Resposta

```json
{
  "charID": "91a5265c-7472-11ef-b956-42010a7be011"
}
```

- `charID`: Identificador único do personagem clonado.

## Atualização de Personagem

### Endpoint

- **URL**: `https://api.convai.com/character/update`
- **Método HTTP**: POST

### Cabeçalhos

- `key`: CONVAI-API-KEY
- `value`: `{api-key}`

### Corpo da Requisição (Body)

```json
{
  "charID": "91a5265c-7472-11ef-b956-42010a7be011",
  "backstory": "João é um desenvolvedor backend responsável pela construção e manutenção da parte invisível de uma aplicação...",
  "voiceType": "MALE",
  "charName": "Joao"
}
```

### Exemplo de Requisição

```bash
curl -X POST https://api.convai.com/character/update \
  -H "Content-Type: application/json" \
  -H "CONVAI-API-KEY: {api-key}" \
  -d '{
    "charID": "91a5265c-7472-11ef-b956-42010a7be011",
    "backstory": "João é um desenvolvedor backend responsável pela construção e manutenção da parte invisível de uma aplicação...",
    "voiceType": "MALE",
    "charName": "Joao"
  }'
```

### Resposta

```json
{
  "STATUS": "SUCCESS"
}
```

- `STATUS`: Indica se a atualização foi bem-sucedida.

## Erros Comuns

- **401 Unauthorized**: Verifique se sua chave de API está correta.
- **400 Bad Request**: Certifique-se de que o corpo da requisição JSON está formatado corretamente e que o `charID` é válido.

---

Esta documentação resume os procedimentos para criar, duplicar e atualizar personagens na API da Convai, cobrindo endpoints, cabeçalhos, corpo da requisição e exemplos de resposta.
