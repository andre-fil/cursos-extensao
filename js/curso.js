/**
 * URL do backend (AWS App Runner) - cria preferência Mercado Pago
 */
const API_BASE_URL = "https://qmqump3csh.us-east-1.awsapprunner.com";

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
 * Cria o HTML da imagem do curso para a página de detalhes
 * @param {Object} curso - Objeto contendo os dados do curso
 * @returns {string} HTML da imagem ou espaço reservado
 */
function criarImagemDetalhes(curso) {
    const nomeImagem = gerarNomeImagem(curso.titulo);
    
    if (!nomeImagem) {
        // Retornar um div vazio para manter o espaço
        return '<div class="curso-imagem-placeholder"></div>';
    }
    
    // Usar onerror inline para substituir por placeholder se a imagem não existir
    return `
        <div class="curso-imagem-container">
            <img src="img/${nomeImagem}-DESKTOP.png" alt="${curso.titulo}" class="curso-imagem curso-imagem-desktop" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling && this.nextElementSibling.style.display==='none') { this.parentElement.innerHTML='<div class=\\'curso-imagem-placeholder\\'></div>'; }">
            <img src="img/${nomeImagem}-MOBILE.png" alt="${curso.titulo}" class="curso-imagem curso-imagem-mobile" loading="lazy" onerror="this.style.display='none'; if(this.previousElementSibling && this.previousElementSibling.style.display==='none') { this.parentElement.innerHTML='<div class=\\'curso-imagem-placeholder\\'></div>'; }">
        </div>
    `;
}

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

function renderizarObjetivos(objetivos) {
    if (!objetivos) {
        return '';
    }
    
    let html = '<div class="curso-objetivos">';
    
    if (objetivos.geral) {
        html += `
            <h4>Objetivo Geral</h4>
            <p>${objetivos.geral}</p>
        `;
    }
    
    if (objetivos.especificos && objetivos.especificos.length > 0) {
        html += `
            <h4>Objetivos Específicos</h4>
            <ul class="objetivos-lista">
                ${objetivos.especificos.map(obj => `<li>${obj}</li>`).join('')}
            </ul>
        `;
    }
    
    if (objetivos.habilidades && objetivos.habilidades.length > 0) {
        html += `
            <h4>Habilidades a Aprender</h4>
            <ul class="habilidades-lista">
                ${objetivos.habilidades.map(hab => `<li>${hab}</li>`).join('')}
            </ul>
        `;
    }
    
    html += '</div>';
    return html;
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
    
    if (curso.disponivel === false) {
        cursoDetalhes.innerHTML = criarMensagemErro(
            'Curso Indisponível Temporariamente',
            `O curso "${curso.titulo}" está temporariamente indisponível. Por favor, retorne à página principal para ver outros cursos disponíveis.`
        );
        return;
    }
    
    document.title = `${curso.titulo} - Cursos de Extensão`;
    
    const areaTag = curso.area ? `<span class="curso-area-tag">${curso.area}</span>` : '';
    
    cursoDetalhes.innerHTML = `
        <div class="curso-header-topo">
            <div class="curso-header-info">
                <h2>${curso.titulo}</h2>
                ${areaTag}
                <div class="curso-info">
                    <p><strong>Duração:</strong> ${curso.duracao}</p>
                    <p><strong>Carga Horária:</strong> ${curso.carga_horaria} horas</p>
                    <p><strong>Modalidade:</strong> ${curso.modalidade}</p>
                </div>
            </div>
            <div class="curso-botoes-topo">
                <a href="${curso.link_matricula}" target="_blank" rel="noopener noreferrer" class="btn-matricula">Matricular-se</a>
                <button type="button" id="btnPagar" class="btn-comprar-teste" data-course-id="${curso.id}">Pagar agora</button>
                <a href="index.html" class="btn-voltar">Voltar</a>
                <p id="mensagemErro" style="color: red; margin-top: 0.5rem;"></p>
            </div>
        </div>
        <div class="curso-descricao">
            <h3>Descrição</h3>
            <p>${curso.descricao_curta}</p>
        </div>
        ${curso.objetivos ? `
        <div class="curso-descricao">
            <h3>Objetivos</h3>
            ${renderizarObjetivos(curso.objetivos)}
        </div>
        ` : ''}
        <div class="curso-descricao">
            <h3>Ementa</h3>
            ${renderizarEmenta(curso.ementa)}
        </div>
        <div class="curso-descricao">
            <h3>Público-Alvo</h3>
            <p>${curso.publico_alvo}</p>
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

/**
 * Envia POST /checkout/create ao backend, recebe init_point e redireciona para o Mercado Pago.
 * Erros: rede, HTTP não 200, resposta sem init_point → mensagem em #mensagemErro.
 */
async function iniciarCheckout(e) {
    var btn = e.target.closest("#btnPagar");
    if (!btn) return;
    var courseId = btn.getAttribute("data-course-id");
    if (!courseId) return;

    var mensagemErro = document.getElementById("mensagemErro");
    if (mensagemErro) mensagemErro.textContent = "";

    btn.disabled = true;
    btn.textContent = "Aguarde...";

    try {
        var res = await fetch(API_BASE_URL + "/checkout/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseId: courseId }),
        });

        var text = await res.text();
        var data;
        try {
            data = JSON.parse(text);
        } catch {
            throw new Error("Resposta inválida do servidor.");
        }

        if (!res.ok) {
            throw new Error(data.message || "Erro ao criar checkout.");
        }
        if (data.init_point) {
            window.location.href = data.init_point;
            return;
        }
        throw new Error("Resposta inválida do servidor.");
    } catch (err) {
        if (mensagemErro) mensagemErro.textContent = err.message || "Erro de rede. Tente novamente.";
        btn.disabled = false;
        btn.textContent = "Pagar agora";
    }
}

function delegarEventos() {
    document.addEventListener("click", function (e) {
        if (e.target.closest("#btnPagar") && !e.target.closest("#btnPagar").disabled) {
            e.preventDefault();
            iniciarCheckout(e);
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    inicializar();
    delegarEventos();
});
