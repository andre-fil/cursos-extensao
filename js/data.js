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
            "Planejamento de Vendas",
            "Estratégias de Vendas",
            "Tendências em Vendas",
            "Estratégias de Marketing e as Atividades de Vendas",
            "Controle e Avaliação da Força de Vendas"
        ],
        publico_alvo: "Vendedores, representantes comerciais, gestores de vendas e profissionais que desejam aprimorar suas habilidades comerciais.",
        link_matricula: "https://ead.femaf.com.br/course/view.php?id=1927"
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
            "As dificuldades escolares e os distúrbios de aprendizagem",
            "Dificuldades de aprendizagem e o ensino",
            "O trabalho pedagógico diante dos distúrbios de aprendizagem",
            "Transtornos e distúrbios de aprendizagem em crianças na educação infantil",
            "Alunos com necessidades educacionais especiais: distúrbios de aprendizagem associados à linguagem e à comunicação"
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
            "Novas exigências educacionais e profissão docente",
            "A aprendizagem dos conteúdos escolares",
            "As dificuldades escolares e os distúrbios de aprendizagem",
            "Apontamentos para um sistema melhor: inclusão de novas tecnologias e processos educacionais"
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
            "Perfil profissional e atribuições do secretário escolar",
            "A secretaria escolar e a gestão de documentos escolares",
            "Principais documentos escolares que devem ser registrados e arquivados",
            "A legislação sobre o arquivamento e o descarte de documentos escolares",
            "Registro e identidade escolar de cada aluno"
        ],
        publico_alvo: "Secretários escolares, assistentes administrativos, coordenadores e profissionais que atuam ou desejam atuar na área administrativa de instituições de ensino.",
        link_matricula: "https://ead.femaf.com.br/course/view.php?id=1928"
    },
    {
        id: "EXT-018",
        titulo: "Perícia, Avaliação e Arbitragem",
        descricao_curta: "Desenvolva competências para atuar como perito contábil, avaliador de bens e serviços, e árbitro em processos de resolução de conflitos.",
        duracao: "8 semanas",
        carga_horaria: 40,
        modalidade: "EAD",
        area: "Contabilidade",
        ementa: [
            "Conceitos de perícia contábil",
            "Perfil profissional do perito: ética e responsabilidades",
            "Tópicos contemporâneos de perícia contábil",
            "Normas brasileiras sobre perícias contábeis",
            "A perícia contábil em apuração de haveres",
            "Avaliação de bens, serviços e empresas",
            "Ciclo de perícia contábil",
            "Arbitragem",
            "Honorários periciais",
            "Câmaras",
            "Mediação e arbitragem: procedimentos",
            "Mediação"
        ],
        publico_alvo: "Contadores, peritos contábeis, avaliadores, árbitros, profissionais do direito e pessoas interessadas em perícia contábil e resolução alternativa de conflitos.",
        link_matricula: "https://ead.femaf.com.br"
    }
];

// Exportar os dados para uso em outros arquivos JavaScript
if (typeof module !== 'undefined' && module.exports) {
    // Ambiente Node.js
    module.exports = window.cursos;
}
