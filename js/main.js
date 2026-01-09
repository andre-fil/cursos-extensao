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
 * Renderiza todos os cursos na grade
 * Busca os dados do arquivo data.js (variável global cursos)
 */
function renderizarCursos() {
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
    
    // Limpar o container antes de adicionar os cards
    cursosGrid.innerHTML = '';
    
    // Criar e adicionar um card para cada curso
    window.cursos.forEach(curso => {
        const card = criarCardCurso(curso);
        cursosGrid.appendChild(card);
        // Debug: verificar se o botão foi criado
        const botao = card.querySelector('.btn-acessar');
        if (!botao) {
            console.error('Botão não encontrado no card:', curso.titulo);
        } else {
            console.log('Botão criado com sucesso para:', curso.titulo);
        }
    });
}

/**
 * Inicializa a página quando o DOM estiver completamente carregado
 * Garante que os scripts data.js e main.js sejam executados na ordem correta
 */
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pequeno delay para garantir que data.js foi carregado
    // Isso é necessário porque os scripts são carregados de forma assíncrona
    setTimeout(() => {
        renderizarCursos();
    }, 100);
});
