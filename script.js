// script.js - Gerador de Fanfics

// Referências aos elementos do DOM
const divPersonagens = document.getElementById('personagens');
const divResposta = document.getElementById('response');
const btnGerarFanfic = document.getElementById('generate-fanfic-btn');
const btnLimparCampos = document.getElementById('clear-personagens-btn');
const btnAdicionarPersonagem = document.getElementById('add-personagem-btn');
const inputGenero = document.getElementById('genero');
const inputCenario = document.getElementById('cenario');
const selectIdioma = document.getElementById('idioma');

// Array de papéis pré-definidos
const papeisDisponiveis = [
    "Protagonista", "Co-protagonista", "Antagonista", "Mentor", "Aliado",
    "Vilão Secundário", "Apoio", "Figurante"
];

function atualizarBotoesRemover() {
    const botoesRemover = divPersonagens.querySelectorAll('.personagem-row .remove-personagem-btn');
    botoesRemover.forEach(botao => {
        botao.disabled = divPersonagens.children.length <= 1;
    });
}

function criarLinhaPersonagem(papelPadrao = "") {
    const linhaPersonagemDiv = document.createElement('div');
    linhaPersonagemDiv.className = 'personagem-row flex items-center space-x-3';

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
        if (papelPadrao === papel) option.selected = true;
        selectPapel.appendChild(option);
    });

    const inputNome = document.createElement('input');
    inputNome.type = 'text';
    inputNome.className = 'personagem-name-input flex-1 p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:outline-none text-sm text-gray-700';
    inputNome.placeholder = `Nome do Personagem`;

    const botaoRemover = document.createElement('button');
    botaoRemover.className = 'remove-personagem-btn bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    botaoRemover.innerText = 'Remover';
    botaoRemover.addEventListener('click', () => {
        linhaPersonagemDiv.remove();
        atualizarBotoesRemover();
    });

    linhaPersonagemDiv.append(selectPapel, inputNome, botaoRemover);
    return linhaPersonagemDiv;
}

function adicionarPersonagem() {
    divPersonagens.appendChild(criarLinhaPersonagem());
    atualizarBotoesRemover();
}

function limparCamposPersonagens() {
    divPersonagens.innerHTML = '';
    divPersonagens.appendChild(criarLinhaPersonagem());
    inputGenero.value = '';
    inputCenario.value = '';
    selectIdioma.value = 'Português';
    atualizarBotoesRemover();
    // A div de resposta deve ser oculta quando os campos são limpos
    divResposta.classList.add('hidden');
    divResposta.innerHTML = ''; // Limpa o conteúdo também
}

function exibirMensagemErro(mensagem) {
    divResposta.innerHTML = `<p class="text-red-600 font-semibold">${mensagem}</p>`;
    // Garante que a div de resposta está visível para exibir a mensagem
    divResposta.classList.remove('hidden');
    divResposta.className = 'response bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-left max-w-xl mx-auto text-red-600';
}

function renderizarFanfic(dadosFanfic) {
    if (!dadosFanfic || !dadosFanfic.titulo || !Array.isArray(dadosFanfic.capitulos)) {
        exibirMensagemErro("Erro ao renderizar: Dados da fanfic no formato inesperado.");
        return;
    }

    let htmlFanfic = `
        <h2 class="text-2xl font-bold mb-4 text-gray-800">${dadosFanfic.titulo}</h2>
    `;

    dadosFanfic.capitulos.forEach(capitulo => {
        htmlFanfic += `
            <div class="mb-6">
                <h3 class="text-xl font-semibold mb-2 text-gray-700">${capitulo.titulo}</h3>
                ${capitulo.historia.map(paragrafo => `<p class="text-gray-700 mb-2">${paragrafo}</p>`).join('')}
            </div>
        `;
    });

    divResposta.innerHTML = htmlFanfic;
    // Garante que a div de resposta está visível após a renderização
    divResposta.classList.remove('hidden'); // <-- Adicionado para garantir visibilidade
    divResposta.className = 'response bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6 text-left max-w-xl mx-auto';
}

async function enviarFormulario() {
    btnGerarFanfic.disabled = true;
    btnGerarFanfic.innerHTML = '<svg class="animate-spin h-5 w-5 text-white inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C4 0 0 4 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Gerando...';
    
    // Prepara e exibe o spinner de carregamento inicial
    divResposta.innerHTML = `
        <div class="flex items-center justify-center">
            <svg class="animate-spin h-8 w-8 text-teal-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C4 0 0 4 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-700 text-md">A IA está escrevendo...</span>
        </div>
    `;
    divResposta.classList.remove('hidden'); // Garante que o spinner é visível

    const personagens = Array.from(divPersonagens.querySelectorAll('.personagem-row')).map(linha => {
        const nome = linha.querySelector('.personagem-name-input').value.trim();
        const papel = linha.querySelector('.personagem-role-select').value.trim();
        return nome ? { nome, papel } : null;
    }).filter(p => p);

    if (personagens.length < 1) { 
        alert('Por favor, preencha pelo menos um campo de personagem para gerar uma fanfic!');
        divResposta.classList.add('hidden'); // Oculta a div se a validação falhar
        return;
    }

    const dados = {
        personagens: personagens,
        genero: inputGenero.value.trim(),
        cenario: inputCenario.value.trim(),
        idioma: selectIdioma.value
    };

    try {
        const resposta = await fetch('https://projeto-fic-writer.vercel.app/fanfic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (resposta.ok && resultado && resultado.titulo && Array.isArray(resultado.capitulos)) {
            renderizarFanfic(resultado);
            // NÃO LIMPE OS CAMPOS AQUI SE VOCÊ QUER VER A FANFIC!
            // limparCamposPersonagens(); // <-- COMENTADO/REMOVIDO AQUI
        } else if (resultado && resultado.error) {
            exibirMensagemErro(`Erro da API: ${resultado.error}`);
        } else {
            exibirMensagemErro('Erro: Formato de resposta inesperado da API.');
        }
    } catch (error) {
        exibirMensagemErro(`Ocorreu um erro ao tentar comunicar com o servidor: ${error.message}`);
    } finally {
        btnGerarFanfic.disabled = false;
        btnGerarFanfic.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-1 -ml-1"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 5.656L10 10.656l1.172-1.172a4 4 0 015.656-5.656 4 4 0 11-5.656 5.656L10 11.344l-1.172 1.172a4 4 0 01-5.656-5.656z" clip-rule="evenodd" /></svg>Gerar Conto';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    btnAdicionarPersonagem.addEventListener('click', adicionarPersonagem);
    btnGerarFanfic.addEventListener('click', enviarFormulario);
    btnLimparCampos.addEventListener('click', limparCamposPersonagens);

    // Inicializa com um campo de personagem
    if (divPersonagens.querySelectorAll('.personagem-row').length === 0) {
        divPersonagens.appendChild(criarLinhaPersonagem());
    }
    atualizarBotoesRemover();
    selectIdioma.value = 'Português';

    // Garante que a div de resposta começa oculta no carregamento inicial
    divResposta.classList.add('hidden');
    divResposta.innerHTML = ''; // Limpa qualquer conteúdo residual
});