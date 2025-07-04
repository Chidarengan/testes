// index.js
document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA PARA CONTEÚDO EXPANSÍVEL (COLLAPSIBLE) ---
    function setupCollapsible(buttonId, contentId, iconId) {
        const button = document.getElementById(buttonId);
        const content = document.getElementById(contentId);
        const icon = document.getElementById(iconId);
        const transitionDuration = 500; // Deve ser a mesma do CSS

        if (!button || !content || !icon) return; // Se os elementos não existirem, não faz nada

        content.classList.add('closed-display-none');

        button.addEventListener('click', function(event) {
            event.preventDefault();
            if (content.classList.contains('open')) {
                content.classList.remove('open');
                icon.classList.remove('rotated');
                setTimeout(() => {
                    content.classList.add('closed-display-none');
                }, transitionDuration);
            } else {
                content.classList.remove('closed-display-none');
                void content.offsetWidth; // Força o navegador a recalcular o layout
                content.classList.add('open');
                icon.classList.add('rotated');
            }
        });
    }

    // Configura todos os botões de toggle
    setupCollapsible('toggleAttributeTableButton', 'attributeTable', 'toggleAttributeIcon');
    setupCollapsible('toggleExperienceTableButton', 'experienceTable', 'toggleExperienceIcon');
    setupCollapsible('toggleIndexButton', 'indexContent', 'toggleIndexIcon');
    setupCollapsible('toggleWeaponListButton', 'weaponListContent', 'toggleWeaponListIcon');


    // --- LÓGICA PARA A CALCULADORA DE PONTOS DE VIDA (PV) ---
    const calculateHpButton = document.getElementById('calculateHp');
    if (calculateHpButton) {
        const hpClassSelect = document.getElementById('hpClass');
        const hpLevelInput = document.getElementById('hpLevel');
        const hpConInput = document.getElementById('hpCon');
        const hpResultDiv = document.getElementById('hpResult');

        calculateHpButton.addEventListener('click', function() {
            const selectedClass = hpClassSelect.value;
            const level = parseInt(hpLevelInput.value);
            const conScore = parseInt(hpConInput.value);

            if (isNaN(level) || level < 1 || isNaN(conScore)) {
                hpResultDiv.textContent = "Por favor, insira valores válidos.";
                return;
            }

            const conModifier = Math.floor((conScore - 10) / 2);
            let totalHp = 0;
            const hitDieMap = {
                'd12': { max: 12, avg: 7 },
                'd10': { max: 10, avg: 6 },
                'd8':  { max: 8,  avg: 5 },
                'd6':  { max: 6,  avg: 4 }
            };

            const dice = hitDieMap[selectedClass];
            totalHp = dice.max + conModifier; // Nível 1

            if (level > 1) {
                totalHp += (level - 1) * (dice.avg + conModifier);
            }

            hpResultDiv.textContent = `Seu PV Total: ${totalHp}`;
        });
    }


    // --- LÓGICA PARA AJUSTE DE ALTURA DOS IFRAMES ---
    function adjustIframeHeight(iframeId) {
        const iframe = document.getElementById(iframeId);
        if (!iframe) return;

        const setHeight = () => {
            try {
                const iframeDoc = iframe.contentWindow.document;
                const height = iframeDoc.documentElement.scrollHeight;
                iframe.style.height = height + 'px';
                iframe.style.overflow = 'hidden';
            } catch (e) {
                console.warn(`Não foi possível ajustar a altura do iframe '${iframeId}' devido a restrições de segurança (CORS).`, e);
            }
        };

        iframe.onload = setHeight;
        // Caso o iframe já esteja carregado
        if (iframe.contentWindow && iframe.contentWindow.document.readyState === 'complete') {
            setHeight();
        }
    }

    // Ajusta a altura de todos os iframes na página
    adjustIframeHeight('fichaIframe');
    adjustIframeHeight('equipCardsIframe');
    adjustIframeHeight('weaponListIframe');

      // LÓGICA ESPECIAL: Ajusta a altura do iframe de armas QUANDO ele se torna visível.
    // Isso corrige o problema do iframe não aparecer quando está dentro de um container "collapsible".
    const weaponToggleButton = document.getElementById('toggleWeaponListButton');
    if (weaponToggleButton) {
        weaponToggleButton.addEventListener('click', () => {
            // Um pequeno delay para permitir que o CSS comece a transição e o elemento se torne visível.
            setTimeout(() => {
                adjustIframeHeight('weaponListIframe');
            }, 10); 
        });
    }

    // --- LÓGICA PARA ROLAGEM SUAVE (SMOOTH SCROLL) ---
    document.querySelectorAll('#tableOfContents a, .back-to-top').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            } else if (targetId === '#top') {
                 window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });
});