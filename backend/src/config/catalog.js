/**
 * Catálogo interno de cursos - FEMAF
 *
 * IMPORTANTE: Os preços são definidos exclusivamente no backend.
 * Nunca confie em valores de preço enviados pelo frontend.
 *
 * Estrutura: { id, title, price }
 * - id: identificador único do curso (deve corresponder ao frontend)
 * - title: nome do curso exibido no checkout
 * - price: valor em BRL (número)
 */

export const courseCatalog = [
  { id: "EXT-001", title: "Empreendedorismo", price: 97.0 },
  { id: "EXT-002", title: "Gestão de Recursos Humanos", price: 97.0 },
  { id: "EXT-003", title: "Analista de Vendas", price: 97.0 },
  { id: "EXT-004", title: "Arbitragem e Mediação de Conflitos", price: 97.0 },
  { id: "EXT-006", title: "Administração de Medicamentos", price: 127.0 },
  { id: "EXT-007", title: "Marketing de Relacionamento", price: 127.0 },
  { id: "EXT-008", title: "Inteligência Artificial", price: 127.0 },
  { id: "EXT-009", title: "Gestão de Carreira", price: 127.0 },
  { id: "EXT-010", title: "Gestão de Redes Sociais", price: 97.0 },
  { id: "EXT-011", title: "Fluxo de Caixa", price: 97.0 },
  { id: "EXT-012", title: "Administração de Servidores", price: 97.0 },
  { id: "EXT-013", title: "Administração Financeira e Orçamentária", price: 97.0 },
  { id: "EXT-014", title: "Administração Mercadológica", price: 97.0 },
  { id: "EXT-015", title: "Distúrbios de Aprendizagem", price: 97.0 },
  { id: "EXT-016", title: "Neuroeducação e Tecnologias Educacionais", price: 79.0 },
  { id: "EXT-017", title: "Práticas do Secretariado Escolar", price: 97.0 },
  { id: "EXT-018", title: "Perícia, Avaliação e Arbitragem", price: 197.0 },
];

/**
 * Busca um curso pelo ID no catálogo interno
 * @param {string} courseId - ID do curso
 * @returns {Object|undefined} Curso encontrado ou undefined
 */
export function getCourseById(courseId) {
  if (!courseId || typeof courseId !== "string") {
    return undefined;
  }
  const normalizedId = String(courseId).trim();
  return courseCatalog.find((course) => course.id === normalizedId);
}
