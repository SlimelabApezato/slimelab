// js/logic/game_state.js

import { supabase } from '../app.js';
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
    gameState.user = user;
    const userId = user.id;
    
    // 1. Buscar Perfil do Usuário
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    // Se o perfil não for encontrado (PGRST116 = No rows found), criamos um novo.
    if (profileError && profileError.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil:', profileError);
        alert(`ERRO RLS/DB: Falha ao buscar perfil. Verifique RLS na tabela 'profiles'. Erro: ${profileError.message}`);
        return;
    }

    if (profileData) {
        gameState.profile = profileData;
    } else {
        // 2. Criar Perfil se não existir (Primeiro Login)
        const newProfile = {
            id: userId,
            // O username deve ser pego do metadata ou do email
            username: user.user_metadata.username || user.email.split('@')[0],
            star_count: 0,
            diamond_count: DIAMONDS_INITIAL,
            goma_coins: GOMA_COINS_INITIAL,
            current_energy: INITIAL_ENERGY,
            // Outros campos iniciais
        };
        
        const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();

        if (createError) {
            console.error('Erro ao criar perfil. Verifique as políticas RLS e o trigger SQL:', createError);
            // Se não pudermos criar o perfil, o jogo não pode iniciar.
            alert('Erro crítico: Não foi possível criar o perfil do usuário. Verifique as configurações RLS e o trigger SQL no Supabase.');
            return;
        }
        gameState.profile = createdProfile;
    }

    // 3. Carregar Slimes
    const { data: slimesData, error: slimesError } = await supabase
        .from('user_slimes')
        .select('*')
        .eq('user_id', userId);

    if (slimesError) {
        console.error('Erro ao carregar slimes:', slimesError);
        alert(`ERRO RLS/DB: Falha ao carregar slimes. Verifique RLS na tabela 'user_slimes'. Erro: ${slimesError.message}`);
        return;
    }
    gameState.slimes = slimesData;

    // 4. Carregar Customização
    const { data: customizationData, error: customizationError } = await supabase
        .from('user_customization')
        .select('*')
        .eq('user_id', userId);

    if (customizationError) {
        console.error('Erro ao carregar customização:', customizationError);
        alert(`ERRO RLS/DB: Falha ao carregar customização. Verifique RLS na tabela 'user_customization'. Erro: ${customizationError.message}`);
        return;
    }
    gameState.customization = customizationData;

    // 5. Carregar Tarefas Ativas (user_tasks)
    const { data: tasksData, error: tasksError } = await supabase
        .from('user_tasks')
        .select(`
            *,
            task:story_tasks (task_name, task_description, wing_id, chapter_id, cost_type, cost_amount, unlocks_item_id)
        `)
        .eq('user_id', userId)
        .eq('is_completed', false)
        .order('chapter_id', { foreignTable: 'task', ascending: true })
        .limit(3); // Limita a 3 tarefas ativas como no Homescapes

    if (tasksError) {
        console.error('Erro ao carregar tarefas:', tasksError);
        alert(`ERRO RLS/DB: Falha ao carregar tarefas. Verifique RLS na tabela 'user_tasks' e 'story_tasks'. Erro: ${tasksError.message}`);
        return;
    }
    gameState.tasks = tasksData;

    // 6. Inicializar Spawner Charge (10 a 15 drops iniciais)
    gameState.spawner_charge = Math.floor(Math.random() * (15 - 10 + 1)) + 10;

    // 7. Renderizar HUD e UI
    renderHUD();
    renderTasks(); // Nova função para renderizar tarefas
    checkWingUnlock(); // Nova função para verificar desbloqueio de alas
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
    
    // Atualizar no Supabase
    const { error } = await supabase
        .from('profiles')
        .update({ current_energy: newEnergy })
        .eq('id', gameState.user.id);

    if (error) {
        console.error('Erro ao atualizar energia:', error);
    }

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

    // Atualizar no Supabase
    const { error } = await supabase
        .from('profiles')
        .update({ star_count: newStarCount })
        .eq('id', gameState.user.id);

    if (error) {
        console.error('Erro ao atualizar estrelas:', error);
    }

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
    
    // 3. Atualizar o Supabase (Transação)
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ goma_coins: newCoins })
        .eq('id', gameState.profile.id);

    if (updateError) {
        console.error('Erro ao deduzir custo da tarefa:', updateError);
        // Reverter estado local se necessário
        return;
    }

    // 4. Marcar a tarefa como completa no Supabase
    const { error: taskCompleteError } = await supabase
        .from('user_tasks')
        .update({ is_completed: true, completed_at: new Date().toISOString() })
        .eq('id', taskId);

    if (taskCompleteError) {
        console.error('Erro ao marcar tarefa como completa:', taskCompleteError);
        return;
    }

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

    // 1. Inserir o item desbloqueado na tabela user_customization
    const { error: insertError } = await supabase
        .from('user_customization')
        .insert([
            { 
                user_id: userId, 
                item_id: itemId, 
                item_wing: gameState.current_task_to_complete.task.wing_id, // Pega a ala da tarefa
                is_unlocked: true,
                skin_equipped: skinId
            }
        ]);

    if (insertError) {
        console.error('Erro ao inserir item de customização:', insertError);
        return;
    }

    // 2. Recarregar o estado do jogo
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
