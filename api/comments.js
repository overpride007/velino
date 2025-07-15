[file name]: comments.js
[file content]
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'overpride007';
const GITHUB_REPO = process.env.GITHUB_REPO || 'velino';
const DISCUSSION_COMMENTS = process.env.DISCUSSION_COMMENTS || 1; // ID da discussão para avaliações
const DISCUSSION_SUGGESTIONS = process.env.DISCUSSION_SUGGESTIONS || 2; // ID para sugestões

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Endpoint de status (para verificar se as variáveis estão carregadas)
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        config: {
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            discussion_comments: DISCUSSION_COMMENTS,
            discussion_suggestions: DISCUSSION_SUGGESTIONS,
            token_configured: !!GITHUB_TOKEN
        }
    });
});

// Endpoint para postar avaliações (Discussion #1)
app.post('/api/comments', async (req, res) => {
    try {
        const { name, age, rating, comment } = req.body;
        if (!name || !rating || !comment) throw new Error('Nome, avaliação e comentário são obrigatórios');

        const commentBody = `### Nova Avaliação\n**Nome:** ${name}\n**Idade:** ${age || "Não informada"}\n**Avaliação:** ⭐ ${rating}/5\n**Comentário:**\n${comment}`;

        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/discussions/${DISCUSSION_COMMENTS}/comments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ body: commentBody })
        });

        if (!response.ok) throw new Error(await response.text());
        res.json(await response.json());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para postar sugestões (Discussion #2)
app.post('/api/suggestions', async (req, res) => {
    try {
        const { name, email, suggestion } = req.body;
        if (!name || !suggestion) throw new Error('Nome e sugestão são obrigatórios');

        const suggestionBody = `### Nova Sugestão\n**Nome:** ${name}\n${email ? `**Email:** ${email}\n` : ''}**Sugestão:**\n${suggestion}`;

        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/discussions/${DISCUSSION_SUGGESTIONS}/comments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ body: suggestionBody })
        });

        if (!response.ok) throw new Error(await response.text());
        res.json(await response.json());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
