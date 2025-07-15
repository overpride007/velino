const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Configuração
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'overpride007';
const GITHUB_REPO = process.env.GITHUB_REPO || 'Velino';
const COMMENTS_DISCUSSION_ID = 1; // Confirme este número no GitHub
const SUGGESTIONS_DISCUSSION_ID = 2; // Confirme este número no GitHub

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Middleware de logs
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Endpoint para enviar comentário (VERSÃO CORRIGIDA)
app.post('/api/comments', async (req, res) => {
    try {
        console.log('Iniciando postagem de comentário...');
        
        if (!GITHUB_TOKEN) {
            throw new Error('Token do GitHub não configurado');
        }

        const { name, age, rating, comment } = req.body;
        console.log('Dados recebidos:', { name, age, rating, comment });

        if (!name || !rating || !comment) {
            throw new Error('Nome, avaliação e comentário são obrigatórios');
        }

        const commentBody = `### Nova Avaliação\n\n**Nome:** ${name}\n**Idade:** ${age || 'Não informada'}\n**Avaliação:** ${rating}/5\n**Comentário:** ${comment}`;
        
        const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/discussions/${COMMENTS_DISCUSSION_ID}/comments`;
        console.log('URL da API:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`, // Alterado de 'Bearer' para 'token'
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                'X-GitHub-Api-Version': '2022-11-28'
            },
            body: JSON.stringify({ body: commentBody })
        });

        console.log('Status da resposta:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro detalhado:', errorData);
            
            // Verificação específica para repositório não encontrado
            if (response.status === 404) {
                throw new Error(`Discussion não encontrada. Verifique:
- O repositório existe: https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}
- A discussion #${COMMENTS_DISCUSSION_ID} existe
- O token tem permissões de escrita`);
            }
            
            throw new Error(`Erro na API do GitHub: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('Comentário postado com sucesso:', data);
        res.json(data);
    } catch (error) {
        console.error('Erro completo:', error);
        res.status(500).json({ 
            error: error.message,
            stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
        });
    }
});

// ... (mantenha os outros endpoints como estão)

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log('Variáveis de ambiente:', {
        GITHUB_OWNER,
        GITHUB_REPO,
        GITHUB_TOKEN: GITHUB_TOKEN ? '***' + GITHUB_TOKEN.slice(-4) : 'null',
        NODE_ENV: process.env.NODE_ENV
    });
});
