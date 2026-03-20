import { Router } from "express";
import { getPaymentById } from "../services/mercadoPago.service.js";
import { getUserByEmail, createUser, enrollUserInCourse, isUserEnrolledInCourse } from "../services/moodle.service.js";
import { getMoodleCourseId } from "../utils/courseMap.js";

const router = Router();

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
        const enrolled = await isUserEnrolledInCourse(user.id, courseId);
        if (enrolled) {
          console.log("✅ PAGAMENTO APROVADO — FLUXO OK (MATRICULA NO MOODLE)");
        } else {
          console.log("[webhook] ⚠️ tentativa de matrícula não confirmada no Moodle", {
            userId: user.id,
            courseId,
          });
        }
      }
    } catch (err) {
      console.error("[webhook] Erro ao processar:", err.message);
      if (err.stack) console.error(err.stack);
    }
  });
});

export default router;
