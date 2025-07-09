# 🐙 Configuração GitHub Discussions para Sistema de Comentários

Este guia explica como configurar o GitHub Discussions para funcionar com o sistema de comentários do MEK-Over.

## 📋 Pré-requisitos

- Repositório no GitHub
- GitHub Pages ativado
- Permissões de administrador no repositório

## 🛠️ Passo 1: Ativar GitHub Discussions

1. **Acesse seu repositório no GitHub**
   - Vá para: `https://github.com/SEU-USUARIO/velino`

2. **Ativar Discussions**
   - Clique na aba **Settings** (Configurações)
   - Role para baixo até encontrar **Features**
   - Marque a caixa **✅ Discussions**
   - Clique em **Set up discussions**

3. **Configurar categorias (opcional)**
   - Acesse a aba **Discussions** do seu repositório
   - Clique em **⚙️ Manage discussions**
   - Crie uma categoria específica como "Comentários das Extensões"

## 🔧 Passo 2: Obter IDs necessários

### A. Repository ID

Execute este comando no terminal ou use o GitHub CLI:

```bash
# Usando GitHub CLI (se instalado)
gh api repos/SEU-USUARIO/velino --jq '.node_id'

# Ou use a API REST diretamente
curl -H "Authorization: token SEU_TOKEN" \
     https://api.github.com/repos/SEU-USUARIO/velino
```

### B. Category ID (para discussões específicas)

```graphql
# Execute esta query no GitHub GraphQL Explorer
# https://docs.github.com/en/graphql/overview/explorer

query {
  repository(owner: "SEU-USUARIO", name: "velino") {
    discussionCategories(first: 10) {
      nodes {
        id
        name
        description
      }
    }
  }
}
```

## 📝 Passo 3: Configurar o código

Abra o arquivo `index.html` e localize a seção `GITHUB_CONFIG`:

```javascript
// Configurações do GitHub Discussions
const GITHUB_CONFIG = {
    owner: 'SEU-USUARIO-GITHUB',        // ⚠️ ALTERE AQUI
    repo: 'velino',                     // ⚠️ CONFIRME O NOME
    categoryId: 'DIC_kwDOLxxxxxx',      // ⚠️ OBTENHA VIA GRAPHQL
    token: null                         // Manter null para operações públicas
};
```

### Substituir:
- `'SEU-USUARIO-GITHUB'` → Seu nome de usuário do GitHub
- `'velino'` → Nome do seu repositório (se diferente)
- `'DIC_kwDOLxxxxxx'` → ID da categoria obtido no GraphQL

## 🎯 Passo 4: Criar discussões para extensões

### Método Automático (Recomendado)

Execute este script no console do navegador:

```javascript
// Lista de extensões para criar discussões
const extensoes = [
    { id: 'manhastro', nome: 'Manhastro' },
    { id: 'manga-livre', nome: 'Manga Livre' },
    { id: 'sussy-toons', nome: 'Sussy Toons' },
    // ... adicione mais conforme necessário
];

// Criar URLs para discussões
extensoes.forEach(ext => {
    const title = encodeURIComponent(`💬 Comentários - ${ext.nome}`);
    const body = encodeURIComponent(`
# 💬 Comentários e Avaliações - ${ext.nome}

Este é o espaço oficial para comentários da extensão **${ext.nome}**.

## 📝 Como avaliar:
Use emojis de estrela no seu comentário:
- ⭐ = 1 estrela (Ruim)
- ⭐⭐ = 2 estrelas (Regular)  
- ⭐⭐⭐ = 3 estrelas (Bom)
- ⭐⭐⭐⭐ = 4 estrelas (Muito Bom)
- ⭐⭐⭐⭐⭐ = 5 estrelas (Excelente)

Compartilhe sua experiência!
    `);
    
    const url = `https://github.com/SEU-USUARIO/velino/discussions/new?category=general&title=${title}&body=${body}`;
    console.log(`Criar discussão para ${ext.nome}:`, url);
});
```

### Método Manual

1. Acesse: `https://github.com/SEU-USUARIO/velino/discussions`
2. Clique em **New discussion**
3. Escolha a categoria apropriada
4. Título: `💬 Comentários - Nome da Extensão`
5. Corpo: Use o template acima
6. Clique em **Start discussion**

Repita para cada extensão que você quer ter comentários.

## 🔧 Passo 5: Configurações opcionais

### A. Token de acesso (para funcionalidades avançadas)

**⚠️ Atenção: Apenas para funcionalidades futuras. Não é necessário agora.**

1. Vá para: GitHub Settings → Developer settings → Personal access tokens
2. Gere um token com permissões:
   - `public_repo` (se repositório público)
   - `read:discussion` 
3. **NUNCA** coloque o token diretamente no código
4. Use GitHub Actions ou backend para operações autenticadas

### B. Configurar webhook (opcional)

Para atualizações em tempo real:

1. Repository Settings → Webhooks
2. Add webhook
3. Payload URL: Seu endpoint (se tiver)
4. Content type: `application/json`
5. Events: `Discussion`, `Discussion comment`

## 🧪 Passo 6: Testar o sistema

1. **Abra sua página**: `https://SEU-USUARIO.github.io/velino`
2. **Clique em "Ver Comentários"** em qualquer extensão
3. **Verifique se carrega**: Deve mostrar dados do GitHub
4. **Teste comentar**: Click em "Comentar no GitHub"

### Solução de problemas comuns:

❌ **Erro CORS**: Normal em desenvolvimento local. Funciona no GitHub Pages.

❌ **API Rate Limit**: GitHub permite 60 requests/hora sem token.

❌ **Discussions não encontradas**: Verifique se criou as discussões.

❌ **IDs incorretos**: Confirme owner, repo e categoryId.

## 📊 Como funciona

### Fluxo de dados:
1. **Usuário abre comentários** → Sistema busca discussão no GitHub
2. **GitHub retorna dados** → Sistema processa e exibe
3. **Usuário quer comentar** → Redireciona para GitHub Discussions
4. **Avaliações são extraídas** → Sistema conta ⭐ emojis nos comentários

### Vantagens:
- ✅ **Gratuito** e confiável
- ✅ **Sem servidor** necessário  
- ✅ **Autenticação** via GitHub
- ✅ **Moderação** integrada
- ✅ **SEO friendly**
- ✅ **Mobile responsive**

### Limitações:
- ⚠️ Usuários precisam ter conta GitHub
- ⚠️ Rate limit de 60 requests/hora (sem token)
- ⚠️ Dependente da API do GitHub

## 🚀 Próximos passos

Depois de configurado:

1. **Monitore** as discussões regularmente
2. **Responda** aos comentários dos usuários  
3. **Modere** conteúdo inadequado
4. **Analise** feedback para melhorar extensões
5. **Considere** implementar webhook para notificações

## 🆘 Suporte

Se encontrar problemas:

1. **Verifique** configurações no `GITHUB_CONFIG`
2. **Confira** se Discussions está ativado
3. **Teste** URLs manualmente
4. **Examine** console do navegador para erros
5. **Consulte** documentação do GitHub Discussions

---

**📚 Recursos úteis:**
- [GitHub Discussions Docs](https://docs.github.com/en/discussions)
- [GitHub GraphQL API](https://docs.github.com/en/graphql)
- [GitHub REST API](https://docs.github.com/en/rest)
