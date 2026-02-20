/**
 * Rotas de Checkout - Mercado Pago Checkout Pro
 *
 * Segurança: NÃO confia em valores do frontend (preço, título, etc.)
 * Todos os dados de pagamento vêm exclusivamente do catálogo interno.
 */

import { Router } from "express";
import { getCourseById } from "../config/catalog.js";
import { preferenceClient } from "../config/mercadopago.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

/**
 * POST /checkout/create
 *
 * Cria uma preferência de pagamento no Mercado Pago.
 * Recebe apenas courseId - valida contra catálogo interno e usa preço do backend.
 *
 * Body: { courseId: string }
 * Response: { init_point: string }
 *
 * Erros:
 * - 400: courseId inválido ou ausente
 * - 404: curso não encontrado no catálogo
 * - 500: falha na comunicação com Mercado Pago
 *
 * Estrutura preparada para idempotência:
 * - Em versão futura, aceitar header X-Idempotency-Key
 * - Cachear resposta por chave para evitar duplicação em retries
 */
router.post(
  "/create",
  asyncHandler(async (req, res) => {
  try {
    // Extrair e validar courseId
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: "O campo courseId é obrigatório",
      });
    }

    if (typeof courseId !== "string") {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: "courseId deve ser uma string",
      });
    }

    // Validar curso no catálogo interno (NÃO confiar no frontend)
    const course = getCourseById(courseId);

    if (!course) {
      return res.status(404).json({
        error: "COURSE_NOT_FOUND",
        message: "Curso não encontrado no catálogo",
      });
    }

    // Construir URLs de redirecionamento
    const baseUrl = env.BASE_URL;
    const backUrls = {
      success: `${baseUrl}/curso.html?courseId=${course.id}&status=approved`,
      failure: `${baseUrl}/curso.html?courseId=${course.id}&status=failure`,
      pending: `${baseUrl}/curso.html?courseId=${course.id}&status=pending`,
    };

    // Criar preferência - dados exclusivamente do backend
    const preferenceBody = {
      items: [
        {
          id: course.id,
          title: course.title,
          unit_price: course.price,
          quantity: 1,
          currency_id: "BRL",
        },
      ],
      back_urls: backUrls,
      auto_return: "approved",
      // external_reference: courseId - útil para webhook identificar o pagamento
      external_reference: course.id,
      // notification_url: quando API_BASE_URL está definido (HTTPS obrigatório)
      ...(env.API_BASE_URL && {
        notification_url: `${env.API_BASE_URL}/webhook/mercadopago`,
      }),
    };

    const preference = await preferenceClient.create({ body: preferenceBody });

    // Retornar somente o init_point conforme requisito
    if (!preference.init_point) {
      throw new Error("Resposta do Mercado Pago sem init_point");
    }

    return res.status(200).json({
      init_point: preference.init_point,
    });
  } catch (error) {
    // Repassa para o error handler global
    throw error;
  }
  })
);

export default router;
