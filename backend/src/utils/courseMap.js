/**
 * Mapeamento: ID do curso no sistema (EXT-XXX) → ID do curso no Moodle.
 * Fonte da verdade para matrícula automática no webhook.
 * Adicione os demais cursos quando tiver os IDs do Moodle.
 */
const COURSE_MAP = {
  "EXT-001": 1934, // Empreendedorismo
  // "EXT-002": ???,  // Gestão de Recursos Humanos
  // "EXT-003": ???,  // Analista de Vendas
  // "EXT-004": ???,  // Arbitragem e Mediação de Conflitos
  // "EXT-006": ???,  // Administração de Medicamentos
  // "EXT-007": ???,  // Marketing de Relacionamento
  // "EXT-008": ???,  // Inteligência Artificial
  // "EXT-009": ???,  // Gestão de Carreira
  // "EXT-010": ???,  // Gestão de Redes Sociais
  // "EXT-011": ???,  // Fluxo de Caixa
  // "EXT-012": ???,  // Administração de Servidores
  // "EXT-013": ???,  // Administração Financeira e Orçamentária
  // "EXT-014": ???,  // Administração Mercadológica
  // "EXT-015": ???,  // Distúrbios de Aprendizagem
  // "EXT-016": ???,  // Neuroeducação e Tecnologias Educacionais
  // "EXT-017": ???,  // Práticas do Secretariado Escolar
  // "EXT-018": ???,  // Perícia, Avaliação e Arbitragem
};

/**
 * Retorna o ID do curso no Moodle para o courseId interno.
 * @param {string} courseId - Ex: "EXT-001"
 * @returns {number|undefined} - ID do curso no Moodle ou undefined
 */
export function getMoodleCourseId(courseId) {
  if (!courseId || typeof courseId !== "string") return undefined;
  return COURSE_MAP[String(courseId).trim()];
}

export { COURSE_MAP };
