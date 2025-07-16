document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://overpridex.up.railway.app';
    
    // Sistema de estrelas
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', function() {
            const value = parseInt(this.dataset.value);
            const container = this.parentElement; // .star-rating
            container.querySelectorAll('.star').forEach((s, i) => {
                if (i < value) {
                    s.textContent = '★';
                    s.classList.add('text-yellow-400');
                    s.classList.remove('text-yellow-400');
                } else {
                    s.textContent = '☆';
                    s.classList.remove('text-yellow-400');
                    s.classList.add('text-yellow-400');
                }
            });
            container.querySelector('.rating-value').value = value;
        });
    });
    
    // Botão "Ver Comentários"
    document.querySelectorAll('.show-comments-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const wrapper = btn.closest('[data-extension-id]');
            const extensionId = wrapper.getAttribute('data-extension-id');
            wrapper.querySelector('.comments-card').classList.remove('hidden');
            await loadComments(extensionId);
        });
    });
    
    // Botão "✕" para fechar comentários
    document.querySelectorAll('.hide-comments-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const wrapper = btn.closest('[data-extension-id]');
            wrapper.querySelector('.comments-card').classList.add('hidden');
        });
    });
    
    // Botão "Escrever Comentário"
    document.querySelectorAll('.write-comment-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const wrapper = btn.closest('[data-extension-id]');
            wrapper.querySelector('.comment-form').classList.remove('hidden');
            wrapper.querySelector('.comments-card').classList.add('hidden');
        });
    });
    
    // Botão "✕" para voltar aos comentários
    document.querySelectorAll('.cancel-comment-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const wrapper = btn.closest('[data-extension-id]');
            wrapper.querySelector('.comment-form').classList.add('hidden');
            wrapper.querySelector('.comments-card').classList.remove('hidden');
        });
    });
    
    // Envio de formulário
    document.querySelectorAll('.comment-form form').forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const wrapper = form.closest('[data-extension-id]');
            const extensionId = wrapper.getAttribute('data-extension-id');
            const username = this.querySelector('.username-input').value;
            const rating = this.querySelector('.rating-value').value;
            const comment = this.querySelector('.comment-input').value;
            try {
                const response = await fetch(`${API_URL}/api/comment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ extensionId, username, rating, comment })
                });
                const data = await response.json();
                if (data.success) {
                    this.reset();
                    this.querySelectorAll('.star').forEach(s => {
                        s.textContent = '☆';
                        s.classList.add('text-gray-500');
                        s.classList.remove('text-yellow-400');
                    });
                    wrapper.querySelector('.comment-form').classList.add('hidden');
                    wrapper.querySelector('.comments-card').classList.remove('hidden');
                    await loadComments(extensionId);
                }
            } catch (error) {
                alert('Erro ao enviar comentário: ' + error.message);
            }
        });
    });
    
    // Função para carregar comentários
    async function loadComments(extensionId) {
        try {
            const response = await fetch(`${API_URL}/api/comments`);
            const { data } = await response.json();
            const filtered = data.filter(comment => 
                comment.body.includes(`<!-- EXTENSION:${extensionId} -->`)
            );
            const wrapper = document.querySelector(`[data-extension-id="${extensionId}"]`);
            const container = wrapper.querySelector('.comments-list');
            container.innerHTML = filtered.map(comment => {
                const [meta, userLine, ratingLine, ...commentLines] = comment.body.split('\n');
                const username = userLine?.replace('**Usuário:**', '').trim() || 'Anônimo';
                const rating = ratingLine?.replace('**Avaliação:**', '').trim() || '0';
                const commentText = commentLines.join(' ').replace('**Comentário:**', '').trim();
                const date = new Date(comment.created_at).toLocaleDateString();
                return `
                    <div class="comment p-4 bg-gray-800 rounded-lg">
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="font-bold text-yellow-300">${username}</h4>
                            <div class="flex text-yellow-400">${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</div>
                        </div>
                        <p class="text-gray-300 mb-2">${commentText}</p>
                        <small class="text-gray-500">${date}</small>
                    </div>
                `;
            }).join('') || '<p class="text-gray-400 text-center py-4">Nenhum comentário ainda. Seja o primeiro!</p>';
            // Atualiza contador
            const countSpan = wrapper.querySelector('.comments-count');
            if (countSpan) countSpan.textContent = `(${filtered.length})`;
        } catch (error) {
            const wrapper = document.querySelector(`[data-extension-id="${extensionId}"]`);
            const container = wrapper ? wrapper.querySelector('.comments-list') : null;
            if (container) container.innerHTML = '<p class="text-red-400">Erro ao carregar comentários</p>';
        }
    }
});