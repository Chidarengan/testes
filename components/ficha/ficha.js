// ficha.js
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona a funcionalidade de clique a todos os elementos com a classe 'circle'
    const circles = document.querySelectorAll('.circle');
    
    circles.forEach(circle => {
        // Função para alternar o preenchimento
        const toggleFill = () => {
            circle.classList.toggle('filled');
        };

        // Adiciona evento de clique
        circle.addEventListener('click', toggleFill);

        // Adiciona acessibilidade via teclado (Enter ou Espaço)
        circle.setAttribute('tabindex', '0'); // Torna o círculo focável
        circle.setAttribute('role', 'button'); // Define a função como um botão
        circle.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); // Impede o comportamento padrão (ex: rolar a página com espaço)
                toggleFill();
            }
        });
    });
});