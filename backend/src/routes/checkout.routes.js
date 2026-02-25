import { Router } from "express";
import { getCourseById, createPreference } from "../services/mercadoPago.service.js";

const router = Router();

router.post("/create", async (req, res) => {
  try {
    const { courseId } = req.body;

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

    const init_point = await createPreference(courseId);
    res.json({ init_point });
  } catch (err) {
    console.error("[checkout/create]", err.message);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Erro ao criar preferência",
    });
  }
});

export default router;
