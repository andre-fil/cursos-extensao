// Função para obter parâmetros da URL
function obterParametroURL(nome) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nome);
}

// Função para buscar curso por ID
function buscarCursoPorId(id) {
    return cursos.find(curso => curso.id === parseInt(id));
}

// Função para renderizar os detalhes do curso
function renderizarDetalhesCurso() {
    const cursoDetalhes = document.getElementById('curso-detalhes');
    
    if (!cursoDetalhes) {
        console.error('Elemento curso-detalhes não encontrado');
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
    
    cursoDetalhes.innerHTML = `
        <img src="${curso.imagem}" alt="${curso.titulo}">
        <h2>${curso.titulo}</h2>
        <div class="curso-info">
            <p><strong>Categoria:</strong> ${curso.categoria}</p>
            <p><strong>Duração:</strong> ${curso.duracao}</p>
            <p><strong>Nível:</strong> ${curso.nivel}</p>
        </div>
        <div class="curso-descricao">
            <h3>Descrição</h3>
            <p>${curso.descricao}</p>
        </div>
        <div class="curso-descricao">
            <h3>Conteúdo Programático</h3>
            <p>${curso.conteudo}</p>
        </div>
        <a href="index.html" class="btn-voltar">Voltar para a página principal</a>
    `;
}

// Inicializar a página quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', renderizarDetalhesCurso);

