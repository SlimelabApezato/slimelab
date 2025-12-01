// js/logic/ui_render.js

import { gameState, attemptCompleteTask, finalizeCustomization } from './game_state.js';
import { LAB_ITEMS_DATA, SKINS } from '../data/lab_items_data.js';
import { LAB_ITEM_PLACEHOLDER_SVG } from '../data/placeholder_assets.js';
import { getSvgDataUrl } from '../utils.js';

const energyFill = document.getElementById('energy-fill');
const energyText = document.getElementById('energy-text');
const diamondCount = document.getElementById('diamond-count');
const gomaCoinCount = document.getElementById('goma-coin-count');
const starCount = document.getElementById('star-count');
const spawnerBtn = document.getElementById('slime-spawner-btn');

/**
 * Atualiza todos os elementos da HUD com base no estado atual do jogo.
 */
export function renderHUD() {
    if (!gameState.profile) return;

    const { current_energy, diamond_count, goma_coins, star_count } = gameState.profile;
    const { spawner_charge } = gameState;

    // 1. Barra de Energia
    const energyPercentage = (current_energy / 100) * 100; // 100 é o MAX_ENERGY
    energyFill.setAttribute('width', energyPercentage);
    energyText.textContent = `${current_energy}/100`;

    // 2. Moedas
    diamondCount.textContent = `💎 ${diamond_count}`;
    gomaCoinCount.textContent = `💰 ${goma_coins}`;

    // 3. Estrelas
    starCount.textContent = `⭐ ${star_count} Estrelas`;

    // 4. Botão Spawner
    spawnerBtn.textContent = `DROP SLIME (${spawner_charge})`;
    if (current_energy <= 0 || spawner_charge <= 0) {
        spawnerBtn.disabled = true;
        spawnerBtn.textContent = current_energy <= 0 ? 'ENERGIA ZERADA' : 'RECARREGAR SPAWNER';
    } else {
        spawnerBtn.disabled = false;
    }
}

/**
 * Alterna a visibilidade entre as telas de Login e Jogo.
 * @param {boolean} showGame - Se true, mostra a tela do jogo; se false, mostra a tela de autenticação.
 */
export function toggleScreens(showGame) {
    const authScreen = document.getElementById('auth-screen');
    const gameScreen = document.getElementById('game-screen');

    if (showGame) {
        authScreen.classList.remove('active');
        gameScreen.classList.add('active');
    } else {
        gameScreen.classList.remove('active');
        authScreen.classList.add('active');
    }
}

/**
 * Alterna entre os formulários de Login e Cadastro.
 * @param {string} mode - 'login' ou 'signup'.
 */
export function toggleAuthMode(mode) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const toggleLogin = document.getElementById('toggle-login');
    const toggleSignup = document.getElementById('toggle-signup');

    if (mode === 'login') {
        loginForm.style.display = 'flex';
        signupForm.style.display = 'none';
        toggleLogin.classList.add('active');
        toggleSignup.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'flex';
        toggleLogin.classList.remove('active');
        toggleSignup.classList.add('active');
    }
}

/**
 * Exibe uma mensagem de erro na tela de autenticação.
 * @param {string} message - A mensagem de erro.
 */
export function displayAuthError(message) {
    const errorElement = document.getElementById('auth-error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

/**
 * Exibe o tooltip de validação de senha.
 * @param {string} message - A mensagem de validação.
 */
export function displayPasswordTooltip(message) {
    const tooltip = document.getElementById('password-tooltip');
    if (message) {
        tooltip.textContent = message;
        tooltip.classList.add('active');
    } else {
        tooltip.classList.remove('active');
    }
}

/**
 * Renderiza a lista de tarefas ativas do usuário.
 */
export function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Limpa a lista

    if (gameState.tasks.length === 0) {
        taskList.innerHTML = '<li class="task-item"><span class="task-title">Nenhuma tarefa ativa.</span></li>';
        return;
    }

    gameState.tasks.forEach(userTask => {
        const taskData = userTask.task;
        const listItem = document.createElement('li');
        listItem.classList.add('task-item');
        
        // Título e Descrição
        const titleSpan = document.createElement('span');
        titleSpan.classList.add('task-title');
        titleSpan.textContent = taskData.task_name;
        
        const descSpan = document.createElement('span');
        descSpan.classList.add('task-description');
        descSpan.textContent = taskData.task_description;

        // Custo
        const costSpan = document.createElement('span');
        costSpan.classList.add('task-cost');
        costSpan.textContent = `${taskData.cost_amount} ${taskData.cost_type === 'goma_coins' ? '💰' : '💎'}`;

        // Botão de Conclusão
        const completeBtn = document.createElement('button');
        completeBtn.classList.add('bubble-button', 'small', 'complete-task-btn');
        completeBtn.textContent = 'Concluir';
        completeBtn.dataset.taskId = userTask.id;
        completeBtn.addEventListener('click', () => attemptCompleteTask(userTask.id));

        listItem.appendChild(titleSpan);
        listItem.appendChild(descSpan);
        listItem.appendChild(costSpan);
        listItem.appendChild(completeBtn);
        
        taskList.appendChild(listItem);
    });
}

/**
 * Abre o modal de seleção de item e renderiza as opções de skin.
 * @param {string} itemId O ID do item a ser customizado.
 */
export function openItemSelectionModal(itemId) {
    const modal = document.getElementById('item-selection-modal');
    const skinOptionsContainer = document.getElementById('skin-options');
    const confirmBtn = document.getElementById('confirm-skin-btn');
    
    // Encontra o nome do item para o título do modal
    let itemName = itemId;
    for (const wing in LAB_ITEMS_DATA) {
        const item = LAB_ITEMS_DATA[wing].items.find(i => i.id === itemId);
        if (item) {
            itemName = item.name;
            break;
        }
    }
    
    modal.querySelector('h2').textContent = `Escolha o Design para ${itemName}`;
    skinOptionsContainer.innerHTML = ''; // Limpa as opções

    let selectedSkin = SKINS[0]; // Padrão para a primeira skin

    SKINS.forEach((skinId, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('skin-option');
        if (index === 0) optionDiv.classList.add('active');
        optionDiv.dataset.skin = skinId;
        
        // Placeholder de imagem (usando SVG Data URL)
        const img = document.createElement('img');
        img.src = getSvgDataUrl(LAB_ITEM_PLACEHOLDER_SVG);
        img.alt = `${skinId} Skin (Placeholder)`;
        
        const p = document.createElement('p');
        p.textContent = skinId.replace('_', ' ').toUpperCase();

        optionDiv.appendChild(img);
        optionDiv.appendChild(p);
        
        optionDiv.addEventListener('click', () => {
            document.querySelectorAll('.skin-option').forEach(opt => opt.classList.remove('active'));
            optionDiv.classList.add('active');
            selectedSkin = skinId;
        });

        skinOptionsContainer.appendChild(optionDiv);
    });

    // Remove o listener anterior para evitar duplicidade
    confirmBtn.replaceWith(confirmBtn.cloneNode(true));
    const newConfirmBtn = document.getElementById('confirm-skin-btn');
    
    newConfirmBtn.addEventListener('click', () => {
        finalizeCustomization(itemId, selectedSkin);
    });

    modal.classList.add('active');
}

/**
 * Fecha o modal de seleção de item.
 */
export function closeItemSelectionModal() {
    document.getElementById('item-selection-modal').classList.remove('active');
}

// TODO: Adicionar funções de renderização para Customização do Laboratório, Passe e Loja.
