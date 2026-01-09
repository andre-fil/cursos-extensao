// Estrutura de dados dos cursos de extensão
const cursos = [
    {
        id: "EXT-001",
        titulo: "Introdução à Programação Web",
        descricao_curta: "Aprenda os fundamentos de HTML, CSS e JavaScript para criar páginas web modernas e responsivas.",
        duracao: "8 semanas",
        carga_horaria: 400,
        modalidade: "EAD",
        ementa: [
            "Fundamentos de HTML5 e estrutura semântica",
            "Estilização com CSS3 e layouts responsivos",
            "JavaScript básico: variáveis, funções e eventos",
            "Manipulação do DOM",
            "Projeto prático: criação de página web completa"
        ],
        publico_alvo: "Interessados em iniciar na área de desenvolvimento web, estudantes e profissionais que desejam aprender programação.",
        link_matricula: "https://www.exemplo.com/matricula/ext-001"
    },
    {
        id: "EXT-002",
        titulo: "Gestão de Projetos com Metodologias Ágeis",
        descricao_curta: "Desenvolva habilidades essenciais para gerenciar projetos utilizando metodologias ágeis como Scrum e Kanban.",
        duracao: "6 semanas",
        carga_horaria: 30,
        modalidade: "EAD",
        ementa: [
            "Conceitos fundamentais de gestão de projetos",
            "Metodologias ágeis: Scrum, Kanban e Lean",
            "Ferramentas de planejamento e acompanhamento",
            "Gestão de equipes e comunicação eficaz",
            "Caso prático: aplicação em projeto real"
        ],
        publico_alvo: "Gestores, coordenadores, líderes de equipe e profissionais que trabalham com projetos em qualquer área.",
        link_matricula: "https://www.exemplo.com/matricula/ext-002"
    },
    {
        id: "EXT-003",
        titulo: "Marketing Digital e Redes Sociais",
        descricao_curta: "Domine as principais estratégias e ferramentas de marketing digital para promover negócios nas redes sociais.",
        duracao: "7 semanas",
        carga_horaria: 35,
        modalidade: "EAD",
        ementa: [
            "Fundamentos do marketing digital",
            "SEO e otimização para mecanismos de busca",
            "Estratégias para Facebook, Instagram e LinkedIn",
            "Google Ads e publicidade online",
            "Analytics e métricas de performance",
            "Plano de marketing digital"
        ],
        publico_alvo: "Empreendedores, profissionais de marketing, comunicadores e gestores que desejam potencializar a presença digital.",
        link_matricula: "https://www.exemplo.com/matricula/ext-003"
    },
    {
        id: "EXT-004",
        titulo: "Excel Avançado para Análise de Dados",
        descricao_curta: "Aprenda funções avançadas, tabelas dinâmicas, macros VBA e técnicas de análise de dados no Excel.",
        duracao: "5 semanas",
        carga_horaria: 25,
        modalidade: "EAD",
        ementa: [
            "Funções avançadas do Excel: PROC.V, ÍNDICE, CORRESP",
            "Tabelas e gráficos dinâmicos",
            "Power Query e análise de dados externos",
            "Introdução a macros e VBA",
            "Dashboard interativo e relatórios automatizados"
        ],
        publico_alvo: "Profissionais que já possuem conhecimento básico de Excel e desejam aprofundar habilidades para análise de dados e automação.",
        link_matricula: "https://www.exemplo.com/matricula/ext-004"
    }
];

// Exportar os dados para uso em outros arquivos JavaScript
if (typeof module !== 'undefined' && module.exports) {
    // Ambiente Node.js
    module.exports = cursos;
} else {
    // Ambiente browser - variável global
    window.cursos = cursos;
}
