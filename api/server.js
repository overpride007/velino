require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());

// Configurações do GitHub
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const ISSUE_URL = 'https://api.github.com/repos/overpride007/velino/issues/9/comments';

// Rotas da API
app.post('/api/comment', async (req, res) => {
  try {
    const { extensionId, username, rating, comment } = req.body;
    
    const commentBody = `<!-- EXTENSION:${extensionId} -->
**Usuário:** ${username}
**Avaliação:** ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}
**Comentário:** ${comment}`;

    const response = await axios.post(ISSUE_URL, { body: commentBody }, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.response?.data?.message || error.message 
    });
  }
});

app.get('/api/comments', async (req, res) => {
  try {
    const response = await axios.get(ISSUE_URL, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.response?.data?.message || error.message 
    });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});