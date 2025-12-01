# 🧪 SlimeLab: Crônicas do Astro-Mundo

Este é o código-fonte completo do jogo "SlimeLab: Crônicas do Astro-Mundo", desenvolvido em HTML, CSS e JavaScript puro, utilizando as bibliotecas Matter.js, Supabase-js e Lottie.

## 🚀 Deploy Rápido (Netlify Ready)

O projeto está estruturado para ser implantado diretamente no Netlify ou em qualquer serviço de hospedagem estática.

## 🔑 Configuração do Supabase

**CRÍTICO:** Antes de fazer o deploy, você deve inserir suas chaves públicas do Supabase no arquivo `js/config.js`.

1.  Crie um projeto no Supabase.
2.  Vá para `Settings > API` e copie a **URL** e a **`anon` public key**.
3.  Abra o arquivo `js/config.js` e substitua os placeholders:

```javascript
export const SUPABASE_URL = "SUA_URL_SUPABASE_AQUI"; 
export const SUPABASE_ANON_KEY = "SUA_CHAVE_PUBLICA_AQUI";
// ...
```

## 🛠️ Estrutura do Projeto

-   `index.html`: Ponto de entrada principal.
-   `css/`: Estilos (main.css, components.css, themes.css).
-   `js/`: Lógica JavaScript (app.js, config.js, e a pasta logic/).
-   `assets/`: Placeholders para imagens, áudio e animações Lottie.

## 🖼️ Assets Visuais

Os arquivos de imagem (Slimes, Itens, Figurinhas) são placeholders. Você deve gerar os assets usando uma IA de Imagem e colocá-los nas pastas correspondentes dentro de `assets/img/`.

-   `assets/img/slimes/`: Sprites dos Slimes.
-   `assets/img/lab_items/`: Itens de customização do Laboratório.
-   `assets/lottie/`: Arquivos JSON para animações complexas.
