// js/logic/auth.js

import { supabase } from '../app.js';
import { isEmail, validatePassword, getPasswordValidationMessage } from '../utils.js';
import { initializeGameState } from './game_state.js';
import { toggleScreens, displayAuthError, displayPasswordTooltip } from './ui_render.js';

/**
 * Lida com o processo de Cadastro de um novo usuário.
 */
export async function handleSignUp(username, email, password, confirmPassword) {
    // 1. Validação de Frontend
    if (password !== confirmPassword) {
        displayAuthError('As senhas não coincidem.');
        return;
    }
    if (!validatePassword(password)) {
        const validationMessage = getPasswordValidationMessage(password);
        displayPasswordTooltip(validationMessage);
        displayAuthError('A senha não atende aos requisitos de segurança.');
        return;
    }

    // 2. Validação de Unicidade do Nome de Usuário (Apenas se o username for diferente do email)
    // O trigger SQL já garante a unicidade do username.
    // Esta verificação é opcional, mas pode ser mantida para melhor UX.
    // Por enquanto, vamos confiar no trigger do DB para simplificar o frontend.

    // 3. Criação do Usuário no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: { username: username } // Passa o username para ser usado no trigger do DB
        }
    });

    if (error) {
        displayAuthError(error.message);
        return;
    }

    if (data.user) {
        alert('Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.');
        // O perfil será criado por um trigger no Supabase ou na primeira inicialização do jogo.
    }
}

/**
 * Lida com o processo de Login do usuário (Entrada Flexível).
 */
export async function handleSignIn(loginInput, password) {
    // Simplificação: O login deve ser feito APENAS com o email para evitar complexidade desnecessária
    // na lógica de frontend e confiar no sistema de autenticação do Supabase.
    let email = loginInput;

    if (!isEmail(loginInput)) {
        displayAuthError('Por favor, use seu endereço de email para fazer login.');
        return;
    }

    // 1. Autenticação com Email e Senha
    const rememberMe = document.getElementById('remember-me').checked;
    const persistence = rememberMe ? 'session' : 'session'; // Nota: A persistência é controlada globalmente na inicialização do cliente. A opção 'session' é mantida para fins de código, mas o Supabase-js v2 usa 'localStorage' por padrão.

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });
    
    // O erro de login é genérico para evitar ataques de enumeração de usuários
    if (error) {
        console.error('Erro de Autenticação Supabase:', error); // Log de erro para debug
        displayAuthError('Email ou Senha inválidos.');
        return;
    }

    // A inicialização do jogo e a transição de tela serão feitas pelo listener onAuthStateChange no app.js
    // após a detecção da sessão.
    // Remove o recarregamento forçado.
    // Força a inicialização do jogo e a transição de tela.
    if (data.user) {
        await initializeGameState(data.user);
        toggleScreens(true);
    }
}

/**
 * Lida com o processo de Login via Google OAuth.
 */
export async function handleGoogleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin, // Redireciona de volta para a URL atual
        }
    });

    if (error) {
        displayAuthError(error.message);
    }
}

/**
 * Lida com o processo de Logout do usuário.
 */
export async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Erro ao fazer logout:', error);
    } else {
        toggleScreens(false);
        localStorage.removeItem('slimes_in_flask');
    }
}
