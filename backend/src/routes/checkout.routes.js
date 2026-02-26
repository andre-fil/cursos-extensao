import { Router } from "express";
import { getCourseById, createPreference } from "../services/mercadoPago.service.js";

const router = Router();

/**
 * POST /checkout/create
 * Body: { courseId, type: "existing"|"new", registration? (se existing), user? (se new) }
 * Não cria usuário no Moodle; apenas cria preferência com external_reference para o webhook.
 */
router.post("/create", async (req, res) => {
  try {
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

    const init_point = await createPreference(courseId, { type, registration, user });
    res.json({ init_point });
  } catch (err) {
    console.error("[checkout/create]", err.message);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: err.message || "Erro ao criar preferência",
    });
  }
});

export default router;
