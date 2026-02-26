import { Router } from "express";
import { getPaymentById } from "../services/mercadoPago.service.js";
import { findUserByRegistration, createUser, enrollUserInCourse } from "../services/moodle.service.js";
import { getMoodleCourseId } from "../utils/courseMap.js";

const router = Router();

/**
 * Parseia external_reference: "COURSE_ID|existing|REGISTRATION" ou "COURSE_ID|new|EMAIL"
 */
function parseExternalReference(ref) {
  if (!ref || typeof ref !== "string") return null;
  const parts = ref.split("|");
  if (parts.length !== 3) return null;
  return { courseId: parts[0], type: parts[1], value: parts[2] };
}

/**
 * POST /webhook/mercadopago
 * Fonte da verdade: sempre usar webhook. Nunca confiar em redirect.
 * Pagamento aprovado → criar ou localizar usuário → matricular no Moodle.
 * Sempre responde 200 para o MP.
 */
router.post("/mercadopago", async (req, res) => {
  res.status(200).send();

  const dataId = req.query["data.id"] || req.body?.data?.id;
  const type = req.query.type || req.body?.type;

  if (!dataId || type !== "payment") {
    console.log("[webhook] Ignorado: data.id ou type ausente");
    return;
  }

  setImmediate(async () => {
    try {
      const payment = await getPaymentById(dataId);
      const status = payment.status;
      const externalRef = payment.external_reference || payment.external_reference_id;

      console.log("[webhook] Pagamento:", { payment_id: dataId, status, external_reference: externalRef });

      if (status !== "approved") {
        console.log("[webhook] Status não aprovado, nenhuma ação no Moodle");
        return;
      }

      const parsed = parseExternalReference(externalRef);
      if (!parsed) {
        console.log("[webhook] external_reference inválido:", externalRef);
        return;
      }

      const { courseId, type: userType, value } = parsed;
      const moodleCourseId = getMoodleCourseId(courseId);

      if (!moodleCourseId) {
        console.log("[webhook] Curso não mapeado para Moodle:", courseId);
        return;
      }

      let moodleUserId;

      if (userType === "existing") {
        const registration = value;
        const existingUser = await findUserByRegistration(registration);
        if (!existingUser) {
          console.log("[webhook] Usuário não encontrado no Moodle (matrícula):", registration);
          return;
        }
        moodleUserId = existingUser.id;
        console.log("[webhook] Tipo: existing. Usuário Moodle:", moodleUserId);
      } else if (userType === "new") {
        const payer = payment.payer || {};
        const email = value || payer.email;
        if (!email) {
          console.log("[webhook] Email ausente no pagamento para tipo new");
          return;
        }
        const userData = {
          firstname: payer.first_name || payer.firstname || "Nome",
          lastname: payer.last_name || payer.lastname || "Sobrenome",
          email: email,
          cpf: payer.identification?.number || "",
        };
        const newUser = await createUser(userData);
        moodleUserId = newUser.id;
        console.log("[webhook] Tipo: new. Usuário criado no Moodle:", moodleUserId);
      } else {
        console.log("[webhook] Tipo desconhecido:", userType);
        return;
      }

      await enrollUserInCourse(moodleUserId, moodleCourseId);
      console.log("[webhook] Matrícula realizada. user:", moodleUserId, "course:", moodleCourseId);
    } catch (err) {
      console.error("[webhook] Erro ao processar:", err.message);
    }
  });
});

export default router;
