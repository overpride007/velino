# Sistema de Comentários e Avaliações - Velino

## 🚀 Configuração Completa

### 📁 Arquivos Criados:
- `index.html` - Interface principal (renomeado de comentarios.html)
- `.github/workflows/comments.yml` - GitHub Actions para processar comentários
- `api/comments.php` - Backend para receber comentários
- `api/load-comments.php` - Backend para carregar comentários

### 🔧 Próximos Passos para Ativação:

#### 1. **Configurar o Token no GitHub (IMPORTANTE!)**
1. Vá para: `https://github.com/overpride007/velino/settings/secrets/actions`
2. Clique em **"New repository secret"**
3. Nome: `TOKEN_CLASSIC`
4. Valor: Cole seu novo token
5. Clique em **"Add secret"**

#### 2. **Fazer Upload dos Arquivos**
```bash
git add .
git commit -m "Adicionar sistema de comentários com GitHub Discussions"
git push origin main
```

#### 3. **Configurar GitHub Pages**
1. Vá para: `https://github.com/overpride007/velino/settings/pages`
2. Em **Source**, selecione: **"Deploy from a branch"**
3. Em **Branch**, selecione: **"main"**
4. Clique em **"Save"**

#### 4. **Hospedar PHP (Para produção)**
Para que o sistema funcione completamente, você precisa hospedar os arquivos PHP em um servidor que suporte PHP. Opções:

**Gratuitas:**
- Vercel (com Vercel Functions)
- Netlify (com Netlify Functions)
- Railway.app
- Heroku (plano gratuito)

**Configuração no servidor:**
- Definir variável de ambiente: `TOKEN_CLASSIC=seu_token_aqui`

### 🧪 Testando o Sistema:

#### **Modo Desenvolvimento (sem servidor PHP):**
- Abra `index.html` localmente
- Os comentários mostrarão exemplos
- Formulários simularão envio

#### **Modo Produção (com servidor PHP):**
- Upload para servidor com PHP
- Configurar variável `GITHUB_TOKEN`
- Sistema funcionará completamente

### 🔒 Segurança:
- ✅ Token nunca exposto no frontend
- ✅ Processamento via GitHub Actions
- ✅ Validação de dados no backend
- ✅ CORS configurado corretamente

### 📱 Funcionalidades:
- ✅ Sistema de estrelas interativo (1-5)
- ✅ Comentários com nome de usuário
- ✅ Sugestões separadas
- ✅ Interface responsiva
- ✅ Animações suaves
- ✅ Integração real com GitHub Discussions

### 🎯 URLs das Discussions:
- **Comentários:** https://github.com/overpride007/velino/discussions/1
- **Sugestões:** https://github.com/overpride007/velino/discussions/2

### 🚨 Lembrete de Segurança:
- NUNCA compartilhe seu token publicamente
- Use sempre variáveis de ambiente em produção
- Mantenha o token seguro no GitHub Secrets

---

**Status:** ✅ Pronto para uso!
**Próximo passo:** Configurar o token no GitHub Secrets e fazer deploy!
