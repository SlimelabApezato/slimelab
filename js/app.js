// js/app.js

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { LAB_ITEMS_DATA } from './data/lab_items_data.js';
// A variável global 'supabase' será injetada pelo script no index.html
import { handleSignUp, handleSignIn, handleGoogleSignIn, handleSignOut } from './logic/auth.js';
import { initializeGameState, attemptCompleteTask } from './logic/game_state.js';
import { initMatterEngine, dropSlime } from './logic/matter_engine.js';
import { toggleScreens, toggleAuthMode, displayPasswordTooltip, renderHUD } from './logic/ui_render.js';
import { getPasswordValidationMessage } from './utils.js';

// Inicializa o cliente Supabase (Não usado na versão offline)
export const supabase = null;

// Função de inicialização principal (Versão Offline)
async function initApp() {
    // 1. Configurar Listeners de Eventos (Apenas os do jogo)
    setupGasetupGameEventListeners()    // 2. Inicialização Direta do Jogo com Dados Mock
    // O user mock é necessário para a função initializeGameState
    const mockUser = {
        id: 'mock-user-id-12345',
        email: 'offline@slimes.lab',
        user_metadata: { username: 'DrCROK_Offline' }
    };
    
    await initializeGameState(mockUser);
    initMatterEngine(); // Inicializa o motor de física
    // A tela de jogo já está ativa no index.html
}

function setupGameEventListeners() {
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
