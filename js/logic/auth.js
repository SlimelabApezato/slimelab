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

    // 2. Validação de Unicidade do Nome de Usuário
    const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

    if (existingUser) {
        displayAuthError('Este Nome de Usuário já está em uso.');
        return;
    }

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
    let email = loginInput;

    // 1. Determinação: Se não for email, busca o email associado ao username
    if (!isEmail(loginInput)) {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('user_email') // Supondo que você tenha uma coluna 'user_email' na tabela profiles
            .eq('username', loginInput)
            .single();

        if (profileError || !profile) {
            displayAuthError('Nome de Usuário ou Senha inválidos.');
            return;
        }
        email = profile.user_email;
    }

    // 2. Autenticação com Email e Senha
    const rememberMe = document.getElementById('remember-me').checked;
    const persistence = rememberMe ? 'session' : 'session'; // Nota: A persistência é controlada globalmente na inicialização do cliente. A opção 'session' é mantida para fins de código, mas o Supabase-js v2 usa 'localStorage' por padrão.

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        displayAuthError('Nome de Usuário ou Senha inválidos.');
        return;
    }

    if (data.user) {
        await initializeGameState(data.user);
        initMatterEngine(); // Inicializa o motor de física
        toggleScreens(true);
    }
}

/**
 * Lida com o processo de Login via Google OAuth.
 */
export async function handleGoogleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
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
