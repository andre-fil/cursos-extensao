import { Router } from "express";
import { getPaymentById } from "../services/mercadoPago.service.js";
import { syncMoodleAfterApprovedPayment } from "../services/moodleEnrollmentFromPayment.service.js";

const router = Router();

/** Mercado Pago envia 2+ POSTs seguidos (ex.: payment.created + topic=payment). Serializa por paymentId. */
const webhookTailByPaymentId = new Map();

/**
 * Extrai paymentId do payload do Mercado Pago (JSON ou form-urlencoded).
 */
function extractPaymentId(req) {
  const body = req.body || {};
  const q = req.query || {};

  let id =
    body.data?.id ??
    body.resource?.id ??
    body.id ??
    q["data.id"] ??
    q.id ??
    null;

  // Chaves “achatadas” em form: data.id=... ou data[id]=...
  if (id == null && body["data.id"] != null) id = body["data.id"];
  if (id == null && body["data[id]"] != null) id = body["data[id]"];

  // Formato legado: topic=payment & resource=ID ou id=ID
  if (id == null && String(body.topic || "").toLowerCase() === "payment") {
    const r = body.resource ?? body.id;
    if (r != null && /^\d+$/.test(String(r))) id = r;
  }

  // resource como URL .../payments/12345
  if (id == null && typeof body.resource === "string") {
    const m = body.resource.match(/\/payments\/(\d+)/);
    if (m) id = m[1];
  }

  return id != null ? String(id) : null;
}

/**
 * POST /webhook/mercadopago
 * Responde 200 imediatamente ao MP; em background consulta o pagamento.
 * Se approved: busca/cria usuário no Moodle e matricula no curso (courseMap).
 */
router.post("/mercadopago", (req, res) => {
  res.status(200).send();

  console.log("[webhook] BODY:", JSON.stringify(req.body));

  const paymentId = extractPaymentId(req);
  if (!paymentId) {
    console.log(
      "[webhook] Ignorado: sem paymentId | Content-Type:",
      req.headers["content-type"],
      "| keys body:",
      req.body && typeof req.body === "object" ? Object.keys(req.body).join(",") : typeof req.body
    );
    return;
  }

  console.log("[webhook] paymentId:", paymentId);

  const prev = webhookTailByPaymentId.get(paymentId) || Promise.resolve();
  const job = prev
    .catch(() => {})
    .then(async () => {
      try {
        const payment = await getPaymentById(paymentId);
        console.log("[webhook] payment.status:", payment.status);
        const external_reference = payment.external_reference ?? payment.external_reference_id;
        console.log("[webhook] external_reference:", external_reference);

        if (payment.status !== "approved") {
          console.log("[webhook] ignorado: status não é approved");
          return;
        }

        console.log("[webhook] iniciando sync Moodle…");
        const sync = await syncMoodleAfterApprovedPayment(payment, "[webhook]");
        if (sync.enrolled) {
          console.log("✅ PAGAMENTO APROVADO — FLUXO OK (MATRICULA NO MOODLE)");
        } else if (sync.ok) {
          console.log("[webhook] ⚠️ matrícula não confirmada", sync);
        } else {
          console.log("[webhook] sync Moodle não concluído:", sync.reason);
        }
      } catch (err) {
        console.error("[webhook] Erro ao processar:", err.message);
        if (err.stack) console.error(err.stack);
      }
    });
  webhookTailByPaymentId.set(paymentId, job);
  job.finally(() => {
    if (webhookTailByPaymentId.get(paymentId) === job) {
      webhookTailByPaymentId.delete(paymentId);
    }
  });
});

export default router;
