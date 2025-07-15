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

## 🌐 **Deploy em Produção:**

### **Opção 1: Railway**
1. Conecte seu repositório
2. Configure as variáveis de ambiente
3. Deploy automático

### **Opção 2: Heroku**
1. `heroku create seu-app`
2. `heroku config:set GITHUB_TOKEN=seu_token`
3. `git push heroku main`

### **Opção 3: Vercel**
1. Conecte repositório
2. Configure environment variables
3. Deploy automático

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
