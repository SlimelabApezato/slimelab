// js/logic/matter_engine.js

import { getRandomInt } from '../utils.js';
import { gameState, updateEnergy } from './game_state.js';
import { renderHUD } from './ui_render.js';
import { SLIME_COLORS, MAX_SLIME_LEVEL } from '../config.js';

const { Engine, Render, Runner, World, Bodies, Events } = Matter;

let engine;
let render;
let runner;
let world;
let flaskBounds = {};

/**
 * Inicializa o motor de física Matter.js e o ambiente do Frasco.
 */
export function initMatterEngine() {
    const container = document.getElementById('matter-canvas');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Cria o motor
    engine = Engine.create();
    world = engine.world;
    world.gravity.y = 1; // Gravidade padrão

    // 2. Cria o renderizador
    render = Render.create({
        element: container,
        engine: engine,
        options: {
            width: width,
            height: height,
            wireframes: false, // Renderização com cores
            background: 'transparent'
        }
    });

    Render.run(render);

    // 3. Cria o runner
    runner = Runner.create();
    Runner.run(runner, engine);

    // 4. Define as bordas do Frasco (Flask)
    const wallThickness = 20;
    const wallOptions = { isStatic: true, render: { fillStyle: '#333' } };

    // Define as dimensões do frasco (um retângulo centralizado)
    const flaskWidth = width * 0.6;
    const flaskHeight = height * 0.8;
    const flaskX = width / 2;
    const flaskY = height / 2;

    flaskBounds = {
        left: flaskX - flaskWidth / 2,
        right: flaskX + flaskWidth / 2,
        bottom: flaskY + flaskHeight / 2,
        top: flaskY - flaskHeight / 2,
    };

    // Paredes (Bordas do Frasco)
    const walls = [
        // Chão
        Bodies.rectangle(flaskX, flaskBounds.bottom + wallThickness / 2, flaskWidth, wallThickness, wallOptions),
        // Parede Esquerda
        Bodies.rectangle(flaskBounds.left - wallThickness / 2, flaskY, wallThickness, flaskHeight, wallOptions),
        // Parede Direita
        Bodies.rectangle(flaskBounds.right + wallThickness / 2, flaskY, wallThickness, flaskHeight, wallOptions),
        // Teto (Para detecção de Game Over)
        Bodies.rectangle(flaskX, flaskBounds.top - wallThickness / 2, flaskWidth, wallThickness, { ...wallOptions, label: 'ceiling' }),
    ];

    World.add(world, walls);

    // 5. Configura a detecção de colisão para fusão
    Events.on(engine, 'collisionStart', handleCollision);
}

/**
 * Cria um corpo Slime com propriedades específicas.
 * @param {number} x - Posição X.
 * @param {number} y - Posição Y.
 * @param {number} level - Nível do Slime.
 * @param {string} color - Cor do Slime.
 * @returns {object} O corpo Matter.js criado.
 */
import { getSlimeSvgDataUrl } from '../utils.js'; // Nova função utilitária
// ... (restante do código)

function createSlimeBody(x, y, level, color) {
    const radius = 10 + level * 3; // Raio aumenta com o nível
    const colorCode = getColorCode(color);
    
    const body = Bodies.circle(x, y, radius, {
        restitution: 0.8, // Elasticidade
        friction: 0.001,
        label: 'slime',
        // Propriedades customizadas
        slime: {
            level: level,
            color: color,
            isFusing: false,
        },
        render: {
            // Usando sprite para renderizar o SVG placeholder
            sprite: {
                texture: getSlimeSvgDataUrl(color, level),
                xScale: (radius * 2) / 50, // Ajusta a escala para o tamanho do corpo
                yScale: (radius * 2) / 50,
            }
        }
    });
    
    // Adiciona o Slime ao estado do jogo
    gameState.current_slimes.push(body);
    return body;
}

/**
 * Mapeia a cor do Slime para um código hexadecimal (placeholder).
 * @param {string} color - Nome da cor.
 * @returns {string} Código hexadecimal.
 */
function getColorCode(color) {
    switch (color) {
        case 'Roxo': return '#a855f7';
        case 'Azul': return '#3b82f6';
        case 'Verde': return '#10b981';
        case 'Amarelo': return '#f59e0b';
        default: return '#ccc';
    }
}

/**
 * Lógica de Fusão: Ocorre SE Nível == Nível E Cor == Cor.
 * @param {object} event - Evento de colisão do Matter.js.
 */
function handleCollision(event) {
    const pairs = event.pairs;

    pairs.forEach(pair => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;

        // Verifica se ambos são Slimes e não estão em processo de fusão
        if (bodyA.label === 'slime' && bodyB.label === 'slime' && !bodyA.slime.isFusing && !bodyB.slime.isFusing) {
            const slimeA = bodyA.slime;
            const slimeB = bodyB.slime;

            // Regra Estrita de Fusão
            if (slimeA.level === slimeB.level && slimeA.color === slimeB.color) {
                // Bloqueia a fusão para evitar fusões múltiplas no mesmo frame
                bodyA.slime.isFusing = true;
                bodyB.slime.isFusing = true;

                // Animação: Aplica a classe CSS para a animação de "POP"
                // Nota: O Matter.js não suporta classes CSS diretamente.
                // Isso exigiria um wrapper DOM/Canvas para cada corpo.
                // Para simplificar, vamos simular a animação com um pequeno atraso antes de remover.
                
                // Remove os Slimes antigos
                World.remove(world, [bodyA, bodyB]);
                
                // Remove do estado local
                gameState.current_slimes = gameState.current_slimes.filter(s => s.id !== bodyA.id && s.id !== bodyB.id);

                // Novo Nível
                const newLevel = slimeA.level + 1;
                
                if (newLevel <= MAX_SLIME_LEVEL) {
                    // Posição da nova entidade (centro da colisão)
                    const newX = (bodyA.position.x + bodyB.position.x) / 2;
                    const newY = (bodyA.position.y + bodyB.position.y) / 2;

                    // Cria o novo Slime
                    const newSlime = createSlimeBody(newX, newY, newLevel, slimeA.color);
                    World.add(world, newSlime);
                    
                    // Animação: O efeito visual é simulado pela remoção e adição imediata.
                    // O CSS Keyframe 'slime-pop' foi adicionado ao CSS para o caso de usar um wrapper DOM.
                    console.log(`Fusão bem-sucedida! Novo Slime: ${slimeA.color} Nível ${newLevel}`);
                    
                    // Atualiza a pontuação máxima (placeholder)
                    if (newLevel > gameState.profile.highest_slime_level) {
                        gameState.profile.highest_slime_level = newLevel;
                        // TODO: Atualizar no Supabase
                    }
                } else {
                    console.log('Rei Slime Galáctico alcançado!');
                    // TODO: Lógica de recompensa final
                }
            }
        }
    });
}

/**
 * Solta um Slime Nível 1 no frasco.
 */
export function dropSlime() {
    if (gameState.spawner_charge <= 0 || gameState.profile.current_energy <= 0) {
        console.log('Spawner sem carga ou energia esgotada.');
        return false;
    }

    // Consome recursos
    gameState.spawner_charge--;
    updateEnergy(-1); // Decrementa 1 de energia (que atualiza o Supabase e o HUD)
    
    // Posição de drop (topo central do frasco)
    const dropX = flaskBounds.left + (flaskBounds.right - flaskBounds.left) / 2;
    const dropY = flaskBounds.top + 10;
    
    // Cor aleatória para o Slime Nível 1
    const randomColor = SLIME_COLORS[getRandomInt(0, SLIME_COLORS.length - 1)];

    const newSlime = createSlimeBody(dropX, dropY, 1, randomColor);
    World.add(world, newSlime);
    
    return true;
}

// TODO: Implementar a lógica de Game Over (Slime ultrapassa a borda superior)
// Events.on(engine, 'afterUpdate', checkGameOver);
