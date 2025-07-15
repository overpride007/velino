# Sistema de Comentários e Avalia### 3. Configurar o Sistema

**IMPORTANTE: NUNCA commite seu token diretamente no código!**

Edite o arquivo `script.js` e altere as seguintes linhas:

```javascript
const config = {
    owner: 'overpride007',       // ← Seu usuário do GitHub
    repo: 'velino',              // ← Nome do seu repositório
    token: 'SEU_TOKEN_AQUI'      // ← Seu Personal Access Token
};
```

**Alternativa mais segura:**
1. Copie `.env.example` para `.env`
2. Preencha o arquivo `.env` com seus dados
3. Use uma solução como GitHub Pages ou Netlify para deploysistema completo de comentários e avaliações com estrelas usando GitHub Issues como backend.

## 🚀 Funcionalidades

- ✅ Sistema de comentários com modal otimizado
- ⭐ Avaliação por estrelas (1-5) com animações
- 💡 Sistema de sugestões separado
- 📱 Design responsivo e moderno
- 🔄 Integração com GitHub Issues API
- 🎨 Interface elegante com gradientes e animações

## ⚙️ Configuração Necessária

### 1. Habilitar Issues no GitHub

1. Vá para o seu repositório no GitHub
2. Clique em **Settings** (Configurações)
3. Na seção **General** > **Features**
4. Certifique-se que **Issues** está marcado

### 2. Criar Personal Access Token

1. Vá para **GitHub** > **Settings** > **Developer settings** > **Personal access tokens** > **Tokens (classic)**
2. Clique em **Generate new token (classic)**
3. Dê um nome para o token (ex: "Sistema de Comentários")
4. Selecione as permissões:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `public_repo` (Access public repositories)
5. Clique em **Generate token**
6. **IMPORTANTE**: Copie o token gerado (você não conseguirá vê-lo novamente)

### 3. Configurar o Sistema

Edite o arquivo `script.js` e altere as seguintes linhas:

```javascript
const config = {
    owner: 'seu-usuario',        // ← Seu usuário do GitHub
    repo: 'velino',              // ← Nome do seu repositório
    token: 'SEU_TOKEN_AQUI'      // ← Seu Personal Access Token
};
```

## 📁 Estrutura do Projeto

```
velino/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # JavaScript principal
└── README.md           # Este arquivo
```

## 🎯 Como Usar

1. **Ver Comentários**: Clique em "Ver Comentários" para abrir o modal
2. **Escrever Comentário**: No modal, clique em "Escrever Comentário"
3. **Avaliação**: Clique nas estrelas para selecionar sua avaliação
4. **Enviar**: Preencha os campos e clique em "Enviar Comentário"
5. **Sugestões**: Use o botão "Enviar sua Sugestão" para sugestões

## 🔧 Funcionalidades Técnicas

### Sistema de Comentários
- Modal com barra lateral otimizada
- Navegação entre visualizar e escrever comentários
- Botão "X" para fechar em qualquer momento
- Carregamento automático dos comentários

### Sistema de Avaliação
- 5 estrelas clicáveis
- Animações suaves ao hover e clique
- Feedback visual em tempo real
- Texto descritivo da avaliação

### Integração GitHub Issues
- Comentários salvos como Issues com label "comment"
- Sugestões salvas como Issues com labels "suggestion" e "enhancement"
- Formatação estruturada dos dados
- Tratamento de erros completo

## 🎨 Características do Design

- **Gradientes modernos** em botões e cabeçalhos
- **Animações suaves** para melhor UX
- **Design responsivo** para mobile e desktop
- **Ícones Font Awesome** para visual profissional
- **Scrollbar personalizada** para melhor estética

## 🔍 Estrutura dos Dados

### Comentários
```
Nome: [Nome do usuário]
Idade: [Idade]
Avaliação: [1-5]
Comentário: [Texto do comentário]
```

### Sugestões
```
Nome: [Nome do usuário]
Email: [Email (opcional)]
Sugestão: [Texto da sugestão]
```

## 🚨 Solução de Problemas

### Erro "Configure seu GitHub token primeiro!"
- Verifique se você alterou `SEU_TOKEN_AQUI` no `script.js`

### Erro ao carregar comentários
- Verifique se o `owner` e `repo` estão corretos
- Certifique-se que o repositório existe e é público
- Verifique se as Issues estão habilitadas

### Erro de permissão
- Verifique se o token tem as permissões corretas
- Para repositórios privados, use a permissão `repo`
- Para repositórios públicos, use `public_repo`

## 📱 Responsividade

O sistema é totalmente responsivo e se adapta a:
- 📱 Smartphones (< 480px)
- 📱 Tablets (< 768px)
- 💻 Desktops (> 768px)

## 🔐 Segurança

- **Token de acesso**: Mantenha seu token seguro
- **NUNCA commite** tokens no código fonte
- **Use .env** para variáveis sensíveis em desenvolvimento
- **Validação**: Todos os campos são validados
- **Rate Limiting**: Respeita os limites da API do GitHub

### ⚠️ Aviso Importante
O GitHub detecta automaticamente tokens em commits e bloqueia o push por segurança. Se isso acontecer:
1. Remova o token do código
2. Gere um novo token no GitHub
3. Configure-o localmente sem commitá-lo

## 🎪 Demo

1. Abra `index.html` no navegador
2. Configure as credenciais no `script.js`
3. Teste as funcionalidades!

---

**Desenvolvido com ❤️ usando GitHub Issues API**
