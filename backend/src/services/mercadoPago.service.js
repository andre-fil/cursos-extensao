import { MercadoPagoConfig, Preference } from "mercadopago";

const COURSE_CATALOG = [
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

export function getCourseById(courseId) {
  if (!courseId || typeof courseId !== "string") return undefined;
  const id = String(courseId).trim();
  return COURSE_CATALOG.find((c) => c.id === id);
}

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const preferenceClient = new Preference(client);

export async function createPreference(courseId) {
  const course = getCourseById(courseId);
  if (!course) throw new Error("Curso não encontrado");

  const baseUrl = process.env.BASE_URL || "";
  const body = {
    items: [
      {
        id: course.id,
        title: course.title,
        unit_price: course.price,
        quantity: 1,
        currency_id: "BRL",
      },
    ],
    back_urls: {
      success: `${baseUrl}/sucesso`,
      failure: `${baseUrl}/erro`,
      pending: `${baseUrl}/pendente`,
    },
    auto_return: "approved",
    external_reference: course.id,
  };

  const preference = await preferenceClient.create({ body });
  if (!preference.init_point) throw new Error("Resposta MP sem init_point");
  return preference.init_point;
}
