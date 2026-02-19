/**
 * main.js
 * Lógica para renderização dinâmica dos cards de cursos na página inicial
 */

/**
 * Gera o nome do arquivo de imagem baseado no título do curso
 * @param {string} titulo - Título do curso
 * @returns {string} Nome do arquivo de imagem (sem extensão)
 */
function gerarNomeImagem(titulo) {
    // Mapeamento direto dos títulos para os nomes dos arquivos
    const mapeamento = {
        'Empreendedorismo': 'Empreendedorismo',
        'Gestão de Recursos Humanos': 'Gestão-de-Recursos-Humanos',
        'Analista de Vendas': 'Analista-de-Vendas',
        'Arbitragem e Mediação de Conflitos': 'Arbitragem-e-Mediação-de-Conflitos',
        'Gestão de Redes Sociais': 'Gestão-de-Redes-Sociais',
        'Fluxo de Caixa': 'Fluxo-de-Caixa',
        'Administração de Servidores': 'Administração-de-Servidores',
        'Administração Financeira e Orçamentária': 'Administração-Financeira-e-Orçamentária',
        'Administração Mercadológica': 'Administração-Mercadológica',
        'Distúrbios de Aprendizagem': 'Distúrbios-de-Aprendizagem',
        'Neuroeducação e Tecnologias Educacionais': 'Neuroeducação-e-Tecnologias-Educacionais',
        'Práticas do Secretariado Escolar': 'Práticas-do-Secretariado-Escolar',
        'Perícia, Avaliação e Arbitragem': 'Perícia,-Avaliação-e-Arbitragem'
    };
    
    return mapeamento[titulo] || null;
}

/**
 * Cria o elemento de imagem para o card do curso
 * @param {Object} curso - Objeto contendo os dados do curso
 * @returns {HTMLElement|null} Elemento img ou null se não houver imagem
 */
function criarImagemCard(curso) {
    const nomeImagem = gerarNomeImagem(curso.titulo);
    
    if (!nomeImagem) {
        // Retornar um div vazio para manter o espaço
        const placeholder = document.createElement('div');
        placeholder.className = 'curso-imagem-placeholder';
        return placeholder;
    }
    
    const imagemContainer = document.createElement('div');
    imagemContainer.className = 'curso-imagem-container';
    
    const imagemDesktop = document.createElement('img');
    imagemDesktop.src = `img/${nomeImagem}-DESKTOP.png`;
    imagemDesktop.alt = curso.titulo;
    imagemDesktop.className = 'curso-imagem curso-imagem-desktop';
    imagemDesktop.loading = 'lazy';
    
    const imagemMobile = document.createElement('img');
    imagemMobile.src = `img/${nomeImagem}-MOBILE.png`;
    imagemMobile.alt = curso.titulo;
    imagemMobile.className = 'curso-imagem curso-imagem-mobile';
    imagemMobile.loading = 'lazy';
    
    // Tratamento de erro caso a imagem não exista
    let imagensCarregadas = 0;
    const totalImagens = 2;
    
    const verificarCarregamento = () => {
        imagensCarregadas++;
        if (imagensCarregadas === totalImagens && (imagemDesktop.style.display === 'none' && imagemMobile.style.display === 'none')) {
            // Se ambas as imagens falharam, substituir por placeholder
            imagemContainer.innerHTML = '';
            const placeholder = document.createElement('div');
            placeholder.className = 'curso-imagem-placeholder';
            imagemContainer.appendChild(placeholder);
        }
    };
    
    imagemDesktop.onerror = function() {
        this.style.display = 'none';
        verificarCarregamento();
    };
    imagemMobile.onerror = function() {
        this.style.display = 'none';
        verificarCarregamento();
    };
    
    imagemDesktop.onload = verificarCarregamento;
    imagemMobile.onload = verificarCarregamento;
    
    imagemContainer.appendChild(imagemDesktop);
    imagemContainer.appendChild(imagemMobile);
    
    return imagemContainer;
}

/**
 * Cria um elemento card para um curso específico
 * @param {Object} curso - Objeto contendo os dados do curso
 * @returns {HTMLElement} Elemento div com a estrutura do card
 */
function criarCardCurso(curso) {
    // Criar o elemento card
    const card = document.createElement('div');
    card.className = 'curso-card';
    
    // Criar a imagem do curso
    const imagemCard = criarImagemCard(curso);
    if (imagemCard) {
        card.appendChild(imagemCard);
    }
    
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
    
    // Filtrar apenas cursos disponíveis para preencher as áreas
    const cursosDisponiveis = window.cursos.filter(curso => curso.disponivel !== false);
    const areas = [...new Set(cursosDisponiveis.map(curso => curso.area).filter(area => area))];
    areas.sort();
    
    areas.forEach(area => {
        const option = document.createElement('option');
        option.value = area;
        option.textContent = area;
        filtroArea.appendChild(option);
    });
}

/**
 * Renderiza os cursos na grade agrupados por categoria (com filtragem opcional)
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
    
    // Usar cursos fornecidos ou todos os cursos, filtrando apenas os disponíveis
    const todosCursos = cursosParaRenderizar || window.cursos;
    const cursos = todosCursos.filter(curso => curso.disponivel !== false);
    
    // Limpar o container antes de adicionar os cards
    cursosGrid.innerHTML = '';
    
    if (cursos.length === 0) {
        cursosGrid.innerHTML = '<p class="mensagem-vazia">Nenhum curso encontrado com os filtros aplicados.</p>';
        return;
    }
    
    // Agrupar cursos por área/categoria
    const cursosPorArea = {};
    cursos.forEach(curso => {
        const area = curso.area || 'Outros';
        if (!cursosPorArea[area]) {
            cursosPorArea[area] = [];
        }
        cursosPorArea[area].push(curso);
    });
    
    // Ordenar as áreas
    const areasOrdenadas = Object.keys(cursosPorArea).sort();
    
    // Criar seções hierárquicas para cada área
    areasOrdenadas.forEach(area => {
        // Criar seção da área
        const secaoArea = document.createElement('section');
        secaoArea.className = 'categoria-section';
        
        // Título da categoria
        const tituloCategoria = document.createElement('h2');
        tituloCategoria.className = 'categoria-titulo';
        tituloCategoria.textContent = area;
        secaoArea.appendChild(tituloCategoria);
        
        // Container para os cards da categoria
        const categoriaGrid = document.createElement('div');
        categoriaGrid.className = 'categoria-grid';
        
        // Adicionar cards dos cursos dessa categoria
        cursosPorArea[area].forEach(curso => {
            const card = criarCardCurso(curso);
            categoriaGrid.appendChild(card);
        });
        
        secaoArea.appendChild(categoriaGrid);
        cursosGrid.appendChild(secaoArea);
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
