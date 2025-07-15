# 🚨 Resolução de Problemas

## ❌ **Erro: "Unexpected token '<'"**

Esse erro significa que o servidor está retornando HTML em vez de JSON. Principais causas:

### 🔍 **1. Verificar se o Railway está online**
- Acesse seu dashboard do Railway
- Verifique se o deploy foi bem-sucedido
- Olhe os logs na aba "Deployments"

### 🔧 **2. Verificar variáveis de ambiente**
No Railway, vá em **Variables** e confirme:
```
GITHUB_OWNER=overpride007
GITHUB_REPO=velino  
GITHUB_TOKEN=seu_token_real
PORT=3000
```

### 🔑 **3. Verificar o token GitHub**
- Token deve ter permissões `repo` ou `public_repo`
- Token não pode estar expirado
- Gere um novo se necessário

### 📊 **4. Verificar logs do Railway**
No Railway:
1. Vá para seu projeto
2. Clique em "Deployments"
3. Veja os logs para erros

### 🧪 **5. Testar localmente**
```bash
# Teste local primeiro
npm install
npm start
# Acesse http://localhost:3000
```

### ⚡ **6. Usar botão de diagnóstico**
- Clique em "Ver Comentários"
- Se der erro, clique em "Testar Conexão"
- Veja o resultado do diagnóstico

## 📋 **Checklist de verificação:**

- [ ] Railway está online (sem erro 500)
- [ ] Variáveis de ambiente configuradas
- [ ] Token GitHub válido e não expirado
- [ ] Issues habilitadas no repositório
- [ ] Repositório público ou token com permissão `repo`

## 🔧 **Soluções rápidas:**

### **Erro 500 - Internal Server Error**
- Verifique as variáveis de ambiente
- Regenere o token GitHub
- Redeploy no Railway

### **Erro 404 - Not Found**
- URL do Railway está correta?
- Projeto foi deployado com sucesso?

### **Erro 401 - Unauthorized**
- Token GitHub inválido
- Token sem permissões necessárias

### **Erro 403 - Forbidden**
- Issues não habilitadas no repositório
- Token sem acesso ao repositório

## 💡 **Dicas adicionais:**

1. **Sempre teste localmente primeiro**
2. **Use o console do navegador (F12) para ver erros detalhados**
3. **Verifique os logs do Railway regularmente**
4. **Mantenha o token GitHub seguro e atualizado**

---

**🚀 Se ainda tiver problemas, verifique o console do navegador (F12) para mais detalhes!**
