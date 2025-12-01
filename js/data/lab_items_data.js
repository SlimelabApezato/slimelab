// js/data/lab_items_data.js

// Definição das skins disponíveis
export const SKINS = ['tech_neon', 'bio_organico', 'steampunk_caotico'];

// Estrutura de dados para os itens de laboratório expandidos
export const LAB_ITEMS_DATA = {
    'fusion_bay': {
        wing_name: 'Fusion Bay',
        unlock_stars: 0,
        items: [
            // 30+ Itens para Fusion Bay (Exemplos)
            { id: 'mesa_principal', name: 'Mesa de Controle Principal', position: 'center' },
            { id: 'rack_tubos', name: 'Rack de Tubos de Ensaio', position: 'left-rack' },
            { id: 'centrifuga', name: 'Centrífuga de Slime', position: 'top-left' },
            { id: 'destilador', name: 'Destilador Químico', position: 'top-right' },
            { id: 'reator_miniatura', name: 'Reator de Fusão Miniatura', position: 'center' },
            { id: 'bancada_preparacao', name: 'Bancada de Preparação', position: 'bottom-left' },
            { id: 'extintor', name: 'Extintor de Incêndio Químico', position: 'wall-left' },
            { id: 'primeiros_socorros', name: 'Caixa de Primeiros Socorros', position: 'wall-right' },
            { id: 'armario_reagentes', name: 'Armário de Reagentes', position: 'back-left' },
            { id: 'medidor_ph', name: 'Medidor de PH Digital', position: 'center' },
            { id: 'pipetador', name: 'Pipetador Automático', position: 'center' },
            { id: 'ventilador', name: 'Ventilador de Exaustão', position: 'ceiling' },
            { id: 'camera_seguranca', name: 'Câmera de Segurança', position: 'ceiling' },
            { id: 'lixeira_bio', name: 'Lixeira de Resíduos Biológicos', position: 'floor' },
            { id: 'aquecedor_solucoes', name: 'Aquecedor de Soluções', position: 'center' },
            { id: 'gerador_magnetico', name: 'Gerador de Campo Magnético', position: 'bottom-right' },
            { id: 'painel_eletrico', name: 'Painel de Distribuição Elétrica', position: 'wall-right' },
            { id: 'monitor_ondas', name: 'Monitor de Ondas Cerebrais', position: 'wall-left' },
            { id: 'cilindro_gas', name: 'Cilindro de Gás Comprimido', position: 'back-right' },
            { id: 'estacao_limpeza', name: 'Estação de Limpeza de Vidraria', position: 'back-left' },
            { id: 'maquina_cafe', name: 'Máquina de Café (Científica)', position: 'top-left' },
            { id: 'relogio_digital', name: 'Relógio de Parede Digital', position: 'wall-center' },
            { id: 'cadeira_ergonomica', name: 'Cadeira Ergonômica', position: 'seat' },
            { id: 'prateleira_livros', name: 'Prateleira de Livros Científicos', position: 'back-center' },
            { id: 'globo_holografico', name: 'Globo Terrestre Holográfico', position: 'center' },
            { id: 'mesa_desenho', name: 'Mesa de Desenho Técnico', position: 'bottom-left' },
            { id: 'dispensador_luvas', name: 'Dispensador de Luvas', position: 'wall-left' },
            { id: 'recipiente_nitro', name: 'Recipiente de Nitrogênio Líquido', position: 'floor' },
            { id: 'detector_radiacao', name: 'Detector de Radiação', position: 'center' },
            { id: 'maquina_gelo_seco', name: 'Máquina de Gelo Seco', position: 'top-right' },
            // Adicione mais itens aqui para atingir 30+
        ],
    },
    'astro_garden': {
        wing_name: 'Astro-Ecology Garden',
        unlock_stars: 5,
        items: [
            // 30+ Itens para Astro-Ecology Garden (Exemplos)
            { id: 'bio_reator_central', name: 'Bio-Reator Central', position: 'center' },
            { id: 'estufa_crescimento', name: 'Estufa de Crescimento Rápido', position: 'top-left' },
            { id: 'fonte_agua', name: 'Fonte de Água Reciclada', position: 'bottom-right' },
            { id: 'arvore_slime', name: 'Árvore de Slime (Mutante)', position: 'center' },
            { id: 'painel_umidade', name: 'Painel de Controle de Umidade', position: 'wall-left' },
            { id: 'canteiro_elevado', name: 'Canteiro Elevado', position: 'floor' },
            { id: 'ferramentas_jardinagem', name: 'Ferramentas de Jardinagem', position: 'wall-right' },
            { id: 'composteira', name: 'Composteira Orgânica', position: 'floor' },
            { id: 'luminaria_fotossintese', name: 'Luminária de Fotossíntese', position: 'ceiling' },
            { id: 'colmeia', name: 'Colmeia de Abelhas Mutantes', position: 'wall-right' },
            { id: 'bomba_irrigacao', name: 'Bomba de Irrigação', position: 'floor' },
            { id: 'mesa_transplante', name: 'Mesa de Transplante', position: 'bottom-left' },
            { id: 'terrario', name: 'Terrário de Criaturas', position: 'top-right' },
            { id: 'saco_sementes', name: 'Saco de Sementes Raras', position: 'floor' },
            { id: 'nebulizador', name: 'Nebulizador de Água', position: 'center' },
            { id: 'medidor_nutrientes', name: 'Medidor de Nutrientes do Solo', position: 'center' },
            { id: 'caminho_pedras', name: 'Caminho de Pedras Luminosas', position: 'floor' },
            { id: 'rede_insetos', name: 'Rede de Captura de Insetos', position: 'wall-left' },
            { id: 'banco_madeira', name: 'Banco de Madeira Rústica', position: 'floor' },
            { id: 'estatua_guardiao', name: 'Estátua de Guardião da Natureza', position: 'back-center' },
            { id: 'caixa_bio_eng', name: 'Caixa de Ferramentas de Bio-Engenharia', position: 'bottom-left' },
            { id: 'filtro_ar', name: 'Filtro de Ar Orgânico', position: 'wall-right' },
            { id: 'painel_solar', name: 'Painel Solar Interno', position: 'ceiling' },
            { id: 'cesta_colheita', name: 'Cesta de Colheita', position: 'floor' },
            { id: 'vaso_flutuante', name: 'Vaso de Planta Flutuante', position: 'center' },
            { id: 'maquina_cha', name: 'Máquina de Chá de Ervas', position: 'top-right' },
            { id: 'livro_botanica', name: 'Livro de Botânica Antiga', position: 'bottom-right' },
            { id: 'jaula_passaros', name: 'Jaula de Pássaros Exóticos', position: 'ceiling' },
            { id: 'barometro', name: 'Barômetro de Parede', position: 'wall-center' },
            { id: 'cerca_viva', name: 'Cerca Viva Estilizada', position: 'floor' },
            // Adicione mais itens aqui para atingir 30+
        ],
    },
    'quantum_accelerator': {
        wing_name: 'Quantum Accelerator',
        unlock_stars: 10,
        items: [
            // 30+ Itens para Quantum Accelerator (Exemplos)
            { id: 'acelerador_miniatura', name: 'Acelerador de Partículas Miniatura', position: 'center' },
            { id: 'projetor_holografico', name: 'Projetor Holográfico', position: 'ceiling' },
            { id: 'painel_tatil', name: 'Painel de Controle Tátil', position: 'wall-left' },
            { id: 'gerador_forca', name: 'Gerador de Campo de Força', position: 'bottom-right' },
            { id: 'teletransporte', name: 'Estação de Teletransporte Pessoal', position: 'floor' },
            { id: 'robo_limpeza', name: 'Robô de Limpeza Flutuante', position: 'center' },
            { id: 'cabo_alta_tensao', name: 'Cabo de Energia de Alta Tensão', position: 'wall-right' },
            { id: 'bateria_ions', name: 'Bateria de Íons de Lítio Gigante', position: 'back-left' },
            { id: 'capacete_vr', name: 'Capacete de Realidade Virtual', position: 'center' },
            { id: 'impressora_3d', name: 'Impressora 3D de Moléculas', position: 'top-left' },
            { id: 'drone_vigilancia', name: 'Drone de Vigilância', position: 'ceiling' },
            { id: 'arma_pasers', name: 'Arma de Pásers (Display)', position: 'wall-right' },
            { id: 'cadeira_flutuante', name: 'Cadeira de Observação Flutuante', position: 'seat' },
            { id: 'relogio_atomico', name: 'Relógio Atômico', position: 'wall-center' },
            { id: 'servidor_quantico', name: 'Servidor de Dados Quânticos', position: 'back-center' },
            { id: 'scanner_corporal', name: 'Scanner Corporal 3D', position: 'floor' },
            { id: 'mesa_anti_gravidade', name: 'Mesa de Teste Anti-Gravidade', position: 'center' },
            { id: 'portal_miniatura', name: 'Portal Dimensional (Miniatura)', position: 'top-right' },
            { id: 'dispensador_comida', name: 'Dispensador de Comida Sintética', position: 'wall-left' },
            { id: 'painel_binario', name: 'Painel de Códigos Binários', position: 'wall-right' },
            { id: 'luva_neural', name: 'Luva de Interface Neural', position: 'center' },
            { id: 'extrator_energia_escura', name: 'Extrator de Energia Escura', position: 'top-left' },
            { id: 'monitor_frequencia', name: 'Monitor de Frequência Estelar', position: 'wall-left' },
            { id: 'dispositivo_camuflagem', name: 'Dispositivo de Camuflagem', position: 'bottom-left' },
            { id: 'capsula_sono', name: 'Cápsula de Sono Criogênico', position: 'back-right' },
            { id: 'projetor_constelacoes', name: 'Projetor de Constelações', position: 'ceiling' },
            { id: 'ferramentas_laser', name: 'Ferramentas de Reparo a Laser', position: 'center' },
            { id: 'sistema_autodestruicao', name: 'Sistema de Auto-Destruição', position: 'wall-center' },
            { id: 'maquina_escudos', name: 'Máquina de Geração de Escudos', position: 'top-right' },
            { id: 'caixa_chips', name: 'Caixa de Armazenamento de Chips', position: 'bottom-right' },
            // Adicione mais itens aqui para atingir 30+
        ],
    },
    'relic_chamber': {
        wing_name: 'Relic Restoration Chamber',
        unlock_stars: 15,
        items: [
            // 30+ Itens para Relic Restoration Chamber (Exemplos)
            { id: 'mesa_restauracao', name: 'Mesa de Restauração de Artefatos', position: 'center' },
            { id: 'maquina_vapor', name: 'Máquina a Vapor Miniatura', position: 'top-left' },
            { id: 'relogio_pendulo', name: 'Relógio de Pêndulo Gigante', position: 'wall-left' },
            { id: 'telescopio_latao', name: 'Telescópio de Latão Antigo', position: 'bottom-right' },
            { id: 'caixa_musica', name: 'Caixa de Música Mecânica', position: 'center' },
            { id: 'armadura_medieval', name: 'Armadura Medieval (Exposição)', position: 'back-right' },
            { id: 'mapa_estelar_antigo', name: 'Mapa Estelar Antigo', position: 'wall-center' },
            { id: 'bussola_gigante', name: 'Bússola Gigante', position: 'center' },
            { id: 'lupa_aumento', name: 'Lupa de Aumento (Estilizada)', position: 'center' },
            { id: 'livro_feiticos', name: 'Livro de Feitiços (Antigo)', position: 'bottom-left' },
            { id: 'esfera_armilar', name: 'Esfera Armilar', position: 'top-right' },
            { id: 'maquina_escrever', name: 'Máquina de Escrever Antiga', position: 'center' },
            { id: 'vitrola', name: 'Vitrola de Disco de Vinil', position: 'bottom-left' },
            { id: 'camera_fole', name: 'Câmera Fotográfica de Fole', position: 'wall-left' },
            { id: 'estante_porcelana', name: 'Estante de Porcelana Antiga', position: 'back-left' },
            { id: 'globo_antigo', name: 'Globo Terrestre Antigo', position: 'center' },
            { id: 'ferramentas_relojoeiro', name: 'Ferramentas de Relojoeiro', position: 'center' },
            { id: 'maquina_costura', name: 'Máquina de Costura Antiga', position: 'bottom-right' },
            { id: 'pena_tinteiro', name: 'Pena e Tinteiro', position: 'center' },
            { id: 'bau_tesouro', name: 'Baú de Tesouro de Madeira', position: 'floor' },
            { id: 'maquina_contabilidade', name: 'Máquina de Contabilidade Antiga', position: 'top-left' },
            { id: 'lampiao_oleo', name: 'Lampião a Óleo', position: 'wall-right' },
            { id: 'maquina_gravacao', name: 'Máquina de Gravação a Laser (Antiga)', position: 'top-right' },
            { id: 'cadeira_balanco', name: 'Cadeira de Balanço de Vime', position: 'seat' },
            { id: 'caixa_forte', name: 'Caixa Forte de Ferro', position: 'back-right' },
            { id: 'maquina_selos', name: 'Máquina de Fazer Selos', position: 'center' },
            { id: 'oculos_monoculo', name: 'Óculos de Monóculo (Display)', position: 'wall-left' },
            { id: 'pistola_pederneira', name: 'Pistola de Pederneira (Display)', position: 'wall-right' },
            { id: 'boneco_ventriloquo', name: 'Boneco de Ventríloquo Antigo', position: 'center' },
            { id: 'balanca_precisao', name: 'Balança de Precisão (Antiga)', position: 'center' },
            // Adicione mais itens aqui para atingir 30+
        ],
    },
};

/**
 * Retorna uma lista de todos os IDs de itens base.
 * @returns {string[]}
 */
export function getAllItemIds() {
    let ids = [];
    for (const wing in LAB_ITEMS_DATA) {
        ids = ids.concat(LAB_ITEMS_DATA[wing].items.map(item => item.id));
    }
    return ids;
}

/**
 * Retorna uma lista de todos os IDs de itens e skins (para inicialização no Supabase).
 * @returns {object[]}
 */
export function getAllItemSkinCombinations() {
    const combinations = [];
    for (const wing in LAB_ITEMS_DATA) {
        LAB_ITEMS_DATA[wing].items.forEach(item => {
            SKINS.forEach(skin => {
                combinations.push({
                    item_id: item.id,
                    item_wing: wing,
                    skin_chosen: skin,
                    is_unlocked: false,
                });
            });
        });
    }
    return combinations;
}
