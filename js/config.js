// 🔑 CONFIGURAÇÃO CRÍTICA DO SUPABASE E CONSTANTES DO JOGO

// O usuário deve inserir estas chaves após criar o projeto Supabase.

// Inicialização do Supabase (para uso como variável global)
// A variável 'supabase' é global, mas o 'createClient' não está disponível no escopo global.
// Usaremos a função createClient diretamente.
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        // O padrão é localStorage, que é o que queremos para persistência de sessão.
    }
});
export const SUPABASE_URL = "https://eyczdzawmadoofenxaag.supabase.co"; 
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5Y3pkemF3bWFkb29mZW54YWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MTg3MTgsImV4cCI6MjA4MDA5NDcxOH0.aEfNzVYlWNVXgyo11k6T2UhwSAX-fQmoKjl2xekl0hg";

// Constantes do Jogo
export const INITIAL_ENERGY = 100;
export const MAX_ENERGY = 100;
export const DIAMONDS_INITIAL = 10;
export const GOMA_COINS_INITIAL = 5000;

// Regex de Validação de Senha (Mínimo 8 caracteres, 1 Maiúscula, 1 Minúscula)
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

// Cores e Níveis dos Slimes
export const SLIME_COLORS = ['Roxo', 'Azul', 'Verde', 'Amarelo'];
export const MAX_SLIME_LEVEL = 10;

// Regras de Desbloqueio
export const STARS_FOR_ITEM_UNLOCK = 3;
export const STARS_FOR_WING_UNLOCK = 5;
