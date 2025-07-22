/**
 * modal.js - Funções relacionadas aos modais da página
 * Parte do projeto MEK-Over Extensions
 */

// ====================================
// MODAL DE IMAGEM AMPLIADA
// ====================================

/**
 * Exibe o modal com a imagem ampliada
 * @param {HTMLImageElement} img - Elemento de imagem a ser exibido no modal
 */
function showFullImage(img) {
    var modal = document.getElementById('fullImageModal');
    var modalImg = document.getElementById('fullImageModalImg');
    modalImg.src = img.src;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

/**
 * Fecha o modal de imagem ampliada
 */
function closeFullImage() {
    var modal = document.getElementById('fullImageModal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

/**
 * Inicializa o modal de imagem ampliada
 * Adiciona a classe cursor-zoom-in às imagens na seção #top-15
 * e configura os eventos de clique
 */
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona a classe cursor-zoom-in às imagens na seção #top-15
    const topObrasSection = document.getElementById('top-15');
    if (topObrasSection) {
        // Corrigindo o seletor problemático
        const images = topObrasSection.querySelectorAll('img');
        // ou use uma classe específica como: '.card-image img'
        images.forEach(img => {
            img.classList.add('cursor-zoom-in');
            img.addEventListener('click', function(e) {
                e.stopPropagation(); // Evita que o evento de clique do card seja acionado
                showFullImage(this);
            });
        });
    }
    
    // Fecha o modal ao clicar fora da imagem
    const modal = document.getElementById('fullImageModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeFullImage();
            }
        });
        
        // Fecha o modal ao pressionar a tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeFullImage();
            }
        });
    }
});