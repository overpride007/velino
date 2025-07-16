// (implementação robusta começa abaixo)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Configuração
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../..'))); // Serve arquivos estáticos

// Endpoint de status para diagnóstico
app.get('/api/status', (req, res) => {
    const status = {
        status: 'online',
        timestamp: new Date().toISOString(),
        environment: {
            GITHUB_OWNER: GITHUB_OWNER || 'NÃO CONFIGURADO',
            GITHUB_REPO: GITHUB_REPO || 'NÃO CONFIGURADO',
            GITHUB_TOKEN: GITHUB_TOKEN ? 'CONFIGURADO' : 'NÃO CONFIGURADO',
            PORT: PORT || 8080
        },
        endpoints: [
            'GET /api/status',
            'GET /api/comments',
            'POST /api/comments'
        ]
    };
    console.log('🔍 Status check:', status);
    res.json(status);
});

// Endpoint para carregar comentários da Issue 9
app.get('/api/comments', async (req, res) => {
    try {
        if (!GITHUB_OWNER || !GITHUB_REPO) {
            throw new Error('Variáveis GITHUB_OWNER ou GITHUB_REPO não configuradas');
        }
        const ISSUE_NUMBER = 9;
        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${ISSUE_NUMBER}/comments`, {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github+json'
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`GitHub API Error ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para enviar comentário para a Issue 9
app.post('/api/comments', async (req, res) => {
    try {
        if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
            throw new Error('Variáveis de ambiente não configuradas');
        }
        const ISSUE_NUMBER = 9;
        const { name, rating, comment } = req.body;
        if (!name || !rating || !comment) {
            throw new Error('Nome, avaliação e comentário são obrigatórios');
        }
        var commentBody = 'Nome: ' + name + '\nAvaliação: ' + rating + '\nComentário: ' + comment;
        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${ISSUE_NUMBER}/comments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ body: commentBody })
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error('GitHub API Error ' + response.status + ': ' + errorText);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log('Servidor rodando em http://localhost:' + PORT);
    console.log('Servindo arquivos de: ' + __dirname);
});
