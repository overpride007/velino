// Backend para o sistema de comentários
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Endpoint de status
app.get('/api/status', (req, res) => {
    const status = {
        status: 'online',
        timestamp: new Date().toISOString(),
        environment: {
            GITHUB_OWNER: GITHUB_OWNER || 'NÃO CONFIGURADO',
            GITHUB_REPO: GITHUB_REPO || 'NÃO CONFIGURADO',
            GITHUB_TOKEN: GITHUB_TOKEN ? 'CONFIGURADO' : 'NÃO CONFIGURADO',
            PORT: PORT || 3000
        }
    };
    
    res.json(status);
});

// Endpoint para carregar comentários
app.get('/api/comments', async (req, res) => {
    try {
        if (!GITHUB_OWNER || !GITHUB_REPO) {
            throw new Error('Variáveis GITHUB_OWNER ou GITHUB_REPO não configuradas');
        }
        
        const ISSUE_NUMBER = 9; // Issue fixa para comentários
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

// Endpoint para enviar comentário
app.post('/api/comments', async (req, res) => {
    try {
        if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
            throw new Error('Variáveis de ambiente não configuradas');
        }
        
        const ISSUE_NUMBER = 9; // Issue fixa para comentários
        const { nome, idade, avaliacao, comentario, extensaoId } = req.body;
        
        if (!nome || !avaliacao || !comentario || !extensaoId) {
            throw new Error('Nome, avaliação, comentário e ID da extensão são obrigatórios');
        }
        
        const commentBody = `Nome: ${nome}\nIdade: ${idade}\nAvaliação: ${avaliacao}\nComentário: ${comentario}\nExtensaoID: ${extensaoId}`;
        
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
            throw new Error(`GitHub API Error ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});