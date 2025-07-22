// Configuração para acesso local e funcionalidades específicas
const configLocal = {
    // Chave de acesso PF para desenvolvimento e testes
    chavePF: "pf_access_2023",
    
    // Verificar se o acesso PF está ativo
    verificarAcessoPF: function() {
        const chavePF = localStorage.getItem('pf_access_key');
        const timestampPF = localStorage.getItem('pf_access_timestamp');
        const agora = Date.now();
        
        // Verificar se a chave existe e não expirou (24 horas)
        if (chavePF && timestampPF && (agora - parseInt(timestampPF)) < 86400000) {
            if (chavePF === this.chavePF) {
                return true;
            }
        }
        
        return false;
    },
    
    // Ativar acesso PF
    ativarAcessoPF: function() {
        localStorage.setItem('pf_access_key', this.chavePF);
        localStorage.setItem('pf_access_timestamp', Date.now().toString());
        console.log("Acesso PF ativado com sucesso!");
        return true;
    },
    
    // Desativar acesso PF
    desativarAcessoPF: function() {
        localStorage.removeItem('pf_access_key');
        localStorage.removeItem('pf_access_timestamp');
        console.log("Acesso PF desativado.");
        return true;
    }
};

// Verificar parâmetros da URL ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se há parâmetro 'pf' na URL
    const urlParams = new URLSearchParams(window.location.search);
    const pfParam = urlParams.get('pf');
    
    if (pfParam === 'ativo') {
        // Ativar acesso PF
        configLocal.ativarAcessoPF();
        
        // Também ativar a autenticação principal
        if (typeof CHAVE_ACESSO_VALIDA !== 'undefined') {
            localStorage.setItem('velino_access_key', CHAVE_ACESSO_VALIDA);
            localStorage.setItem('velino_auth_timestamp', Date.now().toString());
        }
        
        // Remover o parâmetro da URL por segurança (sem recarregar a página)
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
    }
});