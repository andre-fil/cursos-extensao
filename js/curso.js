function obterParametroURL(nome) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nome);
}

function buscarCursoPorId(id) {
    if (!window.cursos) {
        return undefined;
    }
    const idNormalizado = id.trim();
    return window.cursos.find(curso => curso.id === idNormalizado);
}

function criarMensagemErro(titulo, mensagem) {
    return `
        <div style="text-align: center; padding: 3rem 2rem;">
            <h2 style="color: #2c3e50; margin-bottom: 1rem; font-size: 1.5rem;">${titulo}</h2>
            <p style="color: #5a6c7d; margin-bottom: 2rem; font-size: 1rem; line-height: 1.6;">${mensagem}</p>
            <a href="index.html" class="btn-voltar">Voltar para a página principal</a>
        </div>
    `;
}

function renderizarEmenta(ementa) {
    if (!ementa || ementa.length === 0) {
        return '<p style="color: #5a6c7d;">Ementa não disponível.</p>';
    }
    return `
        <ul class="ementa-lista">
            ${ementa.map(topico => `<li>${topico}</li>`).join('')}
        </ul>
    `;
}

function renderizarDetalhesCurso() {
    const cursoDetalhes = document.getElementById('curso-detalhes');
    
    if (!cursoDetalhes) {
        return;
    }
    
    if (!window.cursos || window.cursos.length === 0) {
        cursoDetalhes.innerHTML = criarMensagemErro(
            'Erro ao carregar dados',
            'Não foi possível carregar os dados dos cursos. Por favor, tente novamente mais tarde.'
        );
        return;
    }
    
    const cursoId = obterParametroURL('id');
    
    if (!cursoId) {
        cursoDetalhes.innerHTML = criarMensagemErro(
            'Curso não especificado',
            'Nenhum curso foi especificado. Por favor, selecione um curso na página principal.'
        );
        return;
    }
    
    const curso = buscarCursoPorId(cursoId);
    
    if (!curso) {
        cursoDetalhes.innerHTML = criarMensagemErro(
            'Curso não encontrado',
            `O curso com o ID "${cursoId}" não foi encontrado. Verifique se o link está correto ou retorne à página principal para selecionar outro curso.`
        );
        return;
    }
    
    document.title = `${curso.titulo} - Cursos de Extensão`;
    
    cursoDetalhes.innerHTML = `
        <h2>${curso.titulo}</h2>
        <div class="curso-info">
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
            ${renderizarEmenta(curso.ementa)}
        </div>
        <div class="curso-descricao">
            <h3>Público-Alvo</h3>
            <p>${curso.publico_alvo}</p>
        </div>
        <div class="curso-botoes">
            <a href="${curso.link_matricula}" target="_blank" rel="noopener noreferrer" class="btn-matricula">Matricular-se</a>
            <a href="index.html" class="btn-voltar">Voltar para a página principal</a>
        </div>
    `;
}

function inicializar() {
    function tentarRenderizar() {
        if (window.cursos && window.cursos.length > 0) {
            renderizarDetalhesCurso();
        } else {
            setTimeout(tentarRenderizar, 50);
        }
    }
    setTimeout(tentarRenderizar, 100);
}

document.addEventListener('DOMContentLoaded', inicializar);
