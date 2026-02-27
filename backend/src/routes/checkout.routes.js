import { Router } from "express";
import { getCourseById, createPreference, getPaymentById } from "../services/mercadoPago.service.js";
// Moodle desativado para testes isolados
// import { findUserByEmail, findUserByRegistration, isUserEnrolledInCourse } from "../services/moodle.service.js";
// import { getMoodleCourseId } from "../utils/courseMap.js";

const router = Router();

/** Parseia external_reference: "COURSE_ID|existing|REGISTRATION" ou "COURSE_ID|new|EMAIL" */
function parseExternalReference(ref) {
  if (!ref || typeof ref !== "string") return null;
  const parts = ref.split("|");
  if (parts.length !== 3) return null;
  return { courseId: parts[0], type: parts[1], value: parts[2] };
}

/**
 * POST /checkout/create
 * Body: { courseId, type: "existing"|"new", registration? (se existing), user? (se new) }
 * Não cria usuário no Moodle; apenas cria preferência com external_reference para o webhook.
 */
router.post("/create", async (req, res) => {
  try {
    console.log("[checkout] payload recebido:", req.body);
    const { courseId, type, registration, user } = req.body;

    if (!courseId || typeof courseId !== "string") {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: "courseId é obrigatório e deve ser string",
      });
    }

    const course = getCourseById(courseId);
    if (!course) {
      return res.status(404).json({
        error: "COURSE_NOT_FOUND",
        message: "Curso não encontrado",
      });
    }

    if (type === "existing") {
      if (!registration || typeof registration !== "string" || !String(registration).trim()) {
        return res.status(400).json({
          error: "BAD_REQUEST",
          message: "Para tipo 'existing', o campo registration (matrícula EAD) é obrigatório",
        });
      }
    } else if (type === "new") {
      if (!user || typeof user !== "object") {
        return res.status(400).json({
          error: "BAD_REQUEST",
          message: "Para tipo 'new', o objeto user é obrigatório",
        });
      }
      const u = user;
      if (!u.email || !String(u.email).trim()) {
        return res.status(400).json({
          error: "BAD_REQUEST",
          message: "user.email é obrigatório",
        });
      }
      if (!u.firstname || !String(u.firstname).trim()) {
        return res.status(400).json({ error: "BAD_REQUEST", message: "user.firstname é obrigatório" });
      }
      if (!u.lastname || !String(u.lastname).trim()) {
        return res.status(400).json({ error: "BAD_REQUEST", message: "user.lastname é obrigatório" });
      }
      if (!u.cpf || !String(u.cpf).trim()) {
        return res.status(400).json({ error: "BAD_REQUEST", message: "user.cpf é obrigatório" });
      }
    } else {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: "type deve ser 'existing' ou 'new'",
      });
    }

    const result = await createPreference(courseId, { type, registration, user });
    const init_point = result.init_point;
    const externalReference = result.external_reference;
    const preferenceId = result.preferenceId;
    console.log("[checkout] external_reference:", externalReference);
    console.log("[checkout] preference id:", preferenceId);
    res.json({ init_point });
  } catch (err) {
    console.error("[checkout/create]", err.message);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: err.message || "Erro ao criar preferência",
    });
  }
});

/**
 * GET /checkout/verify-enrollment?payment_id=123
 * Valida se o pagamento foi aprovado. (Moodle desativado: não verifica matrícula.)
 * Retorna { ok, created, email?, pending? } para exibir na página de sucesso.
 */
router.get("/verify-enrollment", async (req, res) => {
  try {
    const paymentId = req.query.payment_id;
    console.log("[checkout/verify-enrollment] Requisição recebida. payment_id:", paymentId);
    if (!paymentId) {
      return res.status(400).json({ ok: false, error: "payment_id é obrigatório" });
    }

    const payment = await getPaymentById(paymentId);
    console.log("[checkout/verify-enrollment] Pagamento obtido:", { status: payment.status, external_ref: payment.external_reference || payment.external_reference_id });
    if (payment.status !== "approved") {
      return res.json({ ok: false, created: false, status: payment.status || "unknown" });
    }

    const externalRef = payment.external_reference || payment.external_reference_id;
    const parsed = parseExternalReference(externalRef);
    if (!parsed) {
      return res.json({ ok: false, created: false, error: "external_reference inválido" });
    }

    const { type: userType, value } = parsed;
    console.log("[checkout/verify-enrollment] external_reference parseado:", parsed);
    // Moodle desativado: retorna ok com pending=true e email (para sucesso.html exibir dados)
    if (userType === "new") {
      const email = value || payment.payer?.email || null;
      console.log("[checkout/verify-enrollment] Resposta: ok, pending, email:", email);
      return res.json({ ok: true, created: false, pending: true, email });
    }
    if (userType === "existing") {
      return res.json({ ok: true, created: false, pending: true });
    }
    return res.json({ ok: false, created: false });
  } catch (err) {
    console.error("[checkout/verify-enrollment]", err.message);
    res.status(500).json({ ok: false, created: false, error: err.message });
  }
});

export default router;
