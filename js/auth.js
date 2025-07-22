// Chave de acesso válida (será alterada mensalmente)
const CHAVE_ACESSO_VALIDA = "d#Di2^kV8@iwlhY2rIl!eAELLNrFy%HIH@6hins!9usIc7oW#i";

// Verificar se o usuário já está autenticado
function verificarAutenticacao() {
    const chaveArmazenada = localStorage.getItem('velino_access_key');
    const timestampAuth = localStorage.getItem('velino_auth_timestamp');
    const agora = Date.now();
    
    // Verificar se a autenticação expirou (24 horas)
    if (chaveArmazenada && timestampAuth && (agora - parseInt(timestampAuth)) < 86400000) {
        if (chaveArmazenada === CHAVE_ACESSO_VALIDA) {
            // Verificar se a chave está expirada mensalmente
            if (verificarChaveExpirada(chaveArmazenada)) {
                localStorage.removeItem('velino_access_key');
                localStorage.removeItem('velino_auth_timestamp');
                return { status: 'expired' };
            }
            return { status: 'authenticated' };
        } else {
            // Chave inválida
            localStorage.removeItem('velino_access_key');
            localStorage.removeItem('velino_auth_timestamp');
            return { status: 'invalid' };
        }
    }
    
    // Sem autenticação
    return { status: 'not_authenticated' };
}

// Verificar se a chave está expirada (simulação de verificação mensal)
function verificarChaveExpirada(chave) {
    // Para demonstração, vamos simular que a chave expira todo mês
    // Você pode implementar sua própria lógica de expiração aqui
    const dataAtual = new Date();
    const mesAtual = dataAtual.getMonth();
    const anoAtual = dataAtual.getFullYear();
    
    // Simular que a chave é válida apenas para o mês atual
    // Em produção, você faria a verificação real com seu sistema
    return false; // Por enquanto, considerar sempre válida
}

// Função para validar e liberar acesso (apenas via URL)
function validarChaveAcessoURL(chave) {
    if (chave === CHAVE_ACESSO_VALIDA) {
        // Salvar autenticação
        localStorage.setItem('velino_access_key', chave);
        localStorage.setItem('velino_auth_timestamp', Date.now().toString());
        
        return { status: 'success' };
    } else {
        return { status: 'expired' };
    }
}

// Mostrar notificação de acesso liberado
function mostrarNotificacaoAcesso() {
    const notificacao = document.createElement('div');
    notificacao.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #22c55e; color: white; padding: 16px 24px; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); z-index: 10000; font-family: 'Segoe UI', Arial, sans-serif; animation: slideInFromRight 0.5s ease-out;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 20px;">🔓</span>
                <span style="font-weight: bold;">Acesso Liberado!</span>
            </div>
            <div style="font-size: 14px; margin-top: 4px; opacity: 0.9;">
                Bem-vindo ao MEK-Over Extensions
            </div>
        </div>
    `;
    
    document.body.appendChild(notificacao);
    
    // Remover após 4 segundos
    setTimeout(() => {
        notificacao.querySelector('div').style.animation = 'slideOutToRight 0.5s ease-in';
        setTimeout(() => {
            document.body.removeChild(notificacao);
        }, 500);
    }, 4000);
}