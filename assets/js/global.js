// global.js
// Este arquivo lida com funcionalidades globais como a troca de tema.

document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA PARA O TEMA ESCURO/CLARO ---
    const themeToggleButton = document.getElementById('theme-toggle-button');
    
    // Se o botão de tema não for encontrado na página, o script para aqui para evitar erros.
    if (!themeToggleButton) {
        return;
    }

    // Pega todo o CSS da página principal para injetar nos iframes.
    let parentStyles = '';
    document.querySelectorAll('style').forEach(styleTag => {
        parentStyles += styleTag.textContent;
    });

    /**
     * Aplica o tema visualmente ao corpo principal da página e a todos os iframes.
     * @param {string} theme - O tema a ser aplicado ('dark-theme' ou 'light-theme').
     */
    function applyTheme(theme) {
        // 1. Aplica a classe ao corpo da página principal.
        if (theme === 'dark-theme') {
            document.body.classList.add('dark-theme');
            themeToggleButton.textContent = '☀️'; // Ícone de sol para o modo claro
        } else {
            document.body.classList.remove('dark-theme');
            themeToggleButton.textContent = '🌙'; // Ícone de lua para o modo escuro
        }

        // 2. Encontra todos os iframes e aplica o tema e os estilos a eles.
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            const setupIframe = () => {
                try {
                    const iframeDoc = iframe.contentWindow.document;

                    // INJEÇÃO DE ESTILOS: Injeta os estilos da página pai no iframe
                    // apenas uma vez, para que ele entenda as regras de tema.
                    if (!iframe.dataset.stylesInjected) {
                        const styleElement = iframeDoc.createElement('style');
                        styleElement.textContent = parentStyles;
                        iframeDoc.head.appendChild(styleElement);
                        iframe.dataset.stylesInjected = 'true'; // Marca como injetado
                    }

                    // APLICAÇÃO DO TEMA: Agora que o iframe tem os estilos, aplica a classe do tema.
                    if (theme === 'dark-theme') {
                        iframeDoc.body.classList.add('dark-theme');
                    } else {
                        iframeDoc.body.classList.remove('dark-theme');
                    }
                } catch (e) {
                    console.warn("Não foi possível configurar o iframe:", iframe.id, e);
                }
            };

            // Garante que o iframe esteja carregado antes de tentar manipulá-lo.
            if (iframe.contentWindow && iframe.contentWindow.document.readyState === 'complete') {
                setupIframe();
            } else {
                iframe.onload = setupIframe;
            }
        });
    }

    // 3. Ao carregar a página, verifica se há um tema salvo no navegador.
    const currentTheme = localStorage.getItem('theme') || 'light-theme'; // Usa 'light-theme' como padrão.
    applyTheme(currentTheme);

    // 4. Adiciona o evento de clique ao botão para alternar os temas.
    themeToggleButton.addEventListener('click', () => {
        // Verifica qual é o tema atual para determinar o novo tema.
        let newTheme = document.body.classList.contains('dark-theme') ? 'light-theme' : 'dark-theme';
        
        // Salva a nova preferência no armazenamento local do navegador.
        localStorage.setItem('theme', newTheme);
        
        // Aplica o novo tema visualmente em toda a página e iframes.
        applyTheme(newTheme);
    });
});
