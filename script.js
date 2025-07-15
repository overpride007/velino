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
    elements.viewCommentsBtn.addEventListener('click', openCommentsModal);
    elements.sendSuggestionBtn.addEventListener('click', openSuggestionsModal);
    
    // Fechamento de modais
    elements.closeModal.addEventListener('click', closeCommentsModal);
    elements.closeSuggestionsModal.addEventListener('click', closeSuggestionsModal);
    elements.overlay.addEventListener('click', closeAllModals);
    
    // Navegação entre seções do modal
    elements.writeCommentBtn.addEventListener('click', showWriteCommentSection);
    elements.backToComments.addEventListener('click', showViewCommentsSection);
    
    // Formulários
    elements.commentForm.addEventListener('submit', handleCommentSubmission);
    elements.suggestionForm.addEventListener('submit', handleSuggestionSubmission);
    
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
    document.getElementById('modal-title').textContent = 'Comentários';
    resetCommentForm();
}

// Carregamento de comentários
async function loadComments() {
    try {
        elements.commentsList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Carregando comentários...</div>';
        
        const response = await fetch(`${config.apiBaseUrl}/api/comments`);
        
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const issues = await response.json();
        commentsCache = issues;
        displayComments(issues);
        
    } catch (error) {
        console.error('Erro ao carregar comentários:', error);
        elements.commentsList.innerHTML = `
            <div class="no-comments">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erro ao carregar comentários: ${error.message}</p>
                <p>Verifique se o servidor está rodando.</p>
            </div>
        `;
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
    
    comments.forEach(comment => {
        const commentData = parseCommentBody(comment.body);
        const commentElement = createCommentElement(commentData, comment);
        elements.commentsList.appendChild(commentElement);
    });
}

function parseCommentBody(body) {
    const lines = body.split('\n');
    const data = {
        name: 'Usuário',
        age: '',
        rating: 0,
        comment: body
    };
    
    // Tentar extrair dados estruturados do comentário
    lines.forEach(line => {
        if (line.startsWith('Nome:')) {
            data.name = line.replace('Nome:', '').trim();
        } else if (line.startsWith('Idade:')) {
            data.age = line.replace('Idade:', '').trim();
        } else if (line.startsWith('Avaliação:')) {
            data.rating = parseInt(line.replace('Avaliação:', '').trim()) || 0;
        } else if (line.startsWith('Comentário:')) {
            data.comment = lines.slice(lines.indexOf(line) + 1).join('\n').trim();
        }
    });
    
    return data;
}

function createCommentElement(data, originalIssue) {
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
    
    commentDiv.innerHTML = `
        <div class="comment-header">
            <div class="comment-author">${data.name}</div>
            <div class="comment-meta">
                ${data.age ? `${data.age} anos • ` : ''}${date}
            </div>
        </div>
        ${data.rating > 0 ? `<div class="comment-rating">${stars}</div>` : ''}
        <div class="comment-text">${data.comment}</div>
    `;
    
    return commentDiv;
}

function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
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
    
    const commentData = {
        name: document.getElementById('username').value,
        age: document.getElementById('age').value,
        rating: currentRating,
        comment: document.getElementById('comment-text').value
    };
    
    try {
        await submitComment(commentData);
        showAlert('✅ Comentário enviado com sucesso!', 'success');
        showViewCommentsSection();
        loadComments();
    } catch (error) {
        console.error('Erro ao enviar comentário:', error);
        showAlert(`❌ Erro ao enviar comentário: ${error.message}`, 'error');
    }
}

async function submitComment(data) {
    const response = await fetch(`${config.apiBaseUrl}/api/comments`, {
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
