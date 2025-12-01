// js/app.js

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { LAB_ITEMS_DATA } from './data/lab_items_data.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { handleSignUp, handleSignIn, handleGoogleSignIn, handleSignOut } from './logic/auth.js';
import { initializeGameState, attemptCompleteTask } from './logic/game_state.js';
import { initMatterEngine, dropSlime } from './logic/matter_engine.js';
import { toggleScreens, toggleAuthMode, displayPasswordTooltip, renderHUD } from './logic/ui_render.js';
import { getPasswordValidationMessage } from './utils.js';

// Inicializa o cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        // A persistência é controlada aqui. O padrão é localStorage.
        // Para simular "Não Lembrar", o usuário teria que usar o modo anônimo do navegador.
        // O Supabase-js v2 não oferece uma maneira fácil de alternar entre localStorage e sessionStorage
        // no momento do login. Manteremos o padrão (localStorage) e faremos a nota.
    }
});

// Função de inicialização principal
async function initApp() {
    // 1. Configurar Listeners de Eventos
    setupEventListeners();

    // 2. Verificar Sessão Existente
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        // Usuário logado, inicializa o jogo
        await initializeGameState(session.user);
        initMatterEngine(); // Inicializa o motor de física
        toggleScreens(true);
    } else {
        // Usuário deslogado, mostra a tela de login
        toggleScreens(false);
    }
}

function setupEventListeners() {
    // --- Listeners de Autenticação ---
    
    // Toggle Login/Cadastro
    document.getElementById('toggle-login').addEventListener('click', () => toggleAuthMode('login'));
    document.getElementById('toggle-signup').addEventListener('click', () => toggleAuthMode('signup'));

    // Formulário de Cadastro
    document.getElementById('signup-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username-signup').value;
        const email = document.getElementById('email-signup').value;
        const password = document.getElementById('password-signup').value;
        const confirmPassword = document.getElementById('confirm-password-signup').value;
        handleSignUp(username, email, password, confirmPassword);
    });

    // Validação de Senha em tempo real (para o tooltip)
    document.getElementById('password-signup').addEventListener('input', (e) => {
        const message = getPasswordValidationMessage(e.target.value);
        displayPasswordTooltip(message);
    });

    // Formulário de Login
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const loginInput = document.getElementById('login-input').value;
        const password = document.getElementById('password-login').value;
        handleSignIn(loginInput, password);
    });

    // Login com Google
    document.getElementById('google-login-btn').addEventListener('click', handleGoogleSignIn);

    // --- Listeners do Jogo ---

     // Event Listeners
    document.getElementById('slime-spawner-btn').addEventListener('click', () => {
        dropSlime();
    });

    // Event Listener para o botão de concluir tarefa (Homescapes Model)
    document.getElementById('task-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('complete-task-btn')) {
            const taskId = e.target.dataset.taskId;
            attemptCompleteTask(taskId);
        }
    });

    // Botão de Logout (Placeholder)
    // document.getElementById('logout-btn').addEventListener('click', handleSignOut);
}

// Inicia o aplicativo
initApp();
