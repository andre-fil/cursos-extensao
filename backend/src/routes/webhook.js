/**
 * Rotas de Webhook - Mercado Pago
 *
 * Recebe notificações em tempo real quando há eventos de pagamento.
 * Deve responder 200/201 em até 22 segundos para evitar retentativas.
 *
 * Duas formas de configurar a URL:
 * 1. Painel MP > Suas integrações > Webhooks > Configurar notificações
 * 2. notification_url na preferência (configurada em checkout.js quando API_BASE_URL está definido)
 *
 * Documentação: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 */

import { Router } from "express";
import crypto from "crypto";
import { env } from "../config/env.js";
import { paymentClient } from "../config/mercadopago.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

/**
 * Valida a assinatura x-signature do Mercado Pago (HMAC-SHA256)
 * Formato: ts=1234567890,v1=hash
 * Manifest: id:{dataId};request-id:{xRequestId};ts:{ts}; (omitir valores ausentes)
 */
function validateWebhookSignature(dataId, xRequestId, xSignature, secret) {
  if (!secret || !xSignature || !dataId) return false;

  const parts = xSignature.split(",");
  let ts = null;
  let hash = null;

  for (const part of parts) {
    const [key, value] = part.split("=").map((s) => s.trim());
    if (key === "ts") ts = value;
    else if (key === "v1") hash = value;
  }

  if (!ts || !hash) return false;

  // Monta manifest conforme doc - omitir valores ausentes
  const manifest = xRequestId
    ? `id:${dataId};request-id:${xRequestId};ts:${ts};`
    : `id:${dataId};ts:${ts};`;
  const expectedHash = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  if (hash.length !== expectedHash.length) return false;

  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(expectedHash, "hex")
  );
}

/**
 * Processa a notificação em segundo plano (após responder 200)
 */
async function processNotification(type, dataId) {
  try {
    if (type === "payment") {
      const payment = await paymentClient.get({ id: dataId });
      const { status, external_reference } = payment;

      // external_reference = courseId (configurado na preferência)
      console.log("[Webhook] Pagamento:", {
        payment_id: dataId,
        status,
        external_reference,
      });

      // TODO: Atualizar banco de dados / matrícula quando status === "approved"
      // Ex: atualizarMatricula(external_reference, payment);
    }
  } catch (err) {
    console.error("[Webhook] Erro ao processar notificação:", err.message);
  }
}

/**
 * POST /webhook/mercadopago
 *
 * Recebe notificações do Mercado Pago.
 * - Responde 200 rapidamente para confirmar recebimento
 * - Processa pagamentos em segundo plano
 */
router.post(
  "/mercadopago",
  asyncHandler(async (req, res) => {
    // Dados podem vir em query params (painel) ou body (notification_url)
    const dataId = req.query["data.id"] || req.body?.data?.id;
    const type = req.query.type || req.body?.type;
    const xSignature = req.headers["x-signature"];
    const xRequestId = req.headers["x-request-id"];

    if (!dataId || !type) {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: "Parâmetros data.id e type são obrigatórios",
      });
    }

    // Validar assinatura quando MP_WEBHOOK_SECRET estiver configurado
    if (env.MP_WEBHOOK_SECRET) {
      const isValid = validateWebhookSignature(
        dataId,
        xRequestId || "",
        xSignature || "",
        env.MP_WEBHOOK_SECRET
      );
      if (!isValid) {
        console.warn("[Webhook] Assinatura inválida - possível tentativa de fraude");
        return res.status(401).json({
          error: "UNAUTHORIZED",
          message: "Assinatura da notificação inválida",
        });
      }
    }

    // Responde 200 imediatamente (requisito: até 22s)
    res.status(200).send();

    // Processa em segundo plano
    setImmediate(() => processNotification(type, dataId));
  })
);

export default router;
