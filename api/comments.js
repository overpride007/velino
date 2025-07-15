const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações obrigatórias (crasha cedo se faltar algo)
const REQUIRED_ENV = ['GITHUB_TOKEN', 'GITHUB_OWNER', 'GITHUB_REPO'];
REQUIRED_ENV.forEach(env => {
  if (!process.env[env]) {
    console.error(`❌ Variável de ambiente faltando: ${env}`);
    process.exit(1); // Encerra o processo se faltar algo crítico
  }
});

const CONFIG = {
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  GITHUB_OWNER: process.env.GITHUB_OWNER,
  GITHUB_REPO: process.env.GITHUB_REPO,
  DISCUSSION_COMMENTS: process.env.DISCUSSION_COMMENTS || 1,
  DISCUSSION_SUGGESTIONS: process.env.DISCUSSION_SUGGESTIONS || 2
};

// Middleware para log de requisições
app.use((req, _, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});
app.use(cors());
app.use(express.json());

// Endpoint de status melhorado
app.get('/api/status', (_, res) => {
  res.json({
    status: 'online',
    repo: `${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}`,
    discussions: {
      comments: CONFIG.DISCUSSION_COMMENTS,
      suggestions: CONFIG.DISCUSSION_SUGGESTIONS
    }
  });
});

// POST /api/comments - Handler genérico para evitar repetição
async function postToGitHubDiscussion(discussionId, body, res) {
  try {
    const url = `https://api.github.com/repos/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}/discussions/${discussionId}/comments`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ body })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro na API do GitHub');
    }

    return await response.json();
  } catch (error) {
    console.error(`Erro ao postar no GitHub: ${error.message}`);
    throw error;
  }
}

// Endpoints
app.post('/api/comments', async (req, res) => {
  try {
    const { name, age, rating, comment } = req.body;
    if (!name || !rating || !comment) {
      return res.status(400).json({ error: 'Nome, avaliação e comentário são obrigatórios' });
    }

    const body = `### Nova Avaliação\n**Nome:** ${name}\n**Idade:** ${age || "Não informada"}\n**Avaliação:** ⭐ ${rating}/5\n**Comentário:**\n${comment}`;
    const result = await postToGitHubDiscussion(CONFIG.DISCUSSION_COMMENTS, body, res);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/suggestions', async (req, res) => {
  try {
    const { name, email, suggestion } = req.body;
    if (!name || !suggestion) {
      return res.status(400).json({ error: 'Nome e sugestão são obrigatórios' });
    }

    const body = `### Nova Sugestão\n**Nome:** ${name}\n${email ? `**Email:** ${email}\n` : ''}**Sugestão:**\n${suggestion}`;
    const result = await postToGitHubDiscussion(CONFIG.DISCUSSION_SUGGESTIONS, body, res);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🔗 GitHub: ${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}`);
  console.log(`📝 Discussões: Comentários (#${CONFIG.DISCUSSION_COMMENTS}), Sugestões (#${CONFIG.DISCUSSION_SUGGESTIONS})`);
});
