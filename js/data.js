// Estrutura de dados dos cursos de extensão
// Definir diretamente em window.cursos para garantir disponibilidade imediata
window.cursos = window.cursos || [
    {
        id: "EXT-001",
        titulo: "Empreendedorismo",
        descricao_curta: "Desenvolva habilidades essenciais para criar e gerenciar seu próprio negócio, desde a concepção da ideia até a gestão estratégica.",
        duracao: "8 semanas",
        carga_horaria: 40,
        modalidade: "EAD",
        area: "Empreendedorismo",
        ementa: [
            "Fundamentos do empreendedorismo",
            "Identificação de oportunidades de negócio",
            "Plano de negócios e modelagem",
            "Gestão financeira para empreendedores",
            "Marketing e vendas para pequenos negócios",
            "Gestão de pessoas e liderança",
            "Inovação e diferenciação competitiva"
        ],
        publico_alvo: "Aspiring entrepreneurs, profissionais que desejam abrir seu próprio negócio, estudantes e pessoas interessadas em desenvolver habilidades empreendedoras.",
        link_matricula: "https://ead.femaf.com.br"
    },
    {
        id: "EXT-002",
        titulo: "Gestão de Recursos Humanos",
        descricao_curta: "Aprenda as principais práticas e estratégias de gestão de pessoas, recrutamento, seleção, desenvolvimento e retenção de talentos.",
        duracao: "7 semanas",
        carga_horaria: 35,
        modalidade: "EAD",
        area: "Gestão",
        ementa: [
            "Fundamentos de gestão de pessoas",
            "Recrutamento e seleção de talentos",
            "Treinamento e desenvolvimento",
            "Avaliação de desempenho",
            "Gestão de carreiras",
            "Clima organizacional e engajamento",
            "Legislação trabalhista aplicada"
        ],
        publico_alvo: "Profissionais de RH, gestores, coordenadores e pessoas interessadas em atuar na área de recursos humanos.",
        link_matricula: "https://ead.femaf.com.br"
    },
    {
        id: "EXT-003",
        titulo: "Analista de Vendas",
        descricao_curta: "Domine técnicas avançadas de vendas, negociação, prospecção de clientes e gestão de relacionamento com foco em resultados.",
        duracao: "6 semanas",
        carga_horaria: 30,
        modalidade: "EAD",
        area: "Vendas",
        ementa: [
            "Fundamentos de vendas e técnicas de abordagem",
            "Prospecção e qualificação de leads",
            "Processo de vendas e fechamento",
            "Negociação e objeções",
            "Gestão de carteira de clientes",
            "CRM e ferramentas de vendas",
            "Métricas e KPIs de vendas"
        ],
        publico_alvo: "Vendedores, representantes comerciais, gestores de vendas e profissionais que desejam aprimorar suas habilidades comerciais.",
        link_matricula: "https://ead.femaf.com.br"
    },
    {
        id: "EXT-004",
        titulo: "Arbitragem e Mediação de Conflitos",
        descricao_curta: "Desenvolva competências para atuar como mediador e árbitro, resolvendo conflitos de forma pacífica e eficiente.",
        duracao: "8 semanas",
        carga_horaria: 40,
        modalidade: "EAD",
        area: "Direito",
        ementa: [
            "Fundamentos da mediação e arbitragem",
            "Técnicas de comunicação e escuta ativa",
            "Processo de mediação de conflitos",
            "Arbitragem e procedimentos arbitrais",
            "Legislação aplicada à mediação e arbitragem",
            "Casos práticos e simulações",
            "Ética profissional do mediador e árbitro"
        ],
        publico_alvo: "Advogados, profissionais do direito, gestores, psicólogos e pessoas interessadas em resolução alternativa de conflitos.",
        link_matricula: "https://ead.femaf.com.br"
    },
    {
        id: "EXT-005",
        titulo: "Administração Hospitalar",
        descricao_curta: "Aprenda a gerenciar instituições de saúde com eficiência, qualidade e foco na excelência do atendimento ao paciente.",
        duracao: "8 semanas",
        carga_horaria: 40,
        modalidade: "EAD",
        area: "Gestão",
        ementa: [
            "Fundamentos da administração hospitalar",
            "Gestão de recursos em saúde",
            "Qualidade e acreditação hospitalar",
            "Gestão de pessoas na área da saúde",
            "Controle de custos e orçamento hospitalar",
            "Legislação sanitária e regulamentações",
            "Tecnologia da informação em saúde"
        ],
        publico_alvo: "Administradores, gestores hospitalares, enfermeiros, médicos e profissionais da área da saúde que atuam ou desejam atuar na gestão hospitalar.",
        link_matricula: "https://ead.femaf.com.br"
    },
    {
        id: "EXT-006",
        titulo: "Administração de Medicamentos",
        descricao_curta: "Conheça os procedimentos seguros e as melhores práticas para administração de medicamentos em diferentes contextos de cuidado.",
        duracao: "6 semanas",
        carga_horaria: 30,
        modalidade: "EAD",
        area: "Saúde",
        ementa: [
            "Fundamentos da farmacologia",
            "Vias de administração de medicamentos",
            "Cálculo de dosagens e diluições",
            "Preparo e administração segura",
            "Interações medicamentosas",
            "Registro e documentação",
            "Erros de medicação e prevenção"
        ],
        publico_alvo: "Enfermeiros, técnicos de enfermagem, profissionais da área da saúde e cuidadores que administram medicamentos.",
        link_matricula: "https://ead.femaf.com.br"
    },
    {
        id: "EXT-007",
        titulo: "Marketing de Relacionamento",
        descricao_curta: "Desenvolva estratégias para construir relacionamentos duradouros com clientes, aumentando fidelidade e valor ao longo do tempo.",
        duracao: "6 semanas",
        carga_horaria: 30,
        modalidade: "EAD",
        area: "Marketing",
        ementa: [
            "Fundamentos do marketing de relacionamento",
            "Gestão de relacionamento com cliente (CRM)",
            "Programas de fidelidade",
            "Comunicação personalizada e multicanal",
            "Métricas de relacionamento e NPS",
            "Retenção e recuperação de clientes",
            "Experiência do cliente (CX)"
        ],
        publico_alvo: "Profissionais de marketing, gestores comerciais, empreendedores e pessoas interessadas em construir relacionamentos duradouros com clientes.",
        link_matricula: "https://ead.femaf.com.br"
    },
    {
        id: "EXT-008",
        titulo: "Inteligência Artificial",
        descricao_curta: "Explore os fundamentos da inteligência artificial, machine learning e suas aplicações práticas em diferentes setores.",
        duracao: "8 semanas",
        carga_horaria: 40,
        modalidade: "EAD",
        area: "Tecnologia",
        ementa: [
            "Fundamentos de inteligência artificial",
            "Machine Learning e Deep Learning",
            "Processamento de linguagem natural",
            "Visão computacional",
            "Aplicações práticas de IA",
            "Ética e responsabilidade em IA",
            "Ferramentas e frameworks de IA"
        ],
        publico_alvo: "Profissionais de tecnologia, desenvolvedores, analistas de dados, gestores e pessoas interessadas em entender e aplicar inteligência artificial.",
        link_matricula: "https://ead.femaf.com.br"
    },
    {
        id: "EXT-009",
        titulo: "Gestão de Carreira",
        descricao_curta: "Desenvolva estratégias para planejar, gerenciar e potencializar sua trajetória profissional de forma estratégica e consciente.",
        duracao: "5 semanas",
        carga_horaria: 25,
        modalidade: "EAD",
        area: "Gestão",
        ementa: [
            "Planejamento de carreira e autoconhecimento",
            "Desenvolvimento de competências profissionais",
            "Networking e relacionamento profissional",
            "Marca pessoal e presença digital",
            "Transições de carreira",
            "Negociação salarial e benefícios",
            "Equilíbrio vida pessoal e profissional"
        ],
        publico_alvo: "Profissionais em qualquer estágio da carreira, estudantes, pessoas em transição de carreira e quem deseja potencializar seu desenvolvimento profissional.",
        link_matricula: "https://ead.femaf.com.br"
    },
    {
        id: "EXT-010",
        titulo: "Gestão de Redes Sociais",
        descricao_curta: "Aprenda a criar, gerenciar e otimizar presença nas principais redes sociais, gerando engajamento e resultados para marcas e negócios.",
        duracao: "6 semanas",
        carga_horaria: 30,
        modalidade: "EAD",
        area: "Marketing",
        ementa: [
            "Fundamentos de marketing em redes sociais",
            "Estratégias para Facebook, Instagram, LinkedIn e TikTok",
            "Criação de conteúdo e calendário editorial",
            "Community management e engajamento",
            "Anúncios pagos em redes sociais",
            "Métricas e analytics de redes sociais",
            "Crises e gestão de reputação online"
        ],
        publico_alvo: "Social media managers, profissionais de marketing digital, empreendedores, comunicadores e pessoas interessadas em gestão de redes sociais.",
        link_matricula: "https://ead.femaf.com.br"
    },
    {
        id: "EXT-011",
        titulo: "Fluxo de Caixa",
        descricao_curta: "Domine técnicas de gestão financeira para controlar entradas e saídas, garantindo saúde financeira e sustentabilidade do negócio.",
        duracao: "5 semanas",
        carga_horaria: 25,
        modalidade: "EAD",
        area: "Finanças",
        ementa: [
            "Fundamentos de fluxo de caixa",
            "Projeção e planejamento financeiro",
            "Controle de receitas e despesas",
            "Gestão de capital de giro",
            "Análise de indicadores financeiros",
            "Ferramentas e planilhas de controle",
            "Tomada de decisão baseada em dados financeiros"
        ],
        publico_alvo: "Empreendedores, gestores financeiros, contadores, administradores e profissionais que precisam gerenciar o fluxo de caixa de negócios.",
        link_matricula: "https://ead.femaf.com.br"
    },
    {
        id: "EXT-012",
        titulo: "Administração de Servidores",
        descricao_curta: "Aprenda a configurar, gerenciar e manter servidores Linux e Windows, garantindo segurança, performance e disponibilidade.",
        duracao: "8 semanas",
        carga_horaria: 40,
        modalidade: "EAD",
        area: "Tecnologia",
        ementa: [
            "Fundamentos de administração de servidores",
            "Sistemas operacionais Linux e Windows Server",
            "Configuração de serviços de rede",
            "Segurança de servidores e hardening",
            "Monitoramento e manutenção",
            "Virtualização e containers",
            "Backup e recuperação de desastres"
        ],
        publico_alvo: "Administradores de sistemas, profissionais de TI, desenvolvedores e pessoas interessadas em infraestrutura e administração de servidores.",
        link_matricula: "https://ead.femaf.com.br"
    },
    {
        id: "EXT-013",
        titulo: "Administração Financeira e Orçamentária",
        descricao_curta: "Desenvolva competências para planejar, controlar e gerenciar orçamentos e recursos financeiros de forma estratégica.",
        duracao: "7 semanas",
        carga_horaria: 35,
        modalidade: "EAD",
        area: "Finanças",
        ementa: [
            "Fundamentos de administração financeira",
            "Planejamento orçamentário",
            "Controle e acompanhamento orçamentário",
            "Análise de viabilidade financeira",
            "Gestão de custos e despesas",
            "Indicadores financeiros e KPIs",
            "Relatórios gerenciais e tomada de decisão"
        ],
        publico_alvo: "Gestores financeiros, administradores, contadores, analistas financeiros e profissionais que atuam na gestão orçamentária.",
        link_matricula: "https://ead.femaf.com.br"
    },
    {
        id: "EXT-014",
        titulo: "Administração Mercadológica",
        descricao_curta: "Compreenda os princípios e práticas de administração de marketing, desde o planejamento até a execução de estratégias mercadológicas.",
        duracao: "7 semanas",
        carga_horaria: 35,
        modalidade: "EAD",
        area: "Marketing",
        ementa: [
            "Fundamentos de administração mercadológica",
            "Pesquisa de mercado e análise de consumidores",
            "Planejamento estratégico de marketing",
            "Mix de marketing (4Ps)",
            "Gestão de produtos e marcas",
            "Canais de distribuição",
            "Avaliação de desempenho mercadológico"
        ],
        publico_alvo: "Profissionais de marketing, gestores comerciais, administradores, empreendedores e pessoas interessadas em gestão mercadológica.",
        link_matricula: "https://ead.femaf.com.br"
    },
    {
        id: "EXT-015",
        titulo: "Distúrbios de Aprendizagem",
        descricao_curta: "Conheça os principais distúrbios de aprendizagem, suas características, diagnóstico e estratégias de intervenção educacional.",
        duracao: "8 semanas",
        carga_horaria: 40,
        modalidade: "EAD",
        area: "Educação",
        ementa: [
            "Fundamentos dos distúrbios de aprendizagem",
            "Dislexia, disgrafia e discalculia",
            "TDAH e dificuldades de atenção",
            "Avaliação e diagnóstico",
            "Estratégias de intervenção pedagógica",
            "Tecnologias assistivas",
            "Trabalho multidisciplinar e família"
        ],
        publico_alvo: "Professores, pedagogos, psicopedagogos, psicólogos escolares, fonoaudiólogos e profissionais da educação que trabalham com dificuldades de aprendizagem.",
        link_matricula: "https://ead.femaf.com.br"
    },
    {
        id: "EXT-016",
        titulo: "Neuroeducação e Tecnologias Educacionais",
        descricao_curta: "Integre conhecimentos de neurociência e tecnologia para criar experiências de aprendizagem mais eficazes e inovadoras.",
        duracao: "8 semanas",
        carga_horaria: 40,
        modalidade: "EAD",
        area: "Educação",
        ementa: [
            "Fundamentos de neuroeducação",
            "Como o cérebro aprende",
            "Tecnologias educacionais e ferramentas digitais",
            "Design instrucional baseado em neurociência",
            "Gamificação e aprendizagem",
            "Ambientes virtuais de aprendizagem",
            "Avaliação e feedback em ambientes digitais"
        ],
        publico_alvo: "Professores, pedagogos, designers instrucionais, coordenadores pedagógicos e profissionais da educação interessados em inovação educacional.",
        link_matricula: "https://ead.femaf.com.br"
    },
    {
        id: "EXT-017",
        titulo: "Práticas do Secretariado Escolar",
        descricao_curta: "Desenvolva competências para atuar no secretariado escolar, gerenciando processos administrativos e pedagógicos de instituições de ensino.",
        duracao: "6 semanas",
        carga_horaria: 30,
        modalidade: "EAD",
        area: "Educação",
        ementa: [
            "Fundamentos do secretariado escolar",
            "Gestão documental e arquivo",
            "Processos de matrícula e transferência",
            "Registro e histórico escolar",
            "Comunicação com pais e responsáveis",
            "Sistemas de gestão escolar",
            "Legislação educacional aplicada"
        ],
        publico_alvo: "Secretários escolares, assistentes administrativos, coordenadores e profissionais que atuam ou desejam atuar na área administrativa de instituições de ensino.",
        link_matricula: "https://ead.femaf.com.br"
    }
];

// Exportar os dados para uso em outros arquivos JavaScript
if (typeof module !== 'undefined' && module.exports) {
    // Ambiente Node.js
    module.exports = window.cursos;
}
