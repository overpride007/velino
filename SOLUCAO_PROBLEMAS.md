# 🚨 Resolução de Problemas

## 🔥 **ERRO PRINCIPAL: "Unexpected token '<'"**

**📖 [GUIA COMPLETO DETALHADO →](ERRO_UNEXPECTED_TOKEN.md)**

Este é o erro mais comum e tem um guia específico. Principais soluções rápidas:

### ⚡ **Solução Rápida 1: Página de Diagnóstico**
1. Acesse: `https://seu-app.up.railway.app/diagnostico.html`
2. Execute todos os testes
3. Veja onde está falhando

### ⚡ **Solução Rápida 2: Verificar Railway**
1. Railway.app → Seu projeto → Deployments
2. Último deploy deve estar VERDE ✅
3. Se vermelho ❌, veja os logs de erro

### ⚡ **Solução Rápida 3: Variáveis de Ambiente**
No Railway → Variables, confirme:
```
GITHUB_OWNER=overpride007
GITHUB_REPO=velino  
GITHUB_TOKEN=seu_token_real
PORT=3000
```

---

## ❌ **Outros Erros Comuns**
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
