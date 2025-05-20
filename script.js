document.addEventListener('DOMContentLoaded', () => {
    const personagensDiv = document.getElementById('personagens');
    const addPersonagemBtn = document.getElementById('add-personagem-btn');
    const generateFanficBtn = document.getElementById('generate-fanfic-btn');
    const clearPersonagensBtn = document.getElementById('clear-personagens-btn');
    const generoInput = document.getElementById('genero');
    const cenarioInput = document.getElementById('cenario');
    const idiomaSelect = document.getElementById('idioma');
    const responseDiv = document.getElementById('response');

    let personagemCount = 0;

    /**
     * Cria uma nova linha de personagem com campos para função, nome e descrição.
     * @returns {HTMLElement} O elemento div da linha de personagem criada.
     */
    function criarLinhaPersonagem() {
        personagemCount++;
        const linhaPersonagem = document.createElement('div');
        // Apenas a classe "personagem-row" para o layout via CSS customizado
        linhaPersonagem.className = 'personagem-row relative p-4 border border-gray-200 rounded-md';
        linhaPersonagem.dataset.id = personagemCount;

        linhaPersonagem.innerHTML = `
            <select class="personagem-role-select p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:outline-none text-sm text-gray-700">
                <option value="">Escolha o Papel</option>
                <option value="Protagonista">Protagonista</option>
                <option value="Co-protagonista">Co-protagonista</option>
                <option value="Antagonista">Antagonista</option>
                <option value="Mentor">Mentor</option>
                <option value="Aliado">Aliado</option>
                <option value="Vilão Secundário">Vilão Secundário</option>
                <option value="Apoio">Apoio</option>
                <option value="Figurante">Figurante</option>
                </select>
            <input type="text" class="personagem-name-input p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:outline-none text-sm text-gray-700" placeholder="Nome do Personagem">
            <button class="remove-personagem-btn bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">Remover</button>
            <div class="personagem-description-wrapper">
                <label class="block text-xs font-medium text-gray-500 mb-1">Descrição (opcional)</label>
                <textarea class="personagem-description-input w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:outline-none text-sm text-gray-700" placeholder="Ex: tímido, possui super força, busca vingança" rows="2" maxlength="200"></textarea>
            </div>
        `;

        const removeBtn = linhaPersonagem.querySelector('.remove-personagem-btn');
        removeBtn.addEventListener('click', () => {
            linhaPersonagem.remove();
            toggleClearPersonagensButton();
        });

        personagensDiv.appendChild(linhaPersonagem);
        toggleClearPersonagensButton();
        return linhaPersonagem;
    }

    function toggleClearPersonagensButton() {
        if (personagensDiv.children.length > 0) {
            clearPersonagensBtn.disabled = false;
            clearPersonagensBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            clearPersonagensBtn.disabled = true;
            clearPersonagensBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }

    function clearAllFields() {
        personagensDiv.innerHTML = '';
        generoInput.value = '';
        cenarioInput.value = '';
        idiomaSelect.value = 'Português';
        personagemCount = 0;
        responseDiv.classList.add('hidden');
        responseDiv.innerHTML = '';
        toggleClearPersonagensButton();
        // Adicionar a primeira linha de personagem novamente após limpar tudo
        criarLinhaPersonagem(); 
    }

    // Adiciona a primeira linha de personagem ao carregar a página
    criarLinhaPersonagem();

    // Event Listeners para os botões
    addPersonagemBtn.addEventListener('click', criarLinhaPersonagem);
    clearPersonagensBtn.addEventListener('click', clearAllFields);

    generateFanficBtn.addEventListener('click', async () => {
        responseDiv.classList.remove('hidden');
        responseDiv.innerHTML = `
            <div class="flex items-center justify-center">
                <svg class="animate-spin h-8 w-8 text-teal-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C4 0 0 4 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-gray-700 text-md">A IA está escrevendo...</span>
            </div>
        `;

        const personagens = [];
        document.querySelectorAll('.personagem-row').forEach(linha => {
            const role = linha.querySelector('.personagem-role-select').value; // Restaura a captura do papel
            const name = linha.querySelector('.personagem-name-input').value;
            const description = linha.querySelector('.personagem-description-input').value;

            if (role && name) { // Agora exige papel e nome
                personagens.push({ role, name, description });
            }
        });

        const data = {
            personagens: personagens,
            genero: generoInput.value,
            cenario: cenarioInput.value,
            idioma: idiomaSelect.value
        };

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao gerar a fanfic.');
            }

            const fanficData = await response.json();
            displayFanfic(fanficData.fanfic);

        } catch (error) {
            responseDiv.innerHTML = `<p class="text-red-600 text-center">${error.message}</p>`;
            console.error('Erro:', error);
        }
    });

    /**
     * Exibe a fanfic gerada na área de resposta.
     * @param {Array<Object>} fanfic - Um array de objetos, onde cada objeto tem 'titulo' e 'historia'.
     */
    function displayFanfic(fanfic) {
        responseDiv.innerHTML = '';
        responseDiv.classList.remove('hidden');

        fanfic.forEach(capitulo => {
            const capituloDiv = document.createElement('div');
            capituloDiv.className = 'mb-6 p-4 border border-gray-100 rounded-lg bg-gray-50';

            const titulo = document.createElement('h3');
            titulo.className = 'text-lg font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-2';
            titulo.textContent = capitulo.titulo;
            capituloDiv.appendChild(titulo);

            capitulo.historia.forEach(paragrafo => {
                const p = document.createElement('p');
                p.className = 'text-gray-700 leading-relaxed mb-3';
                p.textContent = paragrafo;
                capituloDiv.appendChild(p);
            });
            responseDiv.appendChild(capituloDiv);
        });
    }

    toggleClearPersonagensButton();
});