/**
 * Sistema de Exibição de Avaliações para MEK-Over Extensions
 */

// Configuração
const avaliacoesConfig = {
    apiBaseUrl: window.location.origin
};

// Armazenará os dados reais de avaliações calculados dos comentários
let dadosAvaliacoes = {};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistema de avaliações
    inicializarAvaliacoes();
});

// Função para inicializar o sistema de avaliações
async function inicializarAvaliacoes() {
    // Carregar avaliações reais do servidor
    await carregarAvaliacoes();
    
    // Exibir avaliações nas seções apropriadas
    exibirAvaliacoesRecomendacoesMes();
    exibirAvaliacoesMelhoresExtensoes();
    exibirAvaliacoesDetalhesExtensoes();
}

// Função para carregar avaliações do servidor
async function carregarAvaliacoes() {
    try {
        const response = await fetch(`${avaliacoesConfig.apiBaseUrl}/api/comments`);
        if (!response.ok) {
            throw new Error(`Erro ${response.status}`);
        }
        const comentarios = await response.json();
        
        // Processar comentários e calcular médias
        calcularAvaliacoesDosComentarios(comentarios);
    } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
        // Usar dados padrão em caso de erro
        dadosAvaliacoes = {
            'manhastro': { media: 0, total: 0 },
            'manga-livre': { media: 0, total: 0 },
            'sussy-toons': { media: 0, total: 0 },
            'manga-terra': { media: 0, total: 0 },
            'manga-br': { media: 0, total: 0 },
            'leitor-manga': { media: 0, total: 0 }
        };
    }
}

// Função para calcular médias de avaliações a partir dos comentários
function calcularAvaliacoesDosComentarios(comentarios) {
    // Inicializar objeto de avaliações
    dadosAvaliacoes = {};
    
    // Agrupar avaliações por extensão
    const avaliacoesPorExtensao = {};
    
    comentarios.forEach(comentario => {
        const dados = analisarCorpoComentario(comentario.body);
        
        // Verificar se é um comentário válido com avaliação
        if (dados.extensaoId && dados.avaliacao > 0) {
            if (!avaliacoesPorExtensao[dados.extensaoId]) {
                avaliacoesPorExtensao[dados.extensaoId] = [];
            }
            avaliacoesPorExtensao[dados.extensaoId].push(dados.avaliacao);
        }
    });
    
    // Calcular médias
    Object.keys(avaliacoesPorExtensao).forEach(extensaoId => {
        const avaliacoes = avaliacoesPorExtensao[extensaoId];
        const total = avaliacoes.length;
        const soma = avaliacoes.reduce((acc, val) => acc + val, 0);
        const media = total > 0 ? soma / total : 0;
        
        dadosAvaliacoes[extensaoId] = { media, total };
    });
    
    console.log('Avaliações calculadas:', dadosAvaliacoes);
}

// Função para analisar corpo do comentário (mesma lógica do comentarios.js)
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

// Exibir avaliações na seção Recomendações do Mês
function exibirAvaliacoesRecomendacoesMes() {
    // Encontrar a seção de Recomendações do Mês
    const secoes = Array.from(document.querySelectorAll('section h2'));
    const secaoRecomendacoes = secoes.find(h2 => h2.textContent.includes('Recomendações do Mês'));
    
    if (!secaoRecomendacoes) return;
    
    const cards = secaoRecomendacoes.nextElementSibling.querySelectorAll('.extension-card');
    cards.forEach(card => {
        // Obter ID da extensão do link "Ver Detalhes"
        const link = card.querySelector('a[href^="#"]');
        if (!link) return;
        
        const extensaoId = link.getAttribute('href').substring(1);
        const avaliacao = dadosAvaliacoes[extensaoId];
        if (!avaliacao) return;
        
        // Encontrar o elemento onde a nota do autor é exibida
        const notaContainer = card.querySelector('.flex.items-center.gap-2.mt-2');
        if (!notaContainer) return;
        
        // Criar e inserir o elemento de avaliação dos usuários
        const avaliacaoElement = criarElementoAvaliacao(avaliacao.media, avaliacao.total);
        notaContainer.parentNode.insertBefore(avaliacaoElement, notaContainer.nextSibling);
    });
}

// Função para exibir avaliações na seção Melhores Extensões
function exibirAvaliacoesMelhoresExtensoes() {
    // Encontrar a seção de Melhores Extensões
    const secoes = Array.from(document.querySelectorAll('section h2'));
    const secaoMelhores = secoes.find(h2 => h2.textContent.includes('Melhores Extensões'));
    
    if (!secaoMelhores) return;
    
    const cards = secaoMelhores.nextElementSibling.querySelectorAll('.extension-card');
    cards.forEach(card => {
        // Obter ID da extensão do link "Ver Detalhes"
        const link = card.querySelector('a[href^="#"]');
        if (!link) return;
        
        const extensaoId = link.getAttribute('href').substring(1);
        const avaliacao = dadosAvaliacoes[extensaoId];
        if (!avaliacao) return;
        
        // Encontrar o elemento onde a nota do autor é exibida
        const notaContainer = card.querySelector('.flex.items-center.gap-2.mt-2');
        if (!notaContainer) return;
        
        // Criar e inserir o elemento de avaliação dos usuários
        const avaliacaoElement = criarElementoAvaliacao(avaliacao.media, avaliacao.total);
        notaContainer.parentNode.insertBefore(avaliacaoElement, notaContainer.nextSibling);
    });
}

// Função para exibir avaliações na seção Detalhes de Todas as Extensões
function exibirAvaliacoesDetalhesExtensoes() {
    const cards = document.querySelectorAll('.extension-card[id]');
    cards.forEach(card => {
        const extensaoId = card.id;
        const avaliacao = dadosAvaliacoes[extensaoId];
        if (!avaliacao) return;
        
        // Encontrar o elemento onde o nome da extensão é exibido
        const nomeContainer = card.querySelector('h3');
        if (!nomeContainer) return;
        
        // Criar e inserir o elemento de avaliação dos usuários
        const avaliacaoElement = criarElementoAvaliacao(avaliacao.media, avaliacao.total);
        nomeContainer.parentNode.insertBefore(avaliacaoElement, nomeContainer.nextSibling);
    });
}

// Função auxiliar para criar o elemento de avaliação
function criarElementoAvaliacao(media, total) {
    const container = document.createElement('div');
    container.className = 'flex flex-col items-center mt-2';
    
    // Criar elemento de estrelas
    const estrelasContainer = document.createElement('div');
    estrelasContainer.className = 'flex items-center gap-1';
    
    // Gerar estrelas baseadas na média
    estrelasContainer.innerHTML = gerarEstrelas(media);
    
    // Adicionar texto com o total de avaliações (sem a média numérica)
    const textoAvaliacao = document.createElement('div');
    textoAvaliacao.className = 'text-xs text-gray-300 mt-1';
    textoAvaliacao.textContent = total > 0 ? `${total} avaliações` : 'Sem avaliações';
    
    // Montar o container
    container.appendChild(estrelasContainer);
    container.appendChild(textoAvaliacao);
    
    return container;
}

// Função para gerar HTML das estrelas
function gerarEstrelas(avaliacao) {
    let estrelas = '';
    // Arredondar para o número inteiro mais próximo (sem meias estrelas)
    const estrelasInteiras = Math.round(avaliacao);
    
    // Adicionar estrelas cheias (de 1 a 5 apenas)
    for (let i = 1; i <= estrelasInteiras && i <= 5; i++) {
        estrelas += '<i class="fas fa-star" style="color: #FFD700; text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);"></i>';
    }
    
    // Removida a lógica de meia estrela
    // Removidas as estrelas vazias
    
    return estrelas;
}

// Remover esta função que não é necessária
// Função auxiliar para seletor de texto em jQuery style
// Document.prototype.querySelectorAll = function(selector) {
//     if (selector.includes(':contains')) {
//         const parts = selector.split(':contains');
//         const baseSelector = parts[0];
//         const textToMatch = parts[1].replace(/["\(\)]/g, '');
//         
//         const elements = Array.from(document.querySelectorAll(baseSelector));
//         return elements.filter(el => el.textContent.includes(textToMatch));
//     }
//     return document.querySelectorAll(selector);
// };