/**
 * filters.js - Funções relacionadas ao sistema de filtros
 * Parte do projeto MEK-Over Extensions
 */

// ====================================
// SISTEMA DE FILTROS
// ====================================

/**
 * Sistema de filtros para as extensões
 */
document.addEventListener('DOMContentLoaded', function() {
    const generoSelect = document.getElementById('filter-genero');
    const formatoSelect = document.getElementById('filter-formato');
    const resetButton = document.getElementById('reset-filters');
    let adultoLiberado = false;
    let tipoAdulto = null;

    // Mostra o aviso de idade e tipo
    function showAdultoAviso() {
        if (document.getElementById('adultoAviso')) return;
        const aviso = document.createElement('div');
        aviso.id = 'adultoAviso';
        aviso.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;';
        aviso.innerHTML = `
            <div style="background:#181926;padding:32px 24px;border-radius:1.2rem;max-width:95vw;width:380px;box-shadow:0 8px 32px #000;color:#fff;text-align:center;position:relative;">
                <button id="fecharIdade" style="position:absolute;top:12px;right:16px;background:none;border:none;color:#9ca3af;font-size:20px;cursor:pointer;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:all 0.2s;" onmouseover="this.style.background='#374151';this.style.color='#fff'" onmouseout="this.style.background='none';this.style.color='#9ca3af'">×</button>
                <h2 style="font-size:1.3rem;font-weight:bold;color:#facc15;margin-bottom:1.2rem;">Conteúdo Adulto</h2>
                <p style="margin-bottom:1.2rem;">Este conteúdo não é recomendado para menores de 18 anos.<br>Você tem mais de 18 anos?</p>
                <div style="display:flex;gap:16px;justify-content:center;">
                    <button id="adultoSim1" style="background:#22c55e;color:#fff;padding:8px 22px;border-radius:0.6rem;font-weight:bold;border:none;cursor:pointer;">Sim</button>
                    <button id="adultoNao1" style="background:#ef4444;color:#fff;padding:8px 22px;border-radius:0.6rem;font-weight:bold;border:none;cursor:pointer;">Não</button>
                </div>
            </div>
        `;
        document.body.appendChild(aviso);

        document.getElementById('adultoSim1').onclick = function() {
            aviso.innerHTML = `
                <div style="background:#181926;padding:32px 24px;border-radius:1.2rem;max-width:95vw;width:380px;box-shadow:0 8px 32px #000;color:#fff;text-align:center;position:relative;">
                    <button id="fecharTipo" style="position:absolute;top:12px;right:16px;background:none;border:none;color:#9ca3af;font-size:20px;cursor:pointer;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:all 0.2s;" onmouseover="this.style.background='#374151';this.style.color='#fff'" onmouseout="this.style.background='none';this.style.color='#9ca3af'">×</button>
                    <h2 style="font-size:1.3rem;font-weight:bold;color:#facc15;margin-bottom:1.2rem;">Qual tipo de conteúdo adulto?</h2>
                    <p style="margin-bottom:1.2rem;">Escolha o tipo de conteúdo adulto que deseja visualizar:</p>
                    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
                        <button id="adultoHetero" style="background:#ea580c;color:#fff;padding:8px 16px;border-radius:0.6rem;font-weight:bold;border:none;cursor:pointer;">Hetero</button>
                        <button id="adultoYuri" style="background:#ec4899;color:#fff;padding:8px 16px;border-radius:0.6rem;font-weight:bold;border:none;cursor:pointer;">Yuri</button>
                        <button id="adultoYaoi" style="background:#dc2626;color:#fff;padding:8px 16px;border-radius:0.6rem;font-weight:bold;border:none;cursor:pointer;">Yaoi</button>
                    </div>
                </div>
            `;
            document.getElementById('adultoHetero').onclick = function() {
                adultoLiberado = true;
                tipoAdulto = 'hetero';
                mostrarAdultos();
                aviso.remove();
                filterCards();
            };
            document.getElementById('adultoYuri').onclick = function() {
                adultoLiberado = true;
                tipoAdulto = 'yuri';
                mostrarAdultos();
                aviso.remove();
                filterCards();
            };
            document.getElementById('adultoYaoi').onclick = function() {
                adultoLiberado = true;
                tipoAdulto = 'yaoi';
                mostrarAdultos();
                aviso.remove();
                filterCards();
            };
            document.getElementById('fecharTipo').onclick = function() {
                generoSelect.value = '';
                aviso.remove();
                filterCards();
            };
        };
        document.getElementById('adultoNao1').onclick = function() {
            generoSelect.querySelector('option[value="adulto"]').style.display = 'none';
            generoSelect.value = '';
            aviso.remove();
            filterCards();
        };
        document.getElementById('fecharIdade').onclick = function() {
            generoSelect.value = '';
            aviso.remove();
            filterCards();
        };
    }

    // Mostra apenas as seções adultas do tipo selecionado
    function mostrarAdultos() {
        // Esconde todas as seções adultas
        document.querySelectorAll('.hetero-section, .yuri-section, .yaoi-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Mostra apenas a seção do tipo selecionado
        if (tipoAdulto === 'hetero') {
            document.getElementById('hetero-section').style.display = 'block';
        } else if (tipoAdulto === 'yuri') {
            document.getElementById('yuri-section').style.display = 'block';
        } else if (tipoAdulto === 'yaoi') {
            document.getElementById('yaoi-section').style.display = 'block';
        }
    }
    
    // Mostra a seleção de tipo de conteúdo adulto (para quando já está liberado)
    function showTipoAdultoSelection() {
        if (document.getElementById('adultoAviso')) return;
        const aviso = document.createElement('div');
        aviso.id = 'adultoAviso';
        aviso.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;';
        aviso.innerHTML = `
            <div style="background:#181926;padding:32px 24px;border-radius:1.2rem;max-width:95vw;width:380px;box-shadow:0 8px 32px #000;color:#fff;text-align:center;position:relative;">
                <button id="fecharAdulto" style="position:absolute;top:12px;right:16px;background:none;border:none;color:#9ca3af;font-size:20px;cursor:pointer;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:all 0.2s;" onmouseover="this.style.background='#374151';this.style.color='#fff'" onmouseout="this.style.background='none';this.style.color='#9ca3af'">×</button>
                <h2 style="font-size:1.3rem;font-weight:bold;color:#facc15;margin-bottom:1.2rem;">Escolha o tipo de conteúdo adulto</h2>
                <p style="margin-bottom:1.2rem;">Selecione qual tipo de conteúdo adulto deseja visualizar:</p>
                <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:16px;">
                    <button id="adultoHetero2" style="background:#ea580c;color:#fff;padding:8px 16px;border-radius:0.6rem;font-weight:bold;border:none;cursor:pointer;">Hetero</button>
                    <button id="adultoYuri2" style="background:#ec4899;color:#fff;padding:8px 16px;border-radius:0.6rem;font-weight:bold;border:none;cursor:pointer;">Yuri</button>
                    <button id="adultoYaoi2" style="background:#dc2626;color:#fff;padding:8px 16px;border-radius:0.6rem;font-weight:bold;border:none;cursor:pointer;">Yaoi</button>
                </div>
                <button id="cancelarAdulto" style="background:#6b7280;color:#fff;padding:6px 16px;border-radius:0.6rem;font-weight:bold;border:none;cursor:pointer;font-size:0.9rem;">Cancelar</button>
            </div>
        `;
        document.body.appendChild(aviso);

        document.getElementById('adultoHetero2').onclick = function() {
            tipoAdulto = 'hetero';
            mostrarAdultos();
            aviso.remove();
            filterCards();
        };
        document.getElementById('adultoYuri2').onclick = function() {
            tipoAdulto = 'yuri';
            mostrarAdultos();
            aviso.remove();
            filterCards();
        };
        document.getElementById('adultoYaoi2').onclick = function() {
            tipoAdulto = 'yaoi';
            mostrarAdultos();
            aviso.remove();
            filterCards();
        };
        document.getElementById('cancelarAdulto').onclick = function() {
            generoSelect.value = '';
            aviso.remove();
            filterCards();
        };
        document.getElementById('fecharAdulto').onclick = function() {
            generoSelect.value = '';
            aviso.remove();
            filterCards();
        };
    }

    // --- Filtro Cards Logic ---
    const cards = Array.from(document.querySelectorAll('.extension-card'));

    function getGenero(card) {
        const generoAttr = card.getAttribute('data-genero');
        if (generoAttr) return generoAttr;
        
        const txt = card.textContent;
        const match = txt.match(/Gênero Predominante:\s*([^\n]+)/i);
        if (match) return match[1];
        return '';
    }
    
    function getFormato(card) {
        const formatoAttr = card.getAttribute('data-formato');
        if (formatoAttr) return formatoAttr;
        
        const txt = card.textContent;
        const match = txt.match(/Formato Predominante:\s*([^\n]+)/i);
        if (match) return match[1];
        return '';
    }
    
    function filterCards() {
        const generoVal = generoSelect.value;
        const formatoVal = formatoSelect.value;
        
        cards.forEach(card => {
            let show = true;
            const genero = getGenero(card);
            const formato = getFormato(card);
            
            // Se é card adulto
            if (card.classList.contains('adult-card')) {
                if (generoVal === 'adulto') {
                    if (!adultoLiberado) {
                        show = false;
                    } else {
                        // Mostra apenas se for do tipo selecionado
                        if (tipoAdulto === 'hetero' && card.classList.contains('hetero-card')) {
                            show = true;
                        } else if (tipoAdulto === 'yuri' && card.classList.contains('yuri-card')) {
                            show = true;
                        } else if (tipoAdulto === 'yaoi' && card.classList.contains('yaoi-card')) {
                            show = true;
                        } else {
                            show = false;
                        }
                    }
                } else {
                    // Se não está no filtro adulto, esconde todos os cards adultos
                    show = false;
                }
            } else {
                // Cards normais - aplica filtros normais
                if (generoVal === 'adulto') {
                    show = false; // Esconde cards normais quando filtro está em adulto
                } else {
                    if (generoVal && generoVal !== 'adulto') {
                        show = show && genero.toLowerCase().includes(generoVal.toLowerCase());
                    }
                    if (formatoVal) {
                        show = show && formato.toLowerCase().includes(formatoVal.toLowerCase());
                    }
                }
            }
            
            card.style.display = show ? '' : 'none';
        });
        
        // Controla visibilidade das seções
        if (generoVal === 'adulto' && adultoLiberado) {
            // Esconde todas as seções e mostra seção adulta específica
            document.querySelectorAll('section').forEach(section => {
                const h2 = section.querySelector('h2');
                if (h2) {
                    const title = h2.textContent;
                    if (title.includes('Recomendações do Mês') || title.includes('Melhores Extensões') || title.includes('Detalhes de Todas as Extensões')) {
                        section.style.display = 'none';
                    }
                }
            });
            mostrarAdultos();
        } else if (generoVal || formatoVal) {
            // Qualquer filtro ativo → Oculta tudo, deixa apenas "Detalhes"
            document.querySelectorAll('section').forEach(section => {
                const h2 = section.querySelector('h2');
                if (h2) {
                    const title = h2.textContent;
                    if (title.includes('Detalhes de Todas as Extensões')) {
                        section.style.display = 'block';
                    } else {
                        section.style.display = 'none';
                    }
                }
            });
            // Esconde seções adultas
            document.querySelectorAll('.hetero-section, .yuri-section, .yaoi-section').forEach(section => {
                section.style.display = 'none';
            });
        } else {
            // Sem filtros → Mostra todas as seções normais
            document.querySelectorAll('section').forEach(section => {
                const h2 = section.querySelector('h2');
                if (h2) {
                    const title = h2.textContent;
                    if (title.includes('Recomendações do Mês') || title.includes('Melhores Extensões') || title.includes('Detalhes de Todas as Extensões')) {
                        section.style.display = 'block';
                    }
                }
            });
            // Esconde seções adultas
            document.querySelectorAll('.hetero-section, .yuri-section, .yaoi-section').forEach(section => {
                section.style.display = 'none';
            });
        }
    }

    // Event listeners
    if (generoSelect) {
        generoSelect.addEventListener('change', function() {
            if (this.value === 'adulto') {
                if (!adultoLiberado) {
                    showAdultoAviso();
                    // Não chama filterCards ainda, só após liberar
                    return;
                } else {
                    // Se já está liberado, mostra a seleção de tipo novamente
                    showTipoAdultoSelection();
                    return;
                }
            }
            filterCards();
        });
    }
    
    if (formatoSelect) {
        formatoSelect.addEventListener('change', filterCards);
    }
    
    // Botão para redefinir filtros
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            generoSelect.value = '';
            formatoSelect.value = '';
            adultoLiberado = false;
            tipoAdulto = null;
            filterCards();
        });
    }

    // Bloqueia navegação para detalhes se não estiver liberado
    document.querySelectorAll('.extension-card.adult-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!adultoLiberado) {
                e.preventDefault();
                alert('Você precisa liberar o conteúdo adulto pelo filtro para acessar este card.');
            }
        });
    });
    
    // Inicializa filtros
    if (cards.length > 0) {
        filterCards();
    }
});