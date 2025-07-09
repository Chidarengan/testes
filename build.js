// build.js
// Este script lê todos os arquivos HTML, CSS e JS do projeto e os combina em um único arquivo HTML.

const fs = require('fs');
const path = require('path');

console.log("Iniciando o processo de build...");

try {
    const paths = {
        html: 'index.html',
        globalCss: path.join('assets', 'css', 'global.css'),
        indexCss: path.join('assets', 'css', 'index.css'),
        globalJs: path.join('assets', 'js', 'global.js'),
        indexJs: path.join('assets', 'js', 'index.js'),
        fichaHtml: path.join('components', 'ficha', 'ficha.html'),
        equipCardsHtml: path.join('components', 'equip-cards', 'equip-cards.html'),
        weaponListHtml: path.join('components', 'lista-armas', 'lista-armas.html'),
        output: 'manual_completo.html'
    };

    const readFile = (filePath) => {
        try {
            return fs.readFileSync(filePath, 'utf-8');
        } catch (error) {
            console.warn(`Aviso: Arquivo não encontrado em "${filePath}". Será ignorado.`);
            return '';
        }
    };

    // 1. Lê todo o conteúdo CSS necessário uma única vez.
    const allCssContent = `${readFile(paths.globalCss)}\n${readFile(paths.indexCss)}`;

    // 2. Lê o conteúdo JS e HTML.
    const globalJsContent = readFile(paths.globalJs);
    const indexJsContent = readFile(paths.indexJs);
    const fichaHtmlContent = readFile(paths.fichaHtml);
    const equipCardsHtmlContent = readFile(paths.equipCardsHtml);
    const weaponListHtmlContent = readFile(paths.weaponListHtml);
    let finalHtml = readFile(paths.html);
    if (!finalHtml) {
        throw new Error(`Arquivo principal "${paths.html}" não encontrado. O script não pode continuar.`);
    }

    // 3. Injeta o CSS e JS na página principal.
    const finalCss = `<style>\n${allCssContent}\n</style>`;
    const finalJs = `<script>\n${globalJsContent}\n\n${indexJsContent}\n</script>`;
    // Substitui de forma mais robusta para evitar problemas
    finalHtml = finalHtml.replace(/<link rel="stylesheet".*>/g, '');
    finalHtml = finalHtml.replace(/<script src=".*"><\/script>/g, '');
    finalHtml = finalHtml.replace('</head>', `${finalCss}\n</head>`);
    finalHtml = finalHtml.replace('</body>', `${finalJs}\n</body>`);

    // 4. Script que será injetado em cada iframe para ouvir as mudanças de tema.
    const iframeListenerScript = `
        <script>
            window.addEventListener('message', function(event) {
                // Verifica se a mensagem é válida e contém um tema
                if (event.data && typeof event.data.theme !== 'undefined') {
                    const theme = event.data.theme;
                    document.body.classList.toggle('dark-theme', theme === 'dark-theme');
                }
            });
        <\/script>
    `;

    // 5. Função para criar um documento HTML completo e autônomo para o srcdoc do iframe.
    const createIframeDoc = (bodyContent) => {
        const bodyMatch = bodyContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const innerBody = bodyMatch ? bodyMatch[1] : bodyContent;

        const fullIframeHtml = `
            <!DOCTYPE html>
            <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>${allCssContent}</style>
                </head>
                <body>
                    ${innerBody}
                    ${iframeListenerScript}
                </body>
            </html>
        `;
        // Escapa as aspas para que o HTML seja uma string válida para o atributo srcdoc.
        return fullIframeHtml.replace(/"/g, '&quot;');
    };

    console.log("Injetando conteúdo autônomo nos iframes...");
    finalHtml = finalHtml.replace('src="components/ficha/ficha.html"', `srcdoc="${createIframeDoc(fichaHtmlContent)}"`);
    finalHtml = finalHtml.replace('src="components/equip-cards/equip-cards.html"', `srcdoc="${createIframeDoc(equipCardsHtmlContent)}"`);
    finalHtml = finalHtml.replace('src="components/lista-armas/lista-armas.html"', `srcdoc="${createIframeDoc(weaponListHtmlContent)}"`);

    fs.writeFileSync(paths.output, finalHtml);

    console.log(`\nProcesso concluído com sucesso!`);
    console.log(`Seu arquivo unificado foi criado em: ${path.resolve(paths.output)}`);

} catch (error) {
    console.error("\nOcorreu um erro durante o processo de build:", error);
}
