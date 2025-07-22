// Script para processar parâmetros de autenticação na URL
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se há parâmetros na URL
    const urlParams = new URLSearchParams(window.location.search);
    const accessKey = urlParams.get('access_key');
    const autoAuth = urlParams.get('auto_auth');
    
    // Se temos uma chave de acesso e auto_auth=true
    if (accessKey && autoAuth === 'true') {
        // Validar a chave de acesso
        if (typeof validarChaveAcessoURL === 'function') {
            const resultado = validarChaveAcessoURL(accessKey);
            
            if (resultado.status === 'success') {
                // Mostrar notificação de acesso liberado
                if (typeof mostrarNotificacaoAcesso === 'function') {
                    mostrarNotificacaoAcesso();
                }
                
                // Atualizar a interface
                document.getElementById('tela-bloqueio').style.display = 'none';
                document.getElementById('conteudo-principal').style.display = 'block';
                
                // Remover os parâmetros da URL por segurança (sem recarregar a página)
                const newUrl = window.location.pathname + window.location.hash;
                window.history.replaceState({}, document.title, newUrl);
            }
        }
    }
});