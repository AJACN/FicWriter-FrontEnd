// script.js - Traduzido para Português e Atualizado com Mínimo 1 Personagem e Papéis Customizados

// Referências aos elementos importantes no DOM
const divPersonagens = document.getElementById('personagens');
const divResposta = document.getElementById('response');
const btnGerarFanfic = document.getElementById('generate-fanfic-btn');
const btnLimparCampos = document.getElementById('clear-personagens-btn');
const btnAdicionarPersonagem = document.getElementById('add-personagem-btn'); // Referência ao novo botão
// Elementos para Gênero e Cenário
const inputGenero = document.getElementById('genero');
const inputCenario = document.getElementById('cenario');

// Array de papéis pré-definidos
const papeisDisponiveis = [
    "Protagonista", "Co-protagonista", "Antagonista", "Mentor", "Aliado",
    "Vilão Secundário", "Apoio", "Figurante"
];

function atualizarBotoesRemover() {
    const botoesRemover = divPersonagens.querySelectorAll('.personagem-row .remove-personagem-btn');
    const linhasPersonagem = divPersonagens.querySelectorAll('.personagem-row');
    const contadorLinhas = linhasPersonagem.length;

    // Desabilita o botão de remover se houver apenas 1 personagem
    botoesRemover.forEach(botao => {
        botao.disabled = contadorLinhas <= 1;
    });
}

function criarLinhaPersonagem(papelPadrao = "") {
    const linhaPersonagemDiv = document.createElement('div');
    linhaPersonagemDiv.className = 'personagem-row flex items-center space-x-3';

    // Dropdown para o Papel do Personagem
    const selectPapel = document.createElement('select');
    selectPapel.className = 'personagem-role-select p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:outline-none text-sm text-gray-700';

    const optionDefault = document.createElement('option');
    optionDefault.value = "";
    optionDefault.innerText = "Escolha o Papel";
    selectPapel.appendChild(optionDefault);

    papeisDisponiveis.forEach(papel => {
        const option = document.createElement('option');
        option.value = papel;
        option.innerText = papel;
        if (papelPadrao === papel) {
            option.selected = true;
        }
        selectPapel.appendChild(option);
    });

    // Input para o Nome do Personagem
    const inputNome = document.createElement('input');
    inputNome.type = 'text';
    inputNome.className = 'personagem-name-input flex-1 p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:outline-none text-sm text-gray-700';
    inputNome.placeholder = `Nome do Personagem`;

    // Botão Remover
    const botaoRemover = document.createElement('button');
    botaoRemover.className = 'remove-personagem-btn bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    botaoRemover.innerText = 'Remover';
    botaoRemover.addEventListener('click', () => removerPersonagem(botaoRemover));

    linhaPersonagemDiv.appendChild(selectPapel);
    linhaPersonagemDiv.appendChild(inputNome);
    linhaPersonagemDiv.appendChild(botaoRemover);

    return linhaPersonagemDiv;
}

function adicionarPersonagem() {
    const novaLinha = criarLinhaPersonagem();
    divPersonagens.appendChild(novaLinha);
    atualizarBotoesRemover();
}

function removerPersonagem(botao) {
    const linhaPersonagem = botao.parentElement;
    if (linhaPersonagem) {
        linhaPersonagem.remove();
    } else {
        console.error('[removerPersonagem] Não foi possível encontrar o elemento pai (personagem-row) para remover.');
    }
    atualizarBotoesRemover();
}

function limparCamposPersonagens() {
    // Remove todas as linhas de personagem exceto a primeira
    const linhasPersonagem = divPersonagens.querySelectorAll('.personagem-row');
    linhasPersonagem.forEach((linha, index) => {
        if (index > 0) { // Mantém apenas a primeira linha
            linha.remove();
        } else {
            linha.querySelector('.personagem-role-select').value = ""; // Limpa o papel da primeira linha
            linha.querySelector('.personagem-name-input').value = ""; // Limpa o nome da primeira linha
        }
    });

    // Limpa os campos de gênero e cenário
    inputGenero.value = '';
    inputCenario.value = '';

    atualizarBotoesRemover(); // Atualiza os botões de remover após a limpeza
}

/**
 * @function renderizarFanfic
 * @description Constrói dinamicamente o HTML da fanfic a partir do objeto JSON
 * retornado pela API e o exibe na área de resposta designada.
 * @param {object} dadosFanfic - O objeto JSON contendo os dados da fanfic (titulo, capitulos).
 */
function renderizarFanfic(dadosFanfic) {
    if (!dadosFanfic || typeof dadosFanfic !== 'object' || !dadosFanfic.titulo || !Array.isArray(dadosFanfic.capitulos)) {
        console.error("Erro ao renderizar: Dados da fanfic no formato inesperado.", dadosFanfic);
        divResposta.innerHTML = '<p class="text-red-600 font-semibold">Erro ao renderizar a fanfic recebida.</p>';
        divResposta.className = 'response bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-left max-w-xl mx-auto text-red-600';
        return;
    }

    let htmlFanfic = `
        <h2 class="text-2xl font-bold mb-4 text-gray-800">${dadosFanfic.titulo}</h2>
    `;

    dadosFanfic.capitulos.forEach((capitulo, index) => {
        htmlFanfic += `
            <div class="mb-6">
                <h3 class="text-xl font-semibold mb-2 text-gray-700">Capítulo ${index + 1}: ${capitulo.titulo}</h3>
                ${capitulo.historia.map(paragrafo => `<p class="text-gray-700 mb-2">${paragrafo}</p>`).join('')}
            </div>
        `;
    });

    divResposta.innerHTML = htmlFanfic;
    divResposta.className = 'response bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-left max-w-xl mx-auto';
}

async function enviarFormulario() {
    console.log('[enviarFormulario] Processando e enviando formulário...');
    btnGerarFanfic.disabled = true;
    btnGerarFanfic.innerHTML = '<svg class="animate-spin h-5 w-5 text-white inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C4 0 0 4 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Gerando...';
    
    // Mostra o spinner de carregamento inicial
    divResposta.innerHTML = `
        <div class="flex items-center justify-center">
            <svg class="animate-spin h-8 w-8 text-teal-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C4 0 0 4 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-700 text-md">A IA está escrevendo...</span>
        </div>
    `;
    divResposta.classList.remove('hidden');

    const personagens = [];
    const linhasPersonagem = divPersonagens.querySelectorAll('.personagem-row');
    linhasPersonagem.forEach(linha => {
        const selectPapel = linha.querySelector('.personagem-role-select');
        const inputNome = linha.querySelector('.personagem-name-input');
        
        const nome = inputNome.value.trim();
        const papel = selectPapel.value.trim();

        if (nome) { // Apenas adiciona se o nome do personagem não estiver vazio
            personagens.push({ nome: nome, papel: papel });
        }
    });

    const genero = inputGenero.value.trim();
    const cenario = inputCenario.value.trim();

    console.log('[enviarFormulario] Personagens coletados:', personagens);
    console.log('[enviarFormulario] Gênero coletado:', genero);
    console.log('[enviarFormulario] Cenário coletado:', cenario);

    if (personagens.length < 1) { // Validação: mínimo de 1 personagem
        alert('Por favor, preencha pelo menos um campo de personagem para gerar uma fanfic!');
        console.warn('[enviarFormulario] Validação falhou: Menos de 1 personagem.');
        divResposta.classList.add('hidden');
        btnGerarFanfic.disabled = false;
        btnGerarFanfic.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-1 -ml-1"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 5.656L10 10.656l1.172-1.172a4 4 0 015.656-5.656 4 4 0 11-5.656 5.656L10 11.344l-1.172 1.172a4 4 0 01-5.656-5.656z" clip-rule="evenodd" /></svg>Gerar Conto';
        return;
    }

    const dados = {
        personagens: personagens,
        genero: genero,
        cenario: cenario
    };
    console.log('[enviarFormulario] Dados preparados para API:', dados);

    try {
        console.log('[enviarFormulario] Enviando requisição para API...');
        const resposta = await fetch('https://projeto-fic-writer.vercel.app/fanfic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        console.log('[enviarFormulario] Resposta da API recebida (Status: ' + resposta.status + ').');

        const resultado = await resposta.json();
        console.log('[enviarFormulario] Resposta JSON parseada:', resultado);

        if (resposta.ok && resultado && typeof resultado === 'object' && resultado.titulo && Array.isArray(resultado.capitulos)) {
            console.log('[enviarFormulario] Objeto de fanfic válido encontrado. Renderizando.');
            renderizarFanfic(resultado);
            limparCamposPersonagens(); // Limpa os campos após a geração bem-sucedida
            divResposta.className = 'response bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-left max-w-xl mx-auto';
        } else if (resultado && typeof resultado === 'object' && resultado.error) {
            console.error('[enviarFormulario] API retornou objeto de erro:', resultado.error);
            divResposta.innerHTML = `<p class="text-red-600 font-semibold">Erro da API: ${resultado.error}</p>`;
            divResposta.className = 'response bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-left max-w-xl mx-auto text-red-600';
        } else {
            console.error('[enviarFormulario] API retornou formato inesperado:', resultado);
            divResposta.innerHTML = '<p class="text-red-600 font-semibold">Erro: Formato de resposta inesperado da API.</p>';
            divResposta.className = 'response bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-left max-w-xl mx-auto text-red-600';
        }

        divResposta.classList.remove('hidden');

    } catch (error) {
        console.error('[enviarFormulario] Erro no Fetch ou parsing JSON:', error);
        divResposta.innerHTML = `<p class="text-red-600 font-semibold">Ocorreu um erro ao tentar comunicar com o servidor: ${error.message}</p>`;
        divResposta.className = 'response bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-left max-w-xl mx-auto text-red-600';
        divResposta.classList.remove('hidden');

    } finally {
        btnGerarFanfic.disabled = false;
        btnGerarFanfic.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-1 -ml-1"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 5.656L10 10.656l1.172-1.172a4 4 0 015.656-5.656 4 4 0 11-5.656 5.656L10 11.344l-1.172 1.172a4 4 0 01-5.656-5.656z" clip-rule="evenodd" /></svg>Gerar Conto';
        console.log('[enviarFormulario] Finalizado.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM completamente carregado.');

    // Adiciona o event listener para o botão de adicionar personagem
    btnAdicionarPersonagem.addEventListener('click', adicionarPersonagem);
    console.log('Event listener adicionado ao botão "Adicionar Personagem".');

    btnGerarFanfic.addEventListener('click', enviarFormulario);
    console.log('Event listener adicionado ao botão "Gerar Fanfic".');

    btnLimparCampos.addEventListener('click', limparCamposPersonagens);
    console.log('Event listener adicionado ao botão "Limpar Campos".');

    // Inicializa a visibilidade dos botões de remover
    atualizarBotoesRemover();
    console.log('atualizarBotoesRemover chamado na inicialização.');

    // Certifica-se de que a primeira linha de personagem tem o event listener para remover
    const botoesRemoverIniciais = divPersonagens.querySelectorAll('.personagem-row .remove-personagem-btn');
    botoesRemoverIniciais.forEach(botao => {
        botao.addEventListener('click', () => removerPersonagem(botao));
    });
});