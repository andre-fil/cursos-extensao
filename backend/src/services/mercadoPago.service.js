import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

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

/**
 * Formato external_reference (fonte da verdade no webhook):
 * - existing: COURSE_ID|existing|REGISTRATION
 * - new:      COURSE_ID|new|EMAIL
 */
export async function createPreference(courseId, options = {}) {
  const course = getCourseById(courseId);
  if (!course) throw new Error("Curso não encontrado");

  const baseUrl = (process.env.BASE_URL || "").replace(/\/$/, "");
  if (!baseUrl) throw new Error("BASE_URL não configurado no servidor");

  const { type, registration, user } = options;

  let externalReference;
  let payer = undefined;

  if (type === "existing" && registration) {
    externalReference = `${course.id}|existing|${String(registration).trim()}`;
  } else if (type === "new" && user && user.email) {
    externalReference = `${course.id}|new|${String(user.email).trim()}`;
    payer = {
      email: String(user.email).trim(),
      first_name: String(user.firstname || "").trim() || "Nome",
      last_name: String(user.lastname || "").trim() || "Sobrenome",
      identification: user.cpf
        ? { type: "CPF", number: String(user.cpf).replace(/\D/g, "").slice(0, 11) }
        : undefined,
    };
  } else {
    throw new Error("Tipo de perfil inválido: use type 'existing' com registration ou type 'new' com user");
  }

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
    external_reference: externalReference,
    ...(payer && { payer }),
  };

  const preference = await preferenceClient.create({ body });
  if (!preference.init_point) throw new Error("Resposta MP sem init_point");
  return {
    init_point: preference.init_point,
    preferenceId: preference.id ?? preference.body?.id,
    external_reference: externalReference,
  };
}

const paymentClient = new Payment(client);

/** Busca pagamento por ID (usado no webhook). */
export async function getPaymentById(paymentId) {
  const payment = await paymentClient.get({ id: paymentId });
  return payment;
}
