# 🚀 Guia de Instalação Segura

## ⚡ Instalação Rápida

### 1. **Crie o arquivo .env**
```bash
# Copie o arquivo de exemplo
copy .env.example .env
```

Edite o arquivo `.env` com seus dados:
```env
GITHUB_OWNER=overpride007
GITHUB_REPO=velino
GITHUB_TOKEN=seu_token_aqui
PORT=3000
```

### 2. **Instale as dependências**
```bash
npm install
```

### 3. **Execute o servidor**
```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Ou produção
npm start
```

### 4. **Acesse o sistema**
Abra: http://localhost:3000

---

## 🤔 **"Preciso deixar meu PC ligado?"**

### **Para desenvolvimento local:** SIM
- Você precisa rodar `npm start` no seu PC
- Servidor funciona apenas enquanto terminal estiver ativo

### **Para produção online:** NÃO! 🎉
- Use plataformas gratuitas de hospedagem
- Site fica online 24/7 sem seu PC ligado
- Atualizações automáticas do GitHub

**📖 [Ver guia completo de deploy →](DEPLOY_RAILWAY.md)**

---

## 🔐 **Por que essa solução é segura?**

### ❌ **Problema anterior:**
- Token visível no frontend
- Qualquer pessoa pode ver e usar seu token
- Acesso total ao seu GitHub

### ✅ **Solução atual:**
- Token fica no servidor (arquivo `.env`)
- Frontend nunca vê o token
- Apenas APIs específicas são expostas
- Controle total sobre o que pode ser feito

## 📁 **Estrutura dos arquivos:**

```
velino/
├── api/
│   └── comments.js     # Backend seguro (Node.js)
├── index.html          # Frontend
├── styles.css          # Estilos
├── script.js           # JavaScript (SEM token)
├── package.json        # Dependências Node.js
├── .env.example        # Modelo de configuração
├── .env               # Suas configurações (SECRETO)
└── .gitignore         # Protege arquivos sensíveis
```

## 🌐 **Deploy em Produção (GRATUITO):**

### **Opção 1: Railway (Recomendado) 🚂**
**100% Gratuito para projetos pequenos**

1. Acesse: https://railway.app
2. Faça login com GitHub
3. Clique em "New Project" → "Deploy from GitHub repo"
4. Selecione seu repositório `velino`
5. Configure as variáveis de ambiente:
   - `GITHUB_OWNER` = overpride007
   - `GITHUB_REPO` = velino
   - `GITHUB_TOKEN` = seu_token_aqui
   - `PORT` = 3000
6. Deploy automático! 🚀

**URL final:** `https://seu-projeto.up.railway.app`

### **Opção 2: Render 🎨**
**Gratuito para sempre**

1. Acesse: https://render.com
2. Conecte com GitHub
3. "New" → "Web Service" → Selecione repositório
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Adicione Environment Variables
6. Deploy!

### **Opção 3: Heroku 📦**
**Gratuito por 550 horas/mês**

```bash
# Instale Heroku CLI
heroku create seu-app-comentarios
heroku config:set GITHUB_OWNER=overpride007
heroku config:set GITHUB_REPO=velino
heroku config:set GITHUB_TOKEN=seu_token_aqui
git push heroku main
```

### **Opção 4: Vercel (Serverless) ⚡**
**Limitações: Não suporta servidor persistente**
- Melhor para sites estáticos
- Precisaria de adaptações

## ❓ **Resolvendo Problemas:**

### **Erro: "Cannot GET /api/comments"**
- Execute `npm start` para iniciar o servidor

### **Erro: "GITHUB_TOKEN not found"**
- Verifique se o arquivo `.env` existe
- Confirme se o token está correto

### **Comentários não carregam**
- Verifique se o servidor está rodando
- Confirme as configurações no `.env`

## 🔑 **Gerando o Token GitHub:**

1. GitHub → Settings → Developer settings
2. Personal access tokens → Generate new token
3. Marque: `repo` ou `public_repo`
4. Copie o token e cole no `.env`

---

**Agora seu token está 100% seguro! 🔒**
