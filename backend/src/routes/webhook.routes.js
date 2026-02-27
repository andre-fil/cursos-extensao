import { Router } from "express";
import { getPaymentById } from "../services/mercadoPago.service.js";

const router = Router();

/**
 * Extrai paymentId do payload do Mercado Pago (tolerante a variações).
 * Ordem: body.data.id, body.resource.id, body.id, query["data.id"]
 */
function extractPaymentId(req) {
  const body = req.body || {};
  return (
    body.data?.id ??
    body.resource?.id ??
    body.id ??
    req.query["data.id"] ??
    null
  );
}

/**
 * POST /webhook/mercadopago
 * Instrumentação para testes: valida fluxo Pagamento → Webhook → Backend.
 * NÃO integra Moodle; apenas logs e resposta 200.
 */
router.post("/mercadopago", (req, res) => {
  res.status(200).send();

  console.log("[webhook] BODY:", JSON.stringify(req.body));

  const paymentId = extractPaymentId(req);
  if (!paymentId) {
    console.log("[webhook] Ignorado: sem paymentId");
    return;
  }

  console.log("[webhook] paymentId:", paymentId);

  setImmediate(async () => {
    try {
      const payment = await getPaymentById(paymentId);
      console.log("[webhook] payment.status:", payment.status);
      console.log("[webhook] external_reference:", payment.external_reference ?? payment.external_reference_id);

      if (payment.status === "approved") {
        console.log("✅ PAGAMENTO APROVADO — FLUXO OK (SEM MOODLE)");
      }
    } catch (err) {
      console.log("[webhook] Erro ao processar:", err.message);
    }
  });
});

export default router;
