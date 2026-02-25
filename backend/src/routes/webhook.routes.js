import { Router } from "express";

const router = Router();

// MP_WEBHOOK_SECRET: preparado para futura validação de assinatura
// const secret = process.env.MP_WEBHOOK_SECRET;

router.post("/mercadopago", (req, res) => {
  console.log("[webhook] body:", JSON.stringify(req.body));
  res.status(200).send();
});

export default router;
