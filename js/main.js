// Função para renderizar os cursos na página inicial
function renderizarCursos() {
    const cursosGrid = document.getElementById('cursos-grid');
    
    if (!cursosGrid) {
        console.error('Elemento cursos-grid não encontrado');
        return;
    }
    
    if (!cursos || cursos.length === 0) {
        cursosGrid.innerHTML = '<p>Nenhum curso disponível no momento.</p>';
        return;
    }
    
    cursosGrid.innerHTML = cursos.map(curso => `
        <div class="curso-card">
            <img src="${curso.imagem}" alt="${curso.titulo}">
            <div class="curso-card-content">
                <h2>${curso.titulo}</h2>
                <p>${curso.descricao}</p>
                <div class="curso-info">
                    <strong>Duração:</strong> ${curso.duracao} | 
                    <strong>Nível:</strong> ${curso.nivel}
                </div>
                <a href="curso.html?id=${curso.id}">Ver Detalhes</a>
            </div>
        </div>
    `).join('');
}

// Inicializar a página quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', renderizarCursos);

