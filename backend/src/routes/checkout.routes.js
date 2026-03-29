import { Router } from "express";
import { getCourseById, createPreference, getPaymentById } from "../services/mercadoPago.service.js";
import { getUserByEmail, isUserEnrolledInCourse } from "../services/moodle.service.js";
import { syncMoodleAfterApprovedPayment } from "../services/moodleEnrollmentFromPayment.service.js";
import { getMoodleCourseId } from "../utils/courseMap.js";

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
    console.log("[checkout/create]", err.message);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: err.message || "Erro ao criar preferência",
    });
  }
});

/**
 * GET /checkout/verify-enrollment?payment_id=...
 * Valida: pagamento aprovado no MP e matrícula efetivada no Moodle.
 */
router.get("/verify-enrollment", async (req, res) => {
  try {
    const paymentId = req.query.payment_id;
    if (!paymentId) return res.status(400).json({ ok: false, error: "payment_id é obrigatório" });

    const payment = await getPaymentById(paymentId);
    const status = payment.status || "unknown";
    const externalRef = payment.external_reference ?? payment.external_reference_id;

    if (status !== "approved") {
      return res.json({ ok: false, created: false, pending: true, status });
    }

    if (!externalRef || typeof externalRef !== "string") {
      return res.json({ ok: false, created: false, pending: true, status, error: "external_reference ausente" });
    }

    const parsed = parseExternalReference(externalRef);
    if (!parsed) {
      return res.json({ ok: false, created: false, pending: true, status, error: "external_reference inválido" });
    }

    const moodleCourseId = getMoodleCourseId(parsed.courseId);
    if (!moodleCourseId) {
      return res.json({ ok: true, created: false, pending: true, status, error: "Curso não mapeado" });
    }

    const emailFromRef = String(parsed.value ?? "").trim();
    let user = emailFromRef.includes("@") ? await getUserByEmail(emailFromRef) : null;
    let enrolled = false;
    if (user) {
      enrolled = await isUserEnrolledInCourse(user.id, moodleCourseId);
    }

    // Fallback: webhook do MP pode não ter chegado — cria/matrícula na hora da página de sucesso
    if (!user || !enrolled) {
      console.log("[checkout/verify-enrollment] sync Moodle (usuário ausente ou não matriculado)");
      try {
        const sync = await syncMoodleAfterApprovedPayment(payment, "[verify-enrollment]");
        if (sync.enrolled) {
          return res.json({
            ok: true,
            created: true,
            pending: false,
            status,
            email: sync.email,
          });
        }
        if (sync.ok && !sync.enrolled) {
          return res.json({
            ok: true,
            created: false,
            pending: true,
            status,
            email: sync.email ?? emailFromRef,
            error: "matricula_nao_confirmada",
          });
        }
        return res.json({
          ok: true,
          created: false,
          pending: true,
          status,
          email: emailFromRef || undefined,
          error: sync.reason || "sync_falhou",
        });
      } catch (syncErr) {
        console.error("[checkout/verify-enrollment] sync:", syncErr.message);
        if (syncErr.stack) console.error(syncErr.stack);
        return res.json({
          ok: true,
          created: false,
          pending: true,
          status,
          email: emailFromRef || undefined,
          error: syncErr.message,
        });
      }
    }

    return res.json({ ok: true, created: true, pending: false, status, email: user.email });
  } catch (err) {
    console.error("[checkout/verify-enrollment]", err.message);
    res.status(500).json({ ok: false, created: false, pending: true, error: err.message });
  }
});

export default router;
