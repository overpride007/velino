/**
 * Sistema de Comentários para MEK-Over Extensions
 * Integrado com GitHub Issues como backend
 */

// Configuração
const comentariosConfig = {
    apiBaseUrl: window.location.origin,
    extensaoId: '', // Será definido dinamicamente
    extensaoNome: '' // Será definido dinamicamente
};

// Estado
let avaliacaoAtual = 0;

// Elementos DOM (serão inicializados após o carregamento do DOM)
const comentariosElements = {};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar elementos DOM
    inicializarElementos();
    
    // Adicionar event listeners
    adicionarEventListeners();
    
    // Inicializar sistema de estrelas
    inicializarEstrelas();
    
    // Adicionar botões de comentários a todos os cards
    adicionarBotoesComentarios();
});

// Função para inicializar elementos DOM
function inicializarElementos() {
    comentariosElements.btnVerComentarios = document.getElementById('ver-comentarios-btn');
    comentariosElements.btnEscreverComentario = document.getElementById('escrever-comentario-btn');
    comentariosElements.btnEscreverComentarioModal = document.getElementById('escrever-comentario-btn-modal'); // Adicionado
    comentariosElements.modal = document.getElementById('comentarios-modal');
    comentariosElements.modalFechar = document.getElementById('fechar-modal-comentarios');
    comentariosElements.secaoVerComentarios = document.getElementById('ver-comentarios-secao');
    comentariosElements.secaoEscreverComentario = document.getElementById('escrever-comentario-secao');
    comentariosElements.listaComentarios = document.getElementById('lista-comentarios');
    comentariosElements.formComentario = document.getElementById('form-comentario');
    comentariosElements.btnVoltarComentarios = document.getElementById('voltar-comentarios-btn');
    comentariosElements.estrelas = document.querySelectorAll('.estrela-avaliacao');
    comentariosElements.textoAvaliacao = document.getElementById('texto-avaliacao');
}

// Função para adicionar event listeners
function adicionarEventListeners() {
    // Botões para abrir modal
    comentariosElements.btnVerComentarios.addEventListener('click', function(e) {
        e.preventDefault();
        abrirModalComentarios();
        carregarComentarios();
    });
    
    // O botão escrever comentário principal foi removido do HTML, então podemos remover ou comentar este listener
    // comentariosElements.btnEscreverComentario.addEventListener('click', function(e) {
    //     e.preventDefault();
    //     abrirModalComentarios();
    //     mostrarSecaoEscreverComentario();
    // });
    
    // Adicionar event listener para o botão dentro do modal
    comentariosElements.btnEscreverComentarioModal.addEventListener('click', function(e) {
        e.preventDefault();
        mostrarSecaoEscreverComentario();
    });
    
    // Fechar modal
    comentariosElements.modalFechar.addEventListener('click', function() {
        fecharModalComentarios();
    });
    
    // Navegação entre seções
    comentariosElements.btnVoltarComentarios.addEventListener('click', function(e) {
        e.preventDefault();
        mostrarSecaoVerComentarios();
    });
    
    // Envio de formulário
    comentariosElements.formComentario.addEventListener('submit', function(e) {
        e.preventDefault();
        enviarComentario();
    });
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(e) {
        if (e.target === comentariosElements.modal) {
            fecharModalComentarios();
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && comentariosElements.modal.classList.contains('active')) {
            fecharModalComentarios();
        }
    });
}

// Função para inicializar sistema de estrelas
function inicializarEstrelas() {
    comentariosElements.estrelas.forEach(estrela => {
        // Hover
        estrela.addEventListener('mouseover', function() {
            const valor = parseInt(this.getAttribute('data-valor'));
            atualizarExibicaoEstrelas(valor);
        });
        
        // Saída do hover
        estrela.addEventListener('mouseout', function() {
            atualizarExibicaoEstrelas(avaliacaoAtual);
        });
        
        // Clique
        estrela.addEventListener('click', function() {
            avaliacaoAtual = parseInt(this.getAttribute('data-valor'));
            atualizarExibicaoEstrelas(avaliacaoAtual);
            atualizarTextoAvaliacao(avaliacaoAtual);
        });
    });
}

// Função para atualizar exibição das estrelas
function atualizarExibicaoEstrelas(valor) {
    comentariosElements.estrelas.forEach(estrela => {
        const estrelaValor = parseInt(estrela.getAttribute('data-valor'));
        if (estrelaValor <= valor) {
            estrela.classList.add('active');
        } else {
            estrela.classList.remove('active');
        }
    });
}

// Função para atualizar texto da avaliação
function atualizarTextoAvaliacao(valor) {
    const textos = {
        0: 'Clique nas estrelas para avaliar',
        1: 'Muito Ruim',
        2: 'Ruim',
        3: 'Regular',
        4: 'Bom',
        5: 'Excelente'
    };
    
    comentariosElements.textoAvaliacao.textContent = textos[valor];
}

// Função para abrir modal de comentários
function abrirModalComentarios() {
    comentariosElements.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Função para fechar modal de comentários
function fecharModalComentarios() {
    comentariosElements.modal.classList.remove('active');
    document.body.style.overflow = '';
    resetarFormularioComentario();
}

// Função para mostrar seção de ver comentários
function mostrarSecaoVerComentarios() {
    comentariosElements.secaoVerComentarios.classList.remove('hidden');
    comentariosElements.secaoEscreverComentario.classList.add('hidden');
}

// Função para mostrar seção de escrever comentário
function mostrarSecaoEscreverComentario() {
    comentariosElements.secaoVerComentarios.classList.add('hidden');
    comentariosElements.secaoEscreverComentario.classList.remove('hidden');
}

// Função para carregar comentários
async function carregarComentarios() {
    try {
        comentariosElements.listaComentarios.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i> Carregando comentários...
            </div>
        `;
        
        const response = await fetch(`${comentariosConfig.apiBaseUrl}/api/comments?extensao=${comentariosConfig.extensaoId}`);
        
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${await response.text()}`);
        }
        
        const comentarios = await response.json();
        exibirComentarios(comentarios);
        
    } catch (error) {
        console.error('Erro ao carregar comentários:', error);
        comentariosElements.listaComentarios.innerHTML = `
            <div class="alert alert-error">
                <i class="fas fa-exclamation-circle"></i> Erro ao carregar comentários: ${error.message}
            </div>
            <button class="comments-btn" onclick="carregarComentarios()">
                <i class="fas fa-sync"></i> Tentar novamente
            </button>
        `;
    }
}

// Função para exibir comentários
function exibirComentarios(comentarios) {
    // Filtrar comentários para esta extensão
    const comentariosFiltrados = comentarios.filter(comentario => {
        const dados = analisarCorpoComentario(comentario.body);
        return dados.extensaoId === comentariosConfig.extensaoId;
    });
    
    if (comentariosFiltrados.length === 0) {
        comentariosElements.listaComentarios.innerHTML = `
            <div class="no-comments">
                <i class="fas fa-comment-slash"></i>
                <p>Ainda não há comentários para ${comentariosConfig.extensaoNome}.</p>
                <p>Seja o primeiro a comentar!</p>
            </div>
        `;
        return;
    }
    
    comentariosElements.listaComentarios.innerHTML = '';
    
    comentariosFiltrados.forEach(comentario => {
        const dados = analisarCorpoComentario(comentario.body);
        const elementoComentario = criarElementoComentario(dados, comentario);
        comentariosElements.listaComentarios.appendChild(elementoComentario);
    });
}

// Função para analisar corpo do comentário
function analisarCorpoComentario(corpo) {
    const linhas = corpo.split('\n');
    const dados = {
        nome: 'Usuário',
        idade: '',
        avaliacao: 0,
        comentario: '',
        extensaoId: ''
    };
    
    linhas.forEach(linha => {
        if (linha.startsWith('Nome:')) {
            dados.nome = linha.replace('Nome:', '').trim();
        } else if (linha.startsWith('Idade:')) {
            dados.idade = linha.replace('Idade:', '').trim();
        } else if (linha.startsWith('Avaliação:')) {
            dados.avaliacao = parseInt(linha.replace('Avaliação:', '').trim()) || 0;
        } else if (linha.startsWith('Comentário:')) {
            dados.comentario = linha.replace('Comentário:', '').trim();
        } else if (linha.startsWith('ExtensaoID:')) {
            dados.extensaoId = linha.replace('ExtensaoID:', '').trim();
        }
    });
    
    return dados;
}

// Função para criar elemento de comentário
function criarElementoComentario(dados, comentarioOriginal) {
    const divComentario = document.createElement('div');
    divComentario.className = 'comment-item';
    
    const estrelas = gerarEstrelas(dados.avaliacao);
    const data = new Date(comentarioOriginal.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    divComentario.innerHTML = `
        <div class="comment-header">
            <div class="comment-author">${dados.nome}</div>
            <div class="comment-meta">
                ${dados.idade ? `${dados.idade} anos • ` : ''}${data}
            </div>
        </div>
        ${dados.avaliacao > 0 ? `<div class="comment-rating">${estrelas}</div>` : ''}
        <div class="comment-text">${dados.comentario}</div>
    `;
    
    return divComentario;
}

// Função para gerar estrelas
function gerarEstrelas(avaliacao) {
    let estrelas = '';
    // Arredondar para o número inteiro mais próximo
    const estrelasInteiras = Math.round(avaliacao);
    
    // Adicionar apenas estrelas cheias (sem estrelas vazias)
    for (let i = 1; i <= estrelasInteiras && i <= 5; i++) {
        estrelas += '<i class="fas fa-star active" style="color: #FFD700; text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);"></i>';
    }
    
    return estrelas;
}

// Função para enviar comentário
async function enviarComentario() {
    if (avaliacaoAtual === 0) {
        mostrarAlerta('⭐ Por favor, selecione uma avaliação!', 'warning');
        return;
    }
    
    const dadosComentario = {
        nome: document.getElementById('nome-usuario').value,
        idade: document.getElementById('idade-usuario').value,
        avaliacao: avaliacaoAtual,
        comentario: document.getElementById('texto-comentario').value,
        extensaoId: comentariosConfig.extensaoId
    };
    
    try {
        await submeterComentario(dadosComentario);
        mostrarAlerta('✅ Comentário enviado com sucesso!', 'success');
        mostrarSecaoVerComentarios();
        carregarComentarios();
        resetarFormularioComentario();
        
        // Atualizar avaliações na página
        if (typeof carregarAvaliacoes === 'function') {
            setTimeout(async () => {
                await carregarAvaliacoes();
                exibirAvaliacoesRecomendacoesMes();
                exibirAvaliacoesMelhoresExtensoes();
                exibirAvaliacoesDetalhesExtensoes();
            }, 1000); // Pequeno atraso para garantir que o comentário foi processado
        }
    } catch (error) {
        console.error('Erro ao enviar comentário:', error);
        mostrarAlerta(`❌ Erro ao enviar comentário: ${error.message}`, 'error');
    }
}

// Função para submeter comentário
async function submeterComentario(dados) {
    const response = await fetch(`${comentariosConfig.apiBaseUrl}/api/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}`);
    }
    
    return response.json();
}

// Função para resetar formulário de comentário
function resetarFormularioComentario() {
    comentariosElements.formComentario.reset();
    avaliacaoAtual = 0;
    atualizarExibicaoEstrelas(0);
    atualizarTextoAvaliacao(0);
}

// Função para mostrar alerta
function mostrarAlerta(mensagem, tipo = 'info') {
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo}`;
    alerta.innerHTML = mensagem;
    
    // Remover alertas existentes
    const alertasExistentes = document.querySelectorAll('.alert');
    alertasExistentes.forEach(alerta => alerta.remove());
    
    // Adicionar novo alerta no início do formulário
    comentariosElements.formComentario.insertBefore(alerta, comentariosElements.formComentario.firstChild);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (alerta.parentNode) {
            alerta.remove();
        }
    }, 5000);
}

// Função para adicionar botões de comentários a todos os cards
function adicionarBotoesComentarios() {
    // Encontrar todos os cards da seção de detalhes
    const cards = document.querySelectorAll('.extension-card[id]');
    
    cards.forEach(card => {
        // Verificar se o card já tem um botão de comentários
        if (card.querySelector('.comments-btn')) return;
        
        // Obter o ID e o nome da extensão
        const extensaoId = card.id;
        const extensaoNome = card.querySelector('h3').textContent.trim();
        
        // Encontrar o elemento onde adicionar o botão (após o último elemento ou no final do card)
        const ultimoElemento = card.querySelector('.space-y-1');
        if (!ultimoElemento) return;
        
        // Verificar se já existe uma div para botões
        let botoesContainer = ultimoElemento.querySelector('.flex.justify-center.mt-6');
        
        // Se não existir, criar uma nova div para botões
        if (!botoesContainer) {
            botoesContainer = document.createElement('div');
            botoesContainer.className = 'flex justify-center mt-6';
            ultimoElemento.appendChild(botoesContainer);
        }
        
        // Criar o botão de comentários
        const botaoComentarios = document.createElement('button');
        botaoComentarios.className = 'comments-btn';
        botaoComentarios.innerHTML = '<i class="fas fa-eye"></i> Ver Comentários';
        botaoComentarios.dataset.extensaoId = extensaoId;
        botaoComentarios.dataset.extensaoNome = extensaoNome;
        
        // Adicionar evento de clique
        botaoComentarios.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Atualizar configuração com o ID e nome da extensão atual
            comentariosConfig.extensaoId = this.dataset.extensaoId;
            comentariosConfig.extensaoNome = this.dataset.extensaoNome;
            
            // Atualizar título do modal
            document.getElementById('modal-title-comentarios').textContent = 'Comentários - ' + this.dataset.extensaoNome;
            
            // Abrir modal e carregar comentários
            abrirModalComentarios();
            carregarComentarios();
        });
        
        // Adicionar o botão ao container
        botoesContainer.appendChild(botaoComentarios);
    });
}