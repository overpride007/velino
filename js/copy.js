/**
 * Sistema de cópia para o site
 * Inclui funcionalidades para:
 * - Copiar nome das obras ao clicar nos cards
 * - Copiar link do repositório manual
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas as funcionalidades de cópia
    initCopyCards();
    initCopyRepoButton();
    // Removido: initCopyPixButton();
});

/**
 * Inicializa a funcionalidade de copiar ao clicar nos cards
 */
function initCopyCards() {
    let pressTimer;
    const longPressDuration = 600;
    
    document.querySelectorAll('.copy-card').forEach(card => {
        // Clique normal
        card.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || 
                e.target.classList.contains('absolute') || 
                e.target.classList.contains('copy-overlay') || 
                e.target.classList.contains('feedback-message')) return;
                
            const title = this.querySelector('h3').textContent;
            copyToClipboard(title, this);
        });
        
        // Toque longo (mobile)
        card.addEventListener('touchstart', function(e) {
            if (e.target.tagName === 'A' || e.target.classList.contains('absolute')) return;
            
            pressTimer = setTimeout(() => {
                const title = this.querySelector('h3');
                const range = document.createRange();
                range.selectNodeContents(title);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                showFeedback(this.querySelector('.copy-overlay'), false);
                e.preventDefault();
            }, longPressDuration);
        });
        
        card.addEventListener('touchend', function() { clearTimeout(pressTimer); });
        card.addEventListener('touchmove', function() { clearTimeout(pressTimer); });
    });
}

/**
 * Inicializa o botão de copiar link do repositório manual
 */
function initCopyRepoButton() {
    const btn = document.getElementById('copyRepoManualBtn');
    const input = document.getElementById('repoManualLink');
    const copied = document.getElementById('repoManualCopied');
    
    if (btn && input && copied) {
        btn.onclick = function() {
            input.select();
            input.setSelectionRange(0, 99999);
            
            copyTextToClipboard(input.value)
                .then(() => {
                    copied.style.display = 'inline';
                    setTimeout(function(){ copied.style.display = 'none'; }, 1500);
                });
        };
    }
}

/**
 * Inicializa o botão de copiar chave PIX
 */
function initCopyPixButton() {
    const pixButton = document.getElementById('pixButton');
    if (pixButton) {
        pixButton.addEventListener('click', copiarPix);
    }
}

/**
 * Função para copiar a chave PIX
 */
function copiarPix() {
    const botaoIcone = document.querySelector('#pixButton img');
    const botaoTexto = document.querySelector('#pixButton span');
    const chavePix = document.getElementById('chavePix')?.value || 'jefersonluckas@gmail.com';
    
    // Animação visual
    const iconeOriginal = botaoIcone.src;
    const textoOriginal = botaoTexto.textContent;

    botaoIcone.style.transform = 'scale(0.8)';
    botaoIcone.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTkgMTZsLTQtNC0xLjQxIDEuNDFMOSAxOSAyMSA3bC0xLjQxLTEuNDF6Ii8+PC9zdmc+';
    botaoIcone.style.borderColor = '#4CAF50';
    botaoTexto.textContent = 'Copiado!';
    botaoTexto.style.color = '#4CAF50';

    // Copia a chave PIX
    copyTextToClipboard(chavePix)
        .then(showPixMensagem);
        
    function showPixMensagem() {
        setTimeout(() => {
            botaoIcone.style.transform = '';
            botaoIcone.src = iconeOriginal;
            botaoIcone.style.borderColor = '';
            botaoTexto.textContent = textoOriginal;
            botaoTexto.style.color = '';
        }, 1500);
    }
}

/**
 * Função genérica para copiar texto para a área de transferência
 * @param {string} text - Texto a ser copiado
 * @returns {Promise} - Promise que resolve quando o texto é copiado
 */
async function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return Promise.resolve();
        } catch (e) {
            // Fallback se a API Clipboard falhar
        }
    }
    
    // Fallback para navegadores antigos
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
            textarea.setSelectionRange(0, textarea.value.length);
        }
        const success = document.execCommand('copy');
        return Promise.resolve(success);
    } catch (err) {
        return Promise.reject(err);
    } finally {
        document.body.removeChild(textarea);
    }
}

/**
 * Função para copiar o texto para a área de transferência e mostrar feedback no card
 * @param {string} text - Texto a ser copiado
 * @param {HTMLElement} card - Elemento do card que contém o overlay
 */
async function copyToClipboard(text, card) {
    const overlay = card.querySelector('.copy-overlay');
    
    try {
        await copyTextToClipboard(text);
        showFeedback(overlay, true);
    } catch (e) {
        showFeedback(overlay, false);
    }
}

/**
 * Mostra feedback visual após a tentativa de cópia
 * @param {HTMLElement} overlay - Elemento overlay onde o feedback será mostrado
 * @param {boolean} success - Se a cópia foi bem-sucedida
 */
function showFeedback(overlay, success) {
    if (!overlay) return;
    
    const feedback = overlay.querySelector('.feedback-message');
    if (feedback) {
        feedback.textContent = success ? '✓ Copiado!' : 'Toque longo para copiar';
        feedback.className = success ? 'feedback-message success' : 'feedback-message error';
    }
    
    overlay.classList.add('active');
    setTimeout(() => overlay.classList.remove('active'), success ? 1500 : 3000);
}