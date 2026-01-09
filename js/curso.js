/**
 * curso.js
 * Lógica para exibição dos detalhes do curso na página curso.html
 */

/**
 * Obtém um parâmetro da URL via query string
 * @param {string} nome - Nome do parâmetro a ser obtido
 * @returns {string|null} Valor do parâmetro ou null se não existir
 */
function obterParametroURL(nome) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nome);
}

/**
 * Busca um curso pelo ID (string)
 * @param {string} id - ID do curso a ser buscado
 * @returns {Object|undefined} Objeto do curso ou undefined se não encontrado
 */
function buscarCursoPorId(id) {
    // Acessar cursos de window.cursos (definido em data.js)
    if (!window.cursos) {
        console.error('Dados dos cursos não encontrados');
        return undefined;
    }
    return window.cursos.find(curso => curso.id === id);
}

/**
 * Renderiza os detalhes do curso na página
 */
function renderizarDetalhesCurso() {
    const cursoDetalhes = document.getElementById('curso-detalhes');
    
    if (!cursoDetalhes) {
        console.error('Elemento curso-detalhes não encontrado');
        return;
    }
    
    // Verificar se os dados dos cursos estão disponíveis
    if (!window.cursos || window.cursos.length === 0) {
        cursoDetalhes.innerHTML = `
            <p>Erro ao carregar os dados dos cursos.</p>
            <a href="index.html" class="btn-voltar">Voltar para a página principal</a>
        `;
        return;
    }
    
    const cursoId = obterParametroURL('id');
    
    if (!cursoId) {
        cursoDetalhes.innerHTML = `
            <p>ID do curso não fornecido.</p>
            <a href="index.html" class="btn-voltar">Voltar para a página principal</a>
        `;
        return;
    }
    
    const curso = buscarCursoPorId(cursoId);
    
    if (!curso) {
        cursoDetalhes.innerHTML = `
            <p>Curso não encontrado.</p>
            <a href="index.html" class="btn-voltar">Voltar para a página principal</a>
        `;
        return;
    }
    
    // Atualizar o título da página
    document.title = curso.titulo + ' - Cursos de Extensão';
    
    // Criar lista HTML da ementa
    const ementaHTML = curso.ementa.map(topico => `<li>${topico}</li>`).join('');
    
    cursoDetalhes.innerHTML = `
        <h2>${curso.titulo}</h2>
        <div class="curso-info">
            <p><strong>ID:</strong> ${curso.id}</p>
            <p><strong>Duração:</strong> ${curso.duracao}</p>
            <p><strong>Carga Horária:</strong> ${curso.carga_horaria} horas</p>
            <p><strong>Modalidade:</strong> ${curso.modalidade}</p>
        </div>
        <div class="curso-descricao">
            <h3>Descrição</h3>
            <p>${curso.descricao_curta}</p>
        </div>
        <div class="curso-descricao">
            <h3>Ementa</h3>
            <ul class="ementa-lista">
                ${ementaHTML}
            </ul>
        </div>
        <div class="curso-descricao">
            <h3>Público-Alvo</h3>
            <p>${curso.publico_alvo}</p>
        </div>
        <div class="curso-botoes">
            <a href="${curso.link_matricula}" target="_blank" class="btn-matricula">Fazer Matrícula</a>
            <a href="index.html" class="btn-voltar">Voltar para a página principal</a>
        </div>
    `;
}

/**
 * Inicializa a página quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pequeno delay para garantir que data.js foi carregado
    setTimeout(() => {
        renderizarDetalhesCurso();
    }, 100);
});
