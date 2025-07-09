// build.js
// Este script lê todos os arquivos HTML, CSS e JS do projeto e os combina em um único arquivo HTML.

// 1. Importa o módulo 'fs' (File System) para interagir com os arquivos do computador.
const fs = require('fs');
// 2. Importa o módulo 'path' para lidar com caminhos de arquivos de forma segura.
const path = require('path');

console.log("Iniciando o processo de build...");

try {
    // 3. Define os caminhos para todos os arquivos que serão incluídos.
    const paths = {
        html: 'index.html',
        globalCss: path.join('assets', 'css', 'global.css'),
        indexCss: path.join('assets', 'css', 'index.css'),
        globalJs: path.join('assets', 'js', 'global.js'),
        indexJs: path.join('assets', 'js', 'index.js'),
        
        // Caminhos para os arquivos dos iframes
        // Se algum desses arquivos não existir, o script vai dar erro. 
        // Você pode comentar ou remover as linhas dos arquivos que não tem.
        fichaHtml: path.join('components', 'ficha', 'ficha.html'),
        equipCardsHtml: path.join('components', 'equip-cards', 'equip-cards.html'),
        weaponListHtml: path.join('components', 'lista-armas', 'lista-armas.html'),
        
        // Arquivo de saída
        output: 'manual_completo.html'
    };

    // 4. Função para ler um arquivo. Se não encontrar, retorna uma string vazia e avisa no console.
    const readFile = (filePath) => {
        try {
            return fs.readFileSync(filePath, 'utf-8');
        } catch (error) {
            console.warn(`Aviso: Arquivo não encontrado em "${filePath}". Será ignorado.`);
            return '';
        }
    };

    // 5. Lê o conteúdo de todos os arquivos.
    console.log("Lendo arquivos...");
    const globalCssContent = readFile(paths.globalCss);
    const indexCssContent = readFile(paths.indexCss);
    const globalJsContent = readFile(paths.globalJs);
    const indexJsContent = readFile(paths.indexJs);
    
    // Lê o conteúdo dos iframes
    const fichaHtmlContent = readFile(paths.fichaHtml);
    const equipCardsHtmlContent = readFile(paths.equipCardsHtml);
    const weaponListHtmlContent = readFile(paths.weaponListHtml);

    // 6. Lê o arquivo HTML principal que servirá de base.
    let finalHtml = readFile(paths.html);
    if (!finalHtml) {
        throw new Error(`Arquivo principal "${paths.html}" não encontrado. O script não pode continuar.`);
    }

    // 7. Monta o conteúdo CSS e JS para ser injetado no HTML.
    const finalCss = `<style>\n${globalCssContent}\n\n${indexCssContent}\n</style>`;
    const finalJs = `<script>\n${globalJsContent}\n\n${indexJsContent}\n</script>`;

    // 8. Substitui os links de CSS e JS no HTML pelo conteúdo real dos arquivos.
    console.log("Injetando CSS e JavaScript...");
    // Remove as linhas <link> de CSS e substitui pela tag <style>
    finalHtml = finalHtml.replace(/<link.*href=".*global\.css".*>/, '');
    finalHtml = finalHtml.replace(/<link.*href=".*index\.css".*>/, finalCss);
    
    // Remove as linhas <script> externas e substitui pela tag <script> com o conteúdo
    finalHtml = finalHtml.replace(/<script.*src=".*global\.js".*><\/script>/, '');
    finalHtml = finalHtml.replace(/<script.*src=".*index\.js".*><\/script>/, finalJs);

    // 9. Injeta o conteúdo dos iframes usando o atributo 'srcdoc'.
    // Isso faz com que o conteúdo do iframe venha do próprio arquivo HTML principal.
    console.log("Injetando conteúdo dos iframes...");
    finalHtml = finalHtml.replace(
        'src="components/ficha/ficha.html"', 
        `srcdoc="${fichaHtmlContent.replace(/"/g, '&quot;')}"`
    );
    finalHtml = finalHtml.replace(
        'src="components/equip-cards/equip-cards.html"', 
        `srcdoc="${equipCardsHtmlContent.replace(/"/g, '&quot;')}"`
    );
    finalHtml = finalHtml.replace(
        'src="components/lista-armas/lista-armas.html"', 
        `srcdoc="${weaponListHtmlContent.replace(/"/g, '&quot;')}"`
    );

    // 10. Escreve o resultado final em um novo arquivo HTML.
    fs.writeFileSync(paths.output, finalHtml);

    console.log(`\nProcesso concluído com sucesso!`);
    console.log(`Seu arquivo unificado foi criado em: ${path.resolve(paths.output)}`);

} catch (error) {
    console.error("\nOcorreu um erro durante o processo de build:", error);
}
