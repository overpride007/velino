let currentExtension = null;

function abrirModalComentarios(extensao) {
    currentExtension = extensao;
    const modal = document.getElementById('comments-modal');
    const overlay = document.getElementById('overlay');
    modal.classList.add('active');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    document.getElementById('modal-title').textContent = `Comentários - ${extensao}`;
    showViewCommentsSection();
    // A chamada de loadComments já está em showViewCommentsSection
}


// Fechar modal de comentários
document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('comments-modal').classList.remove('active');
    document.getElementById('overlay').classList.add('hidden');
    document.body.style.overflow = '';
    document.getElementById('modal-title').textContent = 'Comentários';
});
// Configuração da API (sem token exposto!)
const config = {
    apiBaseUrl: window.location.origin, // Usa a mesma origem do site
    // Token fica seguro no servidor backend
};

// Estado da aplicação
let currentRating = 0;
let commentsCache = [];

// Elementos DOM
const elements = {
    // Botões principais
    viewCommentsBtn: document.getElementById('view-comments-btn'),
    sendSuggestionBtn: document.getElementById('send-suggestion-btn'),
    
    // Modal de comentários
    commentsModal: document.getElementById('comments-modal'),
    closeModal: document.getElementById('close-modal'),
    viewCommentsSection: document.getElementById('view-comments-section'),
    writeCommentSection: document.getElementById('write-comment-section'),
    
    // Modal de sugestões
    suggestionsModal: document.getElementById('suggestions-modal'),
    closeSuggestionsModal: document.getElementById('close-suggestions-modal'),
    
    // Navegação entre seções
    writeCommentBtn: document.getElementById('write-comment-btn'),
    backToComments: document.getElementById('back-to-comments'),
    
    // Formulários
    commentForm: document.getElementById('comment-form'),
    suggestionForm: document.getElementById('suggestion-form'),
    
    // Listas
    commentsList: document.getElementById('comments-list'),
    
    // Sistema de estrelas
    starRating: document.querySelector('.star-rating'),
    ratingText: document.getElementById('rating-text'),
    
    // Overlay
    overlay: document.getElementById('overlay')
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeStarRating();
});

// Event Listeners
function initializeEventListeners() {
    // Botões principais
    if (elements.viewCommentsBtn) {
        elements.viewCommentsBtn.addEventListener('click', openCommentsModal);
    }
    if (elements.sendSuggestionBtn) {
        elements.sendSuggestionBtn.addEventListener('click', openSuggestionsModal);
    }

    // Botões dos cards de extensões
    const btnMangabr = document.getElementById('view-comments-mangabr');
    if (btnMangabr) {
        btnMangabr.addEventListener('click', function() {
            abrirModalComentarios('Manga BR');
        });
    }
    const btnMangaterra = document.getElementById('view-comments-mangaterra');
    if (btnMangaterra) {
        btnMangaterra.addEventListener('click', function() {
            abrirModalComentarios('Manga Terra');
        });
    }

    // Fechamento de modais
    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', closeCommentsModal);
    }
    if (elements.closeSuggestionsModal) {
        elements.closeSuggestionsModal.addEventListener('click', closeSuggestionsModal);
    }
    if (elements.overlay) {
        elements.overlay.addEventListener('click', closeAllModals);
    }

    // Navegação entre seções do modal
    if (elements.writeCommentBtn) {
        elements.writeCommentBtn.addEventListener('click', showWriteCommentSection);
    }
    if (elements.backToComments) {
        elements.backToComments.addEventListener('click', showViewCommentsSection);
    }

    // Formulários
    if (elements.commentForm) {
        elements.commentForm.addEventListener('submit', handleCommentSubmission);
    }
    if (elements.suggestionForm) {
        elements.suggestionForm.addEventListener('submit', handleSuggestionSubmission);
    }

    // Tecla ESC para fechar modais
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Sistema de avaliação por estrelas
function initializeStarRating() {
    const stars = elements.starRating.querySelectorAll('.fas.fa-star');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            currentRating = index + 1;
            updateStarDisplay(currentRating);
            updateRatingText(currentRating);
        });
        
        star.addEventListener('mouseenter', function() {
            updateStarDisplay(index + 1);
        });
    });
    
    elements.starRating.addEventListener('mouseleave', function() {
        updateStarDisplay(currentRating);
    });
}

function updateStarDisplay(rating) {
    const stars = elements.starRating.querySelectorAll('.fas.fa-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function updateRatingText(rating) {
    const texts = {
        0: 'Clique nas estrelas para avaliar',
        1: '⭐ Muito Ruim',
        2: '⭐⭐ Ruim',
        3: '⭐⭐⭐ Regular',
        4: '⭐⭐⭐⭐ Bom',
        5: '⭐⭐⭐⭐⭐ Excelente'
    };
    elements.ratingText.textContent = texts[rating];
}

// Gerenciamento de modais
function openCommentsModal() {
    elements.commentsModal.classList.add('active');
    elements.overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    loadComments();
    showViewCommentsSection();
}

function openSuggestionsModal() {
    elements.suggestionsModal.classList.add('active');
    elements.overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeCommentsModal() {
    elements.commentsModal.classList.remove('active');
    elements.overlay.classList.add('hidden');
    document.body.style.overflow = '';
    resetCommentForm();
}

function closeSuggestionsModal() {
    elements.suggestionsModal.classList.remove('active');
    elements.overlay.classList.add('hidden');
    document.body.style.overflow = '';
    resetSuggestionForm();
}

function closeAllModals() {
    closeCommentsModal();
    closeSuggestionsModal();
}

// Navegação entre seções do modal de comentários
function showWriteCommentSection() {
    elements.viewCommentsSection.classList.add('hidden');
    elements.writeCommentSection.classList.remove('hidden');
    document.getElementById('modal-title').textContent = 'Escrever Comentário';
}

function showViewCommentsSection() {
    elements.writeCommentSection.classList.add('hidden');
    elements.viewCommentsSection.classList.remove('hidden');
    // Mantém o título do modal com o nome da extensão
    // document.getElementById('modal-title').textContent = 'Comentários';
    resetCommentForm();
    // Recarrega os comentários da extensão ao voltar
    loadComments();
}

// Carregamento de comentários
async function loadComments() {
    try {
        elements.commentsList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Carregando comentários...</div>';
        const response = await fetch(`${config.apiBaseUrl}/api/comments`);
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Servidor não está retornando dados JSON válidos.');
        }
        if (!response.ok) {
            throw new Error(`Erro ${response.status}`);
        }
        const issues = await response.json();
        // Filtrar comentários pela extensão selecionada
        let filtered = issues;
        if (currentExtension) {
            filtered = issues.filter(comment => {
                // Busca por 'Extensão: <NOME>' em qualquer parte do campo comment
                return comment.comment && comment.comment.includes(`Extensão: ${currentExtension}`);
            });
        }
        commentsCache = filtered;
        displayComments(filtered, currentExtension);
    } catch (error) {
        elements.commentsList.innerHTML = `<div class='no-comments'><i class='fas fa-exclamation-triangle'></i> Erro ao carregar comentários: ${error.message}</div>`;
    }
}

function displayComments(comments) {
    if (comments.length === 0) {
        elements.commentsList.innerHTML = `
            <div class="no-comments">
                <i class="fas fa-comment-slash"></i>
                <p>Ainda não há comentários.</p>
                <p>Seja o primeiro a comentar!</p>
            </div>
        `;
        return;
    }
    elements.commentsList.innerHTML = '';
    comments.forEach((comment) => {
        const data = parseCommentBody(comment.comment);
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment-item';
        commentDiv.innerHTML = `
            <div class="extension-title" style="font-weight:bold;color:#764ba2;margin-bottom:6px;">
                Extensão: ${data.extension || currentExtension || ''}
            </div>
            <div><strong>Nome:</strong> ${data.name}</div>
            <div><strong>Idade:</strong> ${data.age}</div>
            <div><strong>Avaliação:</strong> ${data.rating}</div>
            <div><strong>Comentário:</strong> ${data.comment}</div>
        `;
        elements.commentsList.appendChild(commentDiv);
    });
}

function parseCommentBody(body) {
    if (!body) return { extension: '', name: '', age: '', rating: 0, comment: '' };
    const data = {
        extension: '',
        name: '',
        age: '',
        rating: 0,
        comment: ''
    };
    const lines = body.split('\n');
    lines.forEach(line => {
        if (line.startsWith('Extensão:')) {
            data.extension = line.replace('Extensão:', '').trim();
        } else if (line.startsWith('Nome:')) {
            data.name = line.replace('Nome:', '').trim();
        } else if (line.startsWith('Idade:')) {
            data.age = line.replace('Idade:', '').trim();
        } else if (line.startsWith('Avaliação:')) {
            data.rating = parseInt(line.replace('Avaliação:', '').trim()) || 0;
        } else if (line.startsWith('comentario:')) {
            data.comment = line.replace('comentario:', '').trim();
        }
    });
    return data;
}

// Função para testar conexão com o servidor
async function testServerConnection() {
    try {
        showAlert('🔍 Testando conexão...', 'info');
        
        console.log('🌐 URL de teste:', `${config.apiBaseUrl}/api/status`);
        
        const response = await fetch(`${config.apiBaseUrl}/api/status`);
        
        console.log('📊 Resposta recebida:', {
            status: response.status,
            ok: response.ok,
            headers: {
                'content-type': response.headers.get('content-type'),
                'server': response.headers.get('server')
            }
        });
        
        // Verificar se a resposta é JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const htmlContent = await response.text();
            console.error('❌ Servidor retornou HTML ao invés de JSON:', htmlContent.substring(0, 300));
            
            // Verificar se é página do Railway
            if (htmlContent.includes('railway') || htmlContent.includes('Railway')) {
                throw new Error('Aplicação não está rodando no Railway. Verifique se o deploy foi bem-sucedido.');
            }
            
            throw new Error('Servidor não está retornando JSON. Possível problema de configuração.');
        }
        
        const status = await response.json();
        console.log('📊 Status do servidor:', status);
        
        let message = `✅ Servidor online!\n\n`;
        message += `🔧 Configurações:\n`;
        message += `• GitHub Owner: ${status.environment.GITHUB_OWNER}\n`;
        message += `• GitHub Repo: ${status.environment.GITHUB_REPO}\n`;
        message += `• GitHub Token: ${status.environment.GITHUB_TOKEN}\n`;
        message += `• Porta: ${status.environment.PORT}`;
        
        // Verificar se as configurações estão corretas
        const missingConfigs = [];
        if (status.environment.GITHUB_OWNER === 'NÃO CONFIGURADO') missingConfigs.push('GITHUB_OWNER');
        if (status.environment.GITHUB_REPO === 'NÃO CONFIGURADO') missingConfigs.push('GITHUB_REPO');
        if (status.environment.GITHUB_TOKEN === 'NÃO CONFIGURADO') missingConfigs.push('GITHUB_TOKEN');
        
        if (missingConfigs.length > 0) {
            message += `\n\n⚠️ ATENÇÃO: Variáveis não configuradas:\n• ${missingConfigs.join('\n• ')}`;
            showAlert(message, 'warning');
        } else {
            showAlert(message, 'success');
            
            // Tentar carregar comentários novamente
            setTimeout(() => {
                loadComments();
            }, 2000);
        }
        
    } catch (error) {
        console.error('❌ Erro no teste de conexão:', error);
        
        let errorMessage = error.message;
        
        // Melhorar diagnóstico de erros
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = `Não foi possível conectar ao servidor.\n\nPossíveis causas:\n• Railway está offline\n• URL incorreta: ${config.apiBaseUrl}\n• Aplicação não foi deployada corretamente`;
        } else if (error.message.includes('Unexpected token')) {
            errorMessage = `Servidor retornou HTML ao invés de JSON.\n\nPossíveis causas:\n• Aplicação não está rodando no Railway\n• Erro de configuração no servidor\n• URL do Railway incorreta`;
        }
        
        showAlert(`❌ Falha na conexão:\n\n${errorMessage}`, 'error');
    }
}

function createCommentElement(data, originalIssue) {
    console.log('🎨 Creating comment element:', data);
    
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment-item';
    
    const stars = generateStarRating(data.rating);
    const date = new Date(originalIssue.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Garantir que há texto para mostrar
    const commentText = data.comment || 'Sem comentário';
    
    commentDiv.innerHTML = `
        <div class="comment-header">
            <div class="comment-author">${data.name}</div>
            <div class="comment-meta">
                ${data.age ? `${data.age} anos • ` : ''}${date}
            </div>
        </div>
        ${data.rating > 0 ? `<div class="comment-rating">${stars}</div>` : ''}
        <div class="comment-text">${commentText}</div>
    `;
    
    console.log('✅ Comment element created');
    return commentDiv;
}

function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star active"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Submissão de comentários
async function handleCommentSubmission(e) {
    e.preventDefault();
    if (currentRating === 0) {
        showAlert('⭐ Por favor, selecione uma avaliação!', 'warning');
        return;
    }
    const nome = document.getElementById('username').value.trim();
    const idade = document.getElementById('age').value.trim();
    let comentario = document.getElementById('comment-text').value.trim();

    // Remove campos do sistema do texto do usuário
    comentario = comentario
        .split('\n')
        .filter(line =>
            !/^Extensão:/i.test(line) &&
            !/^Nome:/i.test(line) &&
            !/^Idade:/i.test(line) &&
            !/^Avaliação:/i.test(line) &&
            !/^comentario:/i.test(line)
        )
        .join('\n')
        .trim();

    const commentData = {
        extension: currentExtension,
        name: nome,
        age: idade,
        rating: currentRating,
        comment: comentario
    };
    try {
        await submitComment(commentData);
        showAlert('✅ Comentário enviado com sucesso!', 'success');
        document.getElementById('comment-text').value = '';
        showViewCommentsSection();
        loadComments();
    } catch (error) {
        showAlert(`❌ Erro ao enviar comentário: ${error.message}`, 'error');
    }
}

async function submitComment(data) {
    try {
        console.log('📤 Enviando comentário:', data);
        
        const response = await fetch(`${config.apiBaseUrl}/api/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        console.log('📊 Status da resposta:', response.status);
        
        // Verificar se a resposta é JSON válido
        const contentType = response.headers.get('content-type');
        console.log('📋 Content-Type:', contentType);
        
        if (!response.ok) {
            let errorMessage = `Erro ${response.status}`;
            
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.error || errorData.message || errorMessage;
                if (errorData.details) {
                    errorMessage += ` - ${errorData.details}`;
                }
            } else {
                // Se não é JSON, provavelmente é HTML (página de erro)
                const errorText = await response.text();
                console.error('❌ Resposta não-JSON:', errorText.substring(0, 200));
                errorMessage = 'Servidor não está respondendo corretamente. Verifique se está online no Railway.';
            }
            
            throw new Error(errorMessage);
        }
        
        const result = await response.json();
        console.log('✅ Comentário enviado com sucesso!');
        return result;
        
    } catch (error) {
        console.error('❌ Erro detalhado:', error);
        
        // Verificar se é erro de conexão
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Não foi possível conectar ao servidor. Verifique se o Railway está online.');
        }
        
        throw error;
    }
}

// Submissão de sugestões
async function handleSuggestionSubmission(e) {
    e.preventDefault();
    
    const suggestionData = {
        name: document.getElementById('suggestion-name').value,
        email: document.getElementById('suggestion-email').value,
        suggestion: document.getElementById('suggestion-text').value
    };
    
    try {
        await submitSuggestion(suggestionData);
        showAlert('✅ Sugestão enviada com sucesso!', 'success');
        closeSuggestionsModal();
    } catch (error) {
        console.error('Erro ao enviar sugestão:', error);
        showAlert(`❌ Erro ao enviar sugestão: ${error.message}`, 'error');
    }
}

async function submitSuggestion(data) {
    const response = await fetch(`${config.apiBaseUrl}/api/suggestions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}`);
    }
    
    return response.json();
}

// Utilitários
function resetCommentForm() {
    elements.commentForm.reset();
    currentRating = 0;
    updateStarDisplay(0);
    updateRatingText(0);
}

function resetSuggestionForm() {
    elements.suggestionForm.reset();
}

function showAlert(message, type = 'info') {
    // Remover alertas existentes
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `custom-alert alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <span class="alert-message">${message}</span>
            <button class="alert-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

// CSS para alertas (adicionado dinamicamente)
const alertStyles = `
<style>
.custom-alert {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    max-width: 400px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    animation: slideInRight 0.3s ease;
}

.alert-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    gap: 1rem;
}

.alert-success { background: linear-gradient(45deg, #28a745, #20c997); color: white; }
.alert-warning { background: linear-gradient(45deg, #ffc107, #fd7e14); color: #212529; }
.alert-error { background: linear-gradient(45deg, #dc3545, #e83e8c); color: white; }
.alert-info { background: linear-gradient(45deg, #17a2b8, #6f42c1); color: white; }

.alert-message {
    flex: 1;
    font-weight: 500;
}

.alert-close {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font-size: 1rem;
    padding: 0;
    opacity: 0.7;
    transition: opacity 0.3s ease;
}

.alert-close:hover {
    opacity: 1;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
</style>
`;

// Adicionar estilos de alerta ao documento
document.head.insertAdjacentHTML('beforeend', alertStyles);

// Função de debug para verificar dados
function showDebugInfo() {
    let debugInfo = `🔍 INFORMAÇÕES DE DEBUG:\n\n`;
    debugInfo += `📍 URL Base: ${config.apiBaseUrl}\n`;
    debugInfo += `🗂️ Cache de comentários: ${commentsCache.length} items\n\n`;
    
    if (commentsCache.length > 0) {
        debugInfo += `📝 Primeiro comentário:\n`;
        debugInfo += JSON.stringify(commentsCache[0], null, 2);
    }
    
    console.log(debugInfo);
    showAlert(debugInfo, 'info');
}
