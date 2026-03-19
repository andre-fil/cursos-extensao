import { Router } from "express";
import { getPaymentById } from "../services/mercadoPago.service.js";
import { getUserByEmail, createUser, enrollUserInCourse } from "../services/moodle.service.js";
import { getMoodleCourseId } from "../utils/courseMap.js";

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
      const external_reference = payment.external_reference ?? payment.external_reference_id;
      console.log("[webhook] external_reference:", external_reference);

      if (payment.status === "approved") {
        console.log("[webhook] external_reference:", external_reference);

        const refString = typeof external_reference === "string" ? external_reference : "";
        const parts = refString.split("|");
        if (parts.length !== 3) {
          console.log("[webhook] external_reference inválido (esperado COURSE_ID|type|identifier):", external_reference);
          return;
        }

        const [extCourseId, type, identifier] = parts;

        // Para agora: usar identifier direto como email (placeholder para "buscar email pela matrícula")
        let email = identifier;
        console.log("[webhook] email:", email);

        // Mapeamento de cursos (EXT-XXX -> ID do Moodle)
        const courseId = getMoodleCourseId(extCourseId);
        if (!courseId) {
          console.log("[webhook] Curso não mapeado:", extCourseId);
          return;
        }

        let user = await getUserByEmail(email);
        console.log("[webhook] user encontrado:", user);

        if (!user) {
          const newUser = await createUser({
            email,
            firstname: "Aluno",
            lastname: "FEMAF",
          });
          user = { id: newUser.id, email, username: email };
          console.log("[webhook] user encontrado:", user);
        }

        if (!user?.id) {
          console.log("[webhook] Não foi possível obter o ID do usuário para matricular:", { email });
          return;
        }

        console.log("[webhook] matriculando no curso:", courseId);
        await enrollUserInCourse(user.id, courseId);
        console.log("✅ PAGAMENTO APROVADO — FLUXO OK (MATRICULA NO MOODLE)");
      }
    } catch (err) {
      console.log("[webhook] Erro ao processar:", err.message);
    }
  });
});

export default router;
