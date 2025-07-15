// Backend simples para proxy das requisições GitHub
// Este arquivo roda no servidor e esconde o token

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
app.use(express.static('.')); // Serve arquivos estáticos

// Endpoint para carregar comentários
app.get('/api/comments', async (req, res) => {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?labels=comment&state=all&sort=created&direction=desc`);
        
        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erro ao carregar comentários:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para enviar comentário
app.post('/api/comments', async (req, res) => {
    try {
        const { name, age, rating, comment } = req.body;
        
        const issueBody = `Nome: ${name}
Idade: ${age}
Avaliação: ${rating}
Comentário: ${comment}`;
        
        const issueData = {
            title: `Comentário de ${name} - ${rating} estrelas`,
            body: issueBody,
            labels: ['comment']
        };
        
        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(issueData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erro ao enviar comentário:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para enviar sugestão
app.post('/api/suggestions', async (req, res) => {
    try {
        const { name, email, suggestion } = req.body;
        
        const issueBody = `Nome: ${name}
${email ? `Email: ${email}` : ''}
Sugestão: ${suggestion}`;
        
        const issueData = {
            title: `Sugestão de ${name}`,
            body: issueBody,
            labels: ['suggestion', 'enhancement']
        };
        
        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(issueData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erro ao enviar sugestão:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📁 Servindo arquivos de: ${__dirname}`);
});

module.exports = app;
