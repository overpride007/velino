const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Configuração
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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';
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'overpride007';
const GITHUB_REPO = process.env.GITHUB_REPO || 'Velino';

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve arquivos estáticos

// Middleware para log de requisições
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Endpoint de status para diagnóstico
app.get('/api/status', (req, res) => {
    const status = {
        status: 'online',
        timestamp: new Date().toISOString(),
        environment: {
            GITHUB_OWNER: GITHUB_OWNER,
            GITHUB_REPO: GITHUB_REPO,
            GITHUB_TOKEN: GITHUB_TOKEN ? 'CONFIGURADO (Railway)' : 'NÃO CONFIGURADO',
            PORT: PORT,
            NODE_ENV: process.env.NODE_ENV || 'development',
            RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT || 'production',
            RAILWAY_PROJECT_NAME: process.env.RAILWAY_PROJECT_NAME || 'abundant-motivation'
        },
        endpoints: [
            'GET /api/status',
            'GET /api/comments',
            'POST /api/comments',
            'POST /api/suggestions'
        ],
        debug: process.env.NODE_ENV !== 'production' ? {
            repo_url: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`,
            discussions_url: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/discussions`
        } : undefined
    };
    
    console.log('🔍 Status check:', {
        ...status,
        GITHUB_TOKEN_PREFIX: GITHUB_TOKEN ? `${GITHUB_TOKEN.substring(0, 5)}...` : null
    });
    res.json(status);
});

// Endpoint para carregar comentários da Discussion
app.get('/api/comments', async (req, res) => {
    try {
        const DISCUSSION_NUMBER = 1;
        const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/discussions/${DISCUSSION_NUMBER}/comments`;
        
        console.log(`📨 GET Request to: ${apiUrl}`);
        
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ GitHub API Error:', {
                status: response.status,
                url: apiUrl,
                error: errorData
            });
            throw new Error(`GitHub API Error ${response.status}: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log(`✅ Successfully fetched ${data.length} comments`);
        res.json(data);
    } catch (error) {
        console.error('💥 Error in /api/comments:', error);
        res.status(500).json({ 
            error: error.message,
            details: process.env.NODE_ENV !== 'production' ? error.stack : undefined
        });
    }
});

// Endpoint para enviar comentário para a Discussion
app.post('/api/comments', async (req, res) => {
    try {
        const DISCUSSION_NUMBER = 1;
        const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/discussions/${DISCUSSION_NUMBER}/comments`;
        
        console.log(`📤 POST Request to: ${apiUrl}`);
        console.log('Request body:', req.body);

        const { name, age, rating, comment } = req.body;
        if (!name || !rating || !comment) {
            throw new Error('Nome, avaliação e comentário são obrigatórios');
        }

        const commentBody = `### Nova Avaliação\n\n**Nome:** ${name}\n**Idade:** ${age || 'Não informada'}\n**Avaliação:** ${rating}/5\n**Comentário:** ${comment}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ body: commentBody })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ GitHub API Error:', {
                status: response.status,
                url: apiUrl,
                error: errorData
            });
            throw new Error(`GitHub API Error ${response.status}: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('✅ Comment successfully posted:', {
            commentId: data.id,
            createdAt: data.created_at
        });
        res.json(data);
    } catch (error) {
        console.error('💥 Error in /api/comments POST:', error);
        res.status(500).json({ 
            error: error.message,
            details: process.env.NODE_ENV !== 'production' ? error.stack : undefined
        });
    }
});

// Endpoint para enviar sugestão para a Discussion
app.post('/api/suggestions', async (req, res) => {
    try {
        const DISCUSSION_NUMBER = 2;
        const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/discussions/${DISCUSSION_NUMBER}/comments`;
        
        console.log(`📤 POST Request to: ${apiUrl}`);
        console.log('Request body:', req.body);

        const { name, email, suggestion } = req.body;
        if (!name || !suggestion) {
            throw new Error('Nome e sugestão são obrigatórios');
        }

        const suggestionBody = `### Nova Sugestão\n\n**Nome:** ${name}\n${email ? `**Email:** ${email}\n` : ''}**Sugestão:** ${suggestion}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ body: suggestionBody })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ GitHub API Error:', {
                status: response.status,
                url: apiUrl,
                error: errorData
            });
            throw new Error(`GitHub API Error ${response.status}: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('✅ Suggestion successfully posted:', {
            commentId: data.id,
            createdAt: data.created_at
        });
        res.json(data);
    } catch (error) {
        console.error('💥 Error in /api/suggestions POST:', error);
        res.status(500).json({ 
            error: error.message,
            details: process.env.NODE_ENV !== 'production' ? error.stack : undefined
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('🚨 Unhandled error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log('\n--- Server Startup ---');
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log('🔧 Configurações:');
    console.log(`- Porta: ${PORT}`);
    console.log(`- Repositório: ${GITHUB_OWNER}/${GITHUB_REPO}`);
    console.log(`- Token: ${GITHUB_TOKEN ? 'Presente' : 'Ausente'}`);
    console.log(`- Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log('----------------------\n');
});
