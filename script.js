// Sistema de comentários para o card Manhastro
// Adaptado do template já existente

const config = {
    apiBaseUrl: 'https://overpridex.up.railway.app/api',
};

let currentRating = 0;

const elements = {
    viewCommentsBtn: document.getElementById('view-comments-btn'),
    commentsModal: document.getElementById('comments-modal'),
    closeModal: document.getElementById('close-modal'),
    viewCommentsSection: document.getElementById('view-comments-section'),
    writeCommentSection: document.getElementById('write-comment-section'),
    writeCommentBtn: document.getElementById('write-comment-btn'),
    backToComments: document.getElementById('back-to-comments'),
    commentForm: document.getElementById('comment-form'),
    commentsList: document.getElementById('comments-list'),
    starRating: document.querySelector('.star-rating'),
    ratingText: document.getElementById('rating-text'),
    overlay: document.getElementById('overlay'),
};

document.addEventListener('DOMContentLoaded', function() {
    if (elements.viewCommentsBtn) {
        elements.viewCommentsBtn.addEventListener('click', openCommentsModal);
    }
    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', closeCommentsModal);
    }
    if (elements.overlay) {
        elements.overlay.addEventListener('click', closeCommentsModal);
    }
    if (elements.writeCommentBtn) {
        elements.writeCommentBtn.addEventListener('click', showWriteCommentSection);
    }
    if (elements.backToComments) {
        elements.backToComments.addEventListener('click', showViewCommentsSection);
    }
    if (elements.commentForm) {
        elements.commentForm.addEventListener('submit', handleCommentSubmission);
    }
    initializeStarRating();
});

function openCommentsModal() {
    elements.commentsModal.classList.add('active');
    elements.overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    loadComments();
    showViewCommentsSection();
}

function closeCommentsModal() {
    elements.commentsModal.classList.remove('active');
    elements.overlay.classList.add('hidden');
    document.body.style.overflow = '';
    resetCommentForm();
}

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

function initializeStarRating() {
    const stars = elements.starRating.querySelectorAll('.fas.fa-star');
    stars.forEach((star, index) => {
        star.addEventListener('mouseenter', () => updateStarDisplay(index + 1));
        star.addEventListener('click', () => {
            currentRating = index + 1;
            updateStarDisplay(currentRating);
            updateRatingText(currentRating);
        });
    });
    elements.starRating.addEventListener('mouseleave', () => updateStarDisplay(currentRating));
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

async function loadComments() {
    elements.commentsList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Carregando comentários...</div>';
    try {
        const res = await fetch(`${config.apiBaseUrl}/comments`);
        const comments = await res.json();
        displayComments(comments);
    } catch (e) {
        elements.commentsList.innerHTML = '<div class="loading">Erro ao carregar comentários.</div>';
    }
}

function displayComments(comments) {
    if (!Array.isArray(comments) || comments.length === 0) {
        elements.commentsList.innerHTML = '<div class="no-comments">Nenhum comentário ainda.</div>';
        return;
    }
    elements.commentsList.innerHTML = '';
    comments.forEach(comment => {
        const data = parseCommentBody(comment.body);
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment-item';
        commentDiv.innerHTML = `
            <div class="comment-header">
                <div class="comment-author">${data.name}</div>
                <div class="comment-meta">${data.age ? `${data.age} anos • ` : ''}${new Date(comment.created_at).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</div>
            </div>
            ${data.rating > 0 ? `<div class="comment-rating">${generateStarRating(data.rating)}</div>` : ''}
            <div class="comment-text">${data.comment || 'Sem comentário'}</div>
        `;
        elements.commentsList.appendChild(commentDiv);
    });
}

function parseCommentBody(body) {
    const lines = body.split('\n');
    const data = { name: 'Usuário', age: '', rating: 0, comment: '' };
    lines.forEach(line => {
        if (line.startsWith('Nome:')) data.name = line.replace('Nome:', '').trim();
        else if (line.startsWith('Idade:')) data.age = line.replace('Idade:', '').trim();
        else if (line.startsWith('Avaliação:')) data.rating = parseInt(line.replace('Avaliação:', '').trim());
        else if (line.startsWith('Comentário:')) data.comment = line.replace('Comentário:', '').trim();
    });
    if (!data.comment) data.comment = body;
    return data;
}

function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star${i <= rating ? ' active' : ''}"></i>`;
    }
    return stars;
}

async function handleCommentSubmission(e) {
    e.preventDefault();
    if (currentRating === 0) {
        alert('Por favor, selecione uma avaliação.');
        return;
    }
    const commentData = {
        name: document.getElementById('username').value,
        age: document.getElementById('age').value,
        rating: currentRating,
        comment: document.getElementById('comment-text').value
    };
    try {
        const res = await fetch(`${config.apiBaseUrl}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commentData)
        });
        if (!res.ok) throw new Error('Erro ao enviar comentário');
        loadComments();
        showViewCommentsSection();
        resetCommentForm();
        alert('Comentário enviado com sucesso!');
    } catch (e) {
        alert('Erro ao enviar comentário.');
    }
}

function resetCommentForm() {
    if (elements.commentForm) elements.commentForm.reset();
    currentRating = 0;
    updateStarDisplay(0);
    updateRatingText(0);
}
