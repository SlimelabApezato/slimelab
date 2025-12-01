// js/utils.js

import { PASSWORD_REGEX } from './config.js';
import { SLIME_ROXO_NV1_SVG, SLIME_AZUL_NV1_SVG, SLIME_VERDE_NV1_SVG, SLIME_AMARELO_NV1_SVG } from './data/placeholder_assets.js';

/**
 * Verifica se a string fornecida é um email válido (contém '@').
 * @param {string} input - A string a ser verificada.
 * @returns {boolean}
 */
export function isEmail(input) {
    return input.includes('@');
}

/**
 * Valida a senha contra os requisitos mínimos de segurança (Regex).
 * @param {string} password - A senha a ser validada.
 * @returns {boolean}
 */
export function validatePassword(password) {
    return PASSWORD_REGEX.test(password);
}

/**
 * Retorna uma mensagem detalhada sobre os requisitos de senha não atendidos.
 * @param {string} password - A senha a ser verificada.
 * @returns {string}
 */
export function getPasswordValidationMessage(password) {
    let message = '';
    if (password.length < 8) {
        message += '• Mínimo de 8 caracteres.\n';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
        message += '• Pelo menos uma letra maiúscula.\n';
    }
    if (!/(?=.*[a-z])/.test(password)) {
        message += '• Pelo menos uma letra minúscula.\n';
    }
    return message.trim();
}

/**
 * Gera um número inteiro aleatório entre min (inclusivo) e max (inclusivo).
 * @param {number} min
 * @param {number} max
 * @returns {number} Um número inteiro aleatório.
 */
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Converte uma string SVG em uma Data URL.
 * @param {string} svgString - A string SVG.
 * @returns {string} A Data URL.
 */
export function getSvgDataUrl(svgString) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
}

/**
 * Retorna a Data URL do SVG placeholder para um Slime.
 * @param {string} color - Cor do Slime.
 * @param {number} level - Nível do Slime.
 * @returns {string} A Data URL do SVG.
 */
export function getSlimeSvgDataUrl(color, level) {
    // Por enquanto, apenas Nível 1
    let svg = '';
    switch (color) {
        case 'Roxo':
            svg = SLIME_ROXO_NV1_SVG;
            break;
        case 'Azul':
            svg = SLIME_AZUL_NV1_SVG;
            break;
        case 'Verde':
            svg = SLIME_VERDE_NV1_SVG;
            break;
        case 'Amarelo':
            svg = SLIME_AMARELO_NV1_SVG;
            break;
        default:
            svg = SLIME_ROXO_NV1_SVG; // Default
    }
    
    // TODO: Adicionar lógica para Níveis > 1 (por enquanto, apenas Nível 1)
    
    return getSvgDataUrl(svg);
}