const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// URL do seu Apps Script Web App
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxXSbxak0Cr72Z7u_qpCjwNUZAifAjnBEALgAtz-8bcN7L3WX_pM8YBYkgtCCubw1d5Ig/exec';

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Endpoint de status
app.get('/api/status', (req, res) => {
    const status = {
        status: 'online',
        timestamp: new Date().toISOString(),
        environment: {
            PORT: PORT || 3000
        },
        endpoints: [
            'GET /api/status',
            'GET /api/comments',
            'POST /api/comments',
            'POST /api/suggestions'
        ]
    };
    res.json(status);
});

// Endpoint para carregar comentários
app.get('/api/comments', async (req, res) => {
    try {
        const url = `${GOOGLE_SCRIPT_URL}?action=getComments`;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para enviar comentário
app.post('/api/comments', async (req, res) => {
    try {
        const { name, age, rating, comment } = req.body;
        if (!name || !rating || !comment) {
            throw new Error('Nome, avaliação e comentário são obrigatórios');
        }

        const params = new URLSearchParams();
        params.append('action', 'addComment');
        params.append('name', name);
        params.append('age', age || '');
        params.append('rating', rating);
        params.append('comment', comment);

        const url = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;
        const response = await fetch(url, { method: 'POST' });
        const data = await response.json();
        
        if (data.error) throw new Error(data.error);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para enviar sugestão
app.post('/api/suggestions', async (req, res) => {
    try {
        const { name, email, suggestion } = req.body;
        if (!name || !suggestion) {
            throw new Error('Nome e sugestão são obrigatórios');
        }

        const params = new URLSearchParams();
        params.append('action', 'addSuggestion');
        params.append('name', name);
        params.append('email', email || '');
        params.append('suggestion', suggestion);

        const url = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;
        const response = await fetch(url, { method: 'POST' });
        const data = await response.json();
        
        if (data.error) throw new Error(data.error);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log('Servidor rodando em http://localhost:' + PORT);
});