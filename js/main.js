/**
 * main.js
 * Lógica para renderização dinâmica dos cards de cursos na página inicial
 */

/**
 * Cria um elemento card para um curso específico
 * @param {Object} curso - Objeto contendo os dados do curso
 * @returns {HTMLElement} Elemento div com a estrutura do card
 */
function criarCardCurso(curso) {
    // Criar o elemento card
    const card = document.createElement('div');
    card.className = 'curso-card';
    
    // Criar o conteúdo do card
    const cardContent = document.createElement('div');
    cardContent.className = 'curso-card-content';
    
    // Criar container para o conteúdo (título, descrição, duração)
    const conteudoContainer = document.createElement('div');
    conteudoContainer.className = 'curso-conteudo';
    
    // Título do curso
    const titulo = document.createElement('h2');
    titulo.textContent = curso.titulo;
    
    // Descrição curta
    const descricao = document.createElement('p');
    descricao.textContent = curso.descricao_curta;
    
    // Duração
    const duracao = document.createElement('div');
    duracao.className = 'curso-info';
    duracao.innerHTML = `<strong>Duração:</strong> ${curso.duracao}`;
    
    // Botão "Acesse aqui"
    const botaoAcesso = document.createElement('a');
    botaoAcesso.href = `curso.html?id=${curso.id}`;
    botaoAcesso.className = 'btn-acessar';
    botaoAcesso.textContent = 'Acesse aqui';
    
    // Montar a estrutura do card
    conteudoContainer.appendChild(titulo);
    conteudoContainer.appendChild(descricao);
    conteudoContainer.appendChild(duracao);
    cardContent.appendChild(conteudoContainer);
    cardContent.appendChild(botaoAcesso);
    card.appendChild(cardContent);
    
    return card;
}

/**
 * Filtra os cursos com base nos critérios de busca
 * @param {Array} cursos - Array de cursos para filtrar
 * @param {string} nomeFiltro - Texto para filtrar por nome
 * @param {string} areaFiltro - Área para filtrar
 * @returns {Array} Array de cursos filtrados
 */
function filtrarCursos(cursos, nomeFiltro, areaFiltro) {
    return cursos.filter(curso => {
        const nomeMatch = !nomeFiltro || curso.titulo.toLowerCase().includes(nomeFiltro.toLowerCase());
        const areaMatch = !areaFiltro || curso.area === areaFiltro;
        return nomeMatch && areaMatch;
    });
}

/**
 * Preenche o select de áreas com as áreas disponíveis
 */
function preencherAreas() {
    const filtroArea = document.getElementById('filtro-area');
    if (!filtroArea || !window.cursos) return;
    
    const areas = [...new Set(window.cursos.map(curso => curso.area).filter(area => area))];
    areas.sort();
    
    areas.forEach(area => {
        const option = document.createElement('option');
        option.value = area;
        option.textContent = area;
        filtroArea.appendChild(option);
    });
}

/**
 * Renderiza os cursos na grade (com filtragem opcional)
 * @param {Array} cursosParaRenderizar - Array de cursos a serem renderizados (opcional)
 */
function renderizarCursos(cursosParaRenderizar = null) {
    // Obter o container da grade
    const cursosGrid = document.getElementById('cursos-grid');
    
    // Verificar se o elemento existe
    if (!cursosGrid) {
        console.error('Elemento cursos-grid não encontrado no DOM');
        return;
    }
    
    // Verificar se os dados estão disponíveis (usar window.cursos definido em data.js)
    if (!window.cursos || window.cursos.length === 0) {
        cursosGrid.innerHTML = '<p class="mensagem-vazia">Nenhum curso disponível no momento.</p>';
        return;
    }
    
    // Usar cursos fornecidos ou todos os cursos
    const cursos = cursosParaRenderizar || window.cursos;
    
    // Limpar o container antes de adicionar os cards
    cursosGrid.innerHTML = '';
    
    if (cursos.length === 0) {
        cursosGrid.innerHTML = '<p class="mensagem-vazia">Nenhum curso encontrado com os filtros aplicados.</p>';
        return;
    }
    
    // Criar e adicionar um card para cada curso
    cursos.forEach(curso => {
        const card = criarCardCurso(curso);
        cursosGrid.appendChild(card);
    });
}

/**
 * Aplica os filtros e renderiza os cursos
 */
function aplicarFiltros() {
    const filtroNome = document.getElementById('filtro-nome');
    const filtroArea = document.getElementById('filtro-area');
    
    if (!filtroNome || !filtroArea || !window.cursos) return;
    
    const nomeFiltro = filtroNome.value.trim();
    const areaFiltro = filtroArea.value;
    
    const cursosFiltrados = filtrarCursos(window.cursos, nomeFiltro, areaFiltro);
    renderizarCursos(cursosFiltrados);
}

/**
 * Inicializa a página quando o DOM estiver completamente carregado
 * Garante que os scripts data.js e main.js sejam executados na ordem correta
 */
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pequeno delay para garantir que data.js foi carregado
    // Isso é necessário porque os scripts são carregados de forma assíncrona
    setTimeout(() => {
        preencherAreas();
        renderizarCursos();
        
        // Adicionar event listeners para os filtros
        const filtroNome = document.getElementById('filtro-nome');
        const filtroArea = document.getElementById('filtro-area');
        
        if (filtroNome) {
            filtroNome.addEventListener('input', aplicarFiltros);
        }
        
        if (filtroArea) {
            filtroArea.addEventListener('change', aplicarFiltros);
        }
    }, 100);
});
