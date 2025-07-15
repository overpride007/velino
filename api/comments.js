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

// Endpoint de status para diagnóstico
app.get('/api/status', (req, res) => {
    const status = {
        status: 'online',
        timestamp: new Date().toISOString(),
        environment: {
            GITHUB_OWNER: GITHUB_OWNER || 'NÃO CONFIGURADO',
            GITHUB_REPO: GITHUB_REPO || 'NÃO CONFIGURADO',
            GITHUB_TOKEN: GITHUB_TOKEN ? 'CONFIGURADO' : 'NÃO CONFIGURADO',
            PORT: PORT || 3000
        },
        endpoints: [
            'GET /api/status',
            'GET /api/comments',
            'POST /api/comments',
            'POST /api/suggestions'
        ]
    };
    
    console.log('🔍 Status check:', status);
    res.json(status);
});

// Endpoint para carregar comentários
app.get('/api/comments', async (req, res) => {
    try {
        console.log('📖 Carregando comentários...');
        
        // Verificar variáveis de ambiente
        if (!GITHUB_OWNER || !GITHUB_REPO) {
            throw new Error('Variáveis GITHUB_OWNER ou GITHUB_REPO não configuradas');
        }
        
        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?labels=comment&state=all&sort=created&direction=desc`);
        
        console.log('📊 Status da resposta GitHub (carregar):', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Erro ao carregar comentários:', errorText);
            throw new Error(`GitHub API Error ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log(`✅ ${data.length} comentários carregados`);
        res.json(data);
    } catch (error) {
        console.error('❌ Erro ao carregar comentários:', error.message);
        res.status(500).json({ 
            error: error.message,
            details: 'Verifique se o repositório existe e as Issues estão habilitadas'
        });
    }
});

// Endpoint para enviar comentário
app.post('/api/comments', async (req, res) => {
    try {
        console.log('📝 Tentativa de envio de comentário:', req.body);
        
        // Verificar se as variáveis de ambiente estão configuradas
        if (!GITHUB_TOKEN) {
            throw new Error('GITHUB_TOKEN não configurado nas variáveis de ambiente');
        }
        if (!GITHUB_OWNER) {
            throw new Error('GITHUB_OWNER não configurado nas variáveis de ambiente');
        }
        if (!GITHUB_REPO) {
            throw new Error('GITHUB_REPO não configurado nas variáveis de ambiente');
        }
        
        const { name, age, rating, comment } = req.body;
        
        // Validar dados obrigatórios
        if (!name || !rating || !comment) {
            throw new Error('Nome, avaliação e comentário são obrigatórios');
        }
        
        const issueBody = `Nome: ${name}
Idade: ${age}
Avaliação: ${rating}
Comentário: ${comment}`;
        
        const issueData = {
            title: `Comentário de ${name} - ${rating} estrelas`,
            body: issueBody,
            labels: ['comment']
        };
        
        console.log('🚀 Enviando para GitHub API...');
        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(issueData)
        });
        
        console.log('📊 Status da resposta GitHub:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Erro da API GitHub:', errorText);
            throw new Error(`GitHub API Error ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('✅ Comentário criado com sucesso!', data.number);
        res.json(data);
    } catch (error) {
        console.error('❌ Erro ao enviar comentário:', error.message);
        res.status(500).json({ 
            error: error.message,
            details: 'Verifique as variáveis de ambiente no Railway'
        });
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
