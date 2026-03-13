import { Router } from "express";
import { getUserByEmail, createUser } from "../services/moodle.service.js";

const router = Router();

/**
 * GET /moodle/test-user?email=...
 * Teste isolado: busca usuário no Moodle por e-mail.
 */
router.get("/test-user", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: "Parâmetro email é obrigatório. Ex: ?email=aluno@email.com" });
    }
    const user = await getUserByEmail(email);
    if (!user) {
      return res.json({ found: false, message: "Usuário não encontrado no Moodle" });
    }
    res.json({ found: true, user });
  } catch (err) {
    console.error("[moodle/test-user]", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /moodle/test-create-user
 * Body: { email, firstname, lastname }
 * Teste isolado: cria usuário no Moodle. Username = email; senha temporária gerada.
 */
router.post("/test-create-user", async (req, res) => {
  try {
    const { email, firstname, lastname } = req.body || {};
    if (!email || !String(email).trim()) {
      return res.status(400).json({ error: "Campo email é obrigatório" });
    }
    const username = String(email).trim();
    const password = process.env.MOODLE_TEST_PASSWORD || "Temp@Moodle123";
    const user = await createUser({
      username,
      password,
      firstname: String(firstname ?? "").trim() || "Nome",
      lastname: String(lastname ?? "").trim() || "Sobrenome",
      email: String(email).trim(),
    });
    res.json({ created: true, moodleUserId: user.id, username });
  } catch (err) {
    console.error("[moodle/test-create-user]", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
