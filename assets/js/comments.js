document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://overpridex.up.railway.app';
    
    // Sistema de estrelas
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', function() {
            const value = parseInt(this.dataset.value);
            const container = this.closest('.rating-stars');
            
            // Atualiza visual das estrelas
            container.querySelectorAll('.star').forEach((s, i) => {
                s.textContent = i < value ? '★' : '☆';
                s.classList.toggle('text-yellow-400', i < value);
                s.classList.toggle('text-gray-500', i >= value);
            });
            
            // Atualiza valor escondido
            container.querySelector('.rating-value').value = value;
        });
    });
    
    // Botão "Ver Comentários"
    document.querySelectorAll('.show-comments-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const card = this.closest('.extension-card');
            const extensionId = card.dataset.extensionId;
            
            // Mostra card de comentários
            card.querySelector('.comments-container').classList.remove('hidden');
            
            // Esconde conteúdo normal
            card.querySelector('.card-content').classList.add('hidden');
            
            // Carrega comentários
            await loadComments(extensionId);
        });
    });
    
    // Botão "✕" para fechar comentários
    document.querySelectorAll('.close-comments-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.extension-card');
            
            // Restaura card normal
            card.querySelector('.card-content').classList.remove('hidden');
            card.querySelector('.comments-container').classList.add('hidden');
        });
    });
    
    // Botão "Escrever Comentário"
    document.querySelectorAll('.write-comment-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.extension-card');
            
            // Mostra formulário
            card.querySelector('.comment-form').classList.remove('hidden');
            
            // Esconde lista de comentários
            card.querySelector('.comments-container').classList.add('hidden');
        });
    });
    
    // Botão "✕" para voltar aos comentários
    document.querySelectorAll('.back-to-comments-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.extension-card');
            
            // Mostra lista de comentários
            card.querySelector('.comments-container').classList.remove('hidden');
            
            // Esconde formulário
            card.querySelector('.comment-form').classList.add('hidden');
        });
    });
    
    // Envio de formulário
    document.querySelectorAll('.comment-form form').forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const card = this.closest('.extension-card');
            const extensionId = card.dataset.extensionId;
            const username = this.querySelector('.username-input').value;
            const rating = this.querySelector('.rating-value').value;
            const comment = this.querySelector('textarea').value;
            
            try {
                const response = await fetch(`${API_URL}/api/comment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ extensionId, username, rating, comment })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Limpa formulário
                    this.reset();
                    this.querySelectorAll('.star').forEach(s => {
                        s.textContent = '☆';
                        s.classList.add('text-gray-500');
                        s.classList.remove('text-yellow-400');
                    });
                    
                    // Volta para lista de comentários
                    card.querySelector('.back-to-comments-btn').click();
                    
                    // Recarrega comentários
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
            
            const container = document.querySelector(
                `.extension-card[data-extension-id="${extensionId}"] .comments-list`
            );
            
            container.innerHTML = filtered.map(comment => {
                const [meta, userLine, ratingLine, ...commentLines] = comment.body.split('\n');
                const username = userLine.replace('**Usuário:**', '').trim();
                const rating = ratingLine.replace('**Avaliação:**', '').trim();
                const commentText = commentLines.join(' ').replace('**Comentário:**', '').trim();
                const date = new Date(comment.created_at).toLocaleDateString();
                
                return `
                    <div class="comment p-4 bg-gray-800 rounded-lg">
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="font-bold text-yellow-300">${username}</h4>
                            <div class="flex text-yellow-400">${rating}</div>
                        </div>
                        <p class="text-gray-300 mb-2">${commentText}</p>
                        <small class="text-gray-500">${date}</small>
                    </div>
                `;
            }).join('') || '<p class="text-gray-400 text-center py-4">Nenhum comentário ainda. Seja o primeiro!</p>';
        } catch (error) {
            console.error('Erro ao carregar comentários:', error);
            container.innerHTML = '<p class="text-red-400">Erro ao carregar comentários</p>';
        }
    }
});