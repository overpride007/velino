# 🚀 Sistema de Redirecionamento Automático - Velino Extensions

## 📋 Como Funciona

Este sistema permite acesso automático à página online através de um arquivo local que redireciona com autenticação.

## 📁 Arquivos Criados

### 1. `redirect.html` (Arquivo Local)
- **Função:** Redirecionador automático
- **Localização:** Seu computador local
- **Uso:** Abrir este arquivo para acessar o site

### 2. `index.html` (Arquivo Online)
- **Função:** Site principal com proteção
- **Localização:** https://overpridex.pages.dev
- **Uso:** Recebe a autenticação automática

## 🔧 Configuração

### Chave de Acesso Configurada:
```
d#Di2^kV8@iwlhY2rIl!eAELLNrFy%HIH@6hins!9usIc7oW#i
```

### URL de Destino:
```
https://overpridex.pages.dev
```

## 🔄 Fluxo de Funcionamento

1. **Abrir arquivo local:** `redirect.html`
2. **Redirecionamento automático:** Para `overpridx.pages.dev`
3. **Passagem da chave:** Via parâmetros da URL
4. **Autenticação automática:** Site valida e libera acesso
5. **Limpeza da URL:** Remove parâmetros de segurança

## 📊 Parâmetros da URL

O redirecionamento usa estes parâmetros:

```
https://overpridex.pages.dev?access_key=CHAVE_CODIFICADA&auto_auth=true&timestamp=TIMESTAMP
```

### Parâmetros:
- `access_key`: Chave de acesso codificada
- `auto_auth`: Ativa autenticação automática
- `timestamp`: Evita cache de URL

## 🛠️ Como Usar

### Método 1: Redirecionamento Automático
1. Abra o arquivo `redirect.html` no navegador
2. Aguarde 3 segundos (contador regressivo)
3. Será redirecionado automaticamente
4. Acesso liberado instantaneamente

### Método 2: Link Manual
1. Se o redirecionamento falhar
2. Clique no botão "Ir Manualmente"
3. Mesmo resultado, mas manual

### Método 3: Acesso Direto
1. Vá diretamente para `overpridex.pages.dev`
2. Digite a chave manualmente
3. Acesso normal com tela de login

## 🔐 Funcionalidades de Segurança

### No Arquivo Local (`redirect.html`):
- ✅ Codificação automática da chave
- ✅ Timestamp para evitar cache
- ✅ Fallback em caso de erro
- ✅ Interface visual amigável

### No Site Online (`index.html`):
- ✅ Validação automática de parâmetros URL
- ✅ Limpeza automática da URL após auth
- ✅ Notificação de acesso automático
- ✅ Fallback para login manual
- ✅ Sessão persistente (24h)

## 📱 Compatibilidade

- ✅ **Desktop:** Chrome, Firefox, Edge, Safari
- ✅ **Mobile:** Todos os navegadores móveis
- ✅ **Local:** Arquivo HTML local funciona
- ✅ **Online:** Site hospedado funciona
- ✅ **Offline:** Funciona localmente

## 🎯 Vantagens do Sistema

1. **Acesso Rápido:** Um clique e acesso instantâneo
2. **Segurança:** Chave não fica exposta na URL final
3. **Usabilidade:** Interface amigável e responsiva
4. **Flexibilidade:** Múltiplas formas de acesso
5. **Persistência:** Sessão salva por 24 horas

## ⚠️ Observações

- O arquivo `redirect.html` deve estar no seu computador
- O arquivo `index.html` deve estar em `overpridex.pages.dev`
- A chave é a mesma para ambos os arquivos
- URLs são limpas automaticamente após autenticação

## 🚀 Pronto para Usar!

Agora você tem um sistema completo de redirecionamento automático com autenticação integrada!
