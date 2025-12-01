// js/logic/game_state.js

// A variável global 'supabase' será injetada pelo script no index.html
const supabase = null; // Versão Offline: Supabase é nulo
import { INITIAL_ENERGY, MAX_ENERGY, DIAMONDS_INITIAL, GOMA_COINS_INITIAL, STARS_FOR_ITEM_UNLOCK, STARS_FOR_WING_UNLOCK } from '../config.js';
import { LAB_ITEMS_DATA } from '../data/lab_items_data.js';
import { renderHUD } from './ui_render.js';

// Variável de estado local para o jogo
export const gameState = {
    user: null,
    profile: null,
    slimes: [], // Slimes do usuário (do DB)
    customization: [], // Customização do usuário (do DB)
    tasks: [], // Tarefas ativas do usuário (do DB)
    spawner_charge: 0,
    current_slimes: [], // Slimes atualmente no frasco (Matter.js bodies)
    current_task_to_complete: null, // Armazena a tarefa que está sendo concluída
};

/**
 * Inicializa o estado do jogo após o login.
 * @param {object} user - O objeto de usuário do Supabase.
 */
export async function initializeGameState(user) {
    // Versão Offline: Inicializa o estado com dados mock
    gameState.user = user;
    
    // 1. Perfil Mock
    gameState.profile = {
        id: user.id,
        username: user.user_metadata.username || user.email.split('@')[0],
        star_count: 10, // Suficiente para desbloquear a primeira ala
        diamond_count: DIAMONDS_INITIAL * 10,
        goma_coins: GOMA_COINS_INITIAL * 10,
        current_energy: MAX_ENERGY,
    };

    // 2. Slimes Mock (Um de cada Nível 1)
    gameState.slimes = [
        { id: 'mock-slime-1', color: 'Roxo', level: 1, quantity: 1 },
        { id: 'mock-slime-2', color: 'Azul', level: 1, quantity: 1 },
        { id: 'mock-slime-3', color: 'Verde', level: 1, quantity: 1 },
        { id: 'mock-slime-4', color: 'Amarelo', level: 1, quantity: 1 },
    ];

    // 3. Customização Mock (Primeiro item da Fusion Bay desbloqueado)
    gameState.customization = [
        { 
            user_id: user.id, 
            item_id: 'mesa_principal', 
            item_wing: 'fusion_bay', 
            is_unlocked: true,
            skin_equipped: 'tech_neon'
        }
    ];

    // 4. Tarefas Mock (3 tarefas ativas)
    gameState.tasks = [
        {
            id: 'mock-task-1',
            is_completed: false,
            task: {
                task_name: 'Limpar Frasco',
                task_description: 'Gaste 10 de energia para limpar o frasco.',
                wing_id: 'fusion_bay',
                cost_type: 'goma_coins',
                cost_amount: 100,
                unlocks_item_id: 'mesa_principal'
            }
        },
        {
            id: 'mock-task-2',
            is_completed: false,
            task: {
                task_name: 'Fundir Slimes',
                task_description: 'Fundir 2 Slimes Roxo Nível 1.',
                wing_id: 'fusion_bay',
                cost_type: 'goma_coins',
                cost_amount: 200,
                unlocks_item_id: 'acelerador_quantico'
            }
        },
        {
            id: 'mock-task-3',
            is_completed: false,
            task: {
                task_name: 'Coletar Goma',
                task_description: 'Coletar 500 Goma Coins.',
                wing_id: 'astro_garden',
                cost_type: 'goma_coins',
                cost_amount: 500,
                unlocks_item_id: 'estufa_astro'
            }
        }
    ];

    // 5. Inicializar Spawner Charge
    gameState.spawner_charge = 15;

    // 6. Renderizar HUD e UI
    renderHUD();
    renderTasks();
    checkWingUnlock();
}

/**
 * Atualiza a energia do usuário no estado local e no Supabase.
 * @param {number} amount - Quantidade a ser adicionada (positiva) ou subtraída (negativa).
 */
export async function updateEnergy(amount) {
    if (!gameState.profile) return;

    let newEnergy = gameState.profile.current_energy + amount;
    newEnergy = Math.min(newEnergy, MAX_ENERGY); // Limite máximo

    gameState.profile.current_energy = newEnergy;
    
    // Versão Offline: Não atualiza o Supabase
    console.log(`[OFFLINE] Energia atualizada para: ${newEnergy}`);

    renderHUD();
}

/**
 * Atualiza a contagem de estrelas do usuário.
 * @param {number} amount - Quantidade de estrelas a adicionar.
 */
export async function updateStarCount(amount) {
    if (!gameState.profile) return;

    const newStarCount = gameState.profile.star_count + amount;
    gameState.profile.star_count = newStarCount;

    // Versão Offline: Não atualiza o Supabase
    console.log(`[OFFLINE] Estrelas atualizadas para: ${newStarCount}`);

    // Verificar desbloqueios
    checkWingUnlock();
    renderHUD();
}

/**
 * Verifica e aplica a lógica de desbloqueio de alas.
 */
export async function checkWingUnlock() {
    const stars = gameState.profile.star_count;
    
    // Lógica de desbloqueio de Alas
    for (const wingId in LAB_ITEMS_DATA) {
        const wingData = LAB_ITEMS_DATA[wingId];
        const wingElement = document.getElementById(wingId.replace('_', '-')); // astro_garden -> astro-garden

        if (wingElement && stars >= wingData.unlock_stars && wingElement.classList.contains('fog-overlay')) {
            wingElement.classList.remove('fog-overlay');
            wingElement.classList.add('unlocked');
            console.log(`Ala ${wingData.wing_name} desbloqueada com ${stars} estrelas!`);
            // TODO: Acionar cutscene de história
        }
    }
}

/**
 * Tenta completar a tarefa ativa.
 * @param {string} taskId O ID da tarefa a ser completada.
 */
export async function attemptCompleteTask(taskId) {
    const task = gameState.tasks.find(t => t.id === taskId);
    if (!task) {
        console.error('Tarefa não encontrada:', taskId);
        return;
    }

    const costAmount = task.task.cost_amount;
    const costType = task.task.cost_type;

    if (costType === 'goma_coins' && gameState.profile.goma_coins < costAmount) {
        alert(`Você precisa de ${costAmount} Goma Coins para completar esta tarefa.`);
        return;
    }
    // Adicionar lógica para outros tipos de custo (ex: diamantes)

    // 1. Deduzir o custo (Simulação de transação)
    let newCoins = gameState.profile.goma_coins - costAmount;
    
    // 2. Atualizar o estado local
    gameState.profile.goma_coins = newCoins;
    
    // Versão Offline: Não atualiza o Supabase
    console.log(`[OFFLINE] Custo de ${costAmount} deduzido. Goma Coins: ${newCoins}`);

    // 4. Marcar a tarefa como completa (apenas no estado local para simulação)
    task.is_completed = true;
    task.completed_at = new Date().toISOString();

    // 5. Iniciar o processo de seleção de item (Homescapes)
    if (task.task.unlocks_item_id) {
        gameState.current_task_to_complete = task;
        // Abrir o modal de seleção de skin (será implementado em ui_render.js)
        openItemSelectionModal(task.task.unlocks_item_id);
    } else {
        // Se não desbloquear item, apenas recarrega as tarefas
        alert(`Tarefa "${task.task.task_name}" concluída!`);
        await initializeGameState(gameState.user); // Recarrega o estado para buscar novas tarefas
    }
}

/**
 * Finaliza a customização após a seleção da skin.
 * @param {string} itemId O ID do item que foi desbloqueado.
 * @param {string} skinId A skin escolhida pelo usuário.
 */
export async function finalizeCustomization(itemId, skinId) {
    const userId = gameState.user.id;

    // Versão Offline: Simula a inserção do item desbloqueado
    gameState.customization.push({
        user_id: userId, 
        item_id: itemId, 
        item_wing: gameState.current_task_to_complete.task.wing_id,
        is_unlocked: true,
        skin_equipped: skinId
    });

    // 2. Recarregar o estado do jogo (Simulação)
    await initializeGameState(gameState.user);
    
    // 3. Fechar o modal
    closeItemSelectionModal();
    
    alert(`Item "${itemId}" instalado com a skin "${skinId}"!`);
}

/**
 * Salva o estado atual do jogo (Slimes no frasco) no localStorage (para persistência local temporária).
 */
export function saveLocalSlimes() {
    const slimesData = gameState.current_slimes.map(slime => ({
        id: slime.id,
        level: slime.level,
        color: slime.color,
        position: slime.position,
        // Outros dados relevantes
    }));
    localStorage.setItem('slimes_in_flask', JSON.stringify(slimesData));
}

/**
 * Carrega o estado do jogo (Slimes no frasco) do localStorage.
 */
export function loadLocalSlimes() {
    const slimesData = localStorage.getItem('slimes_in_flask');
    if (slimesData) {
        // TODO: Implementar a lógica de recriação dos corpos Matter.js
        console.log('Slimes carregados do estado local.');
        // gameState.current_slimes = ...
    }
}
