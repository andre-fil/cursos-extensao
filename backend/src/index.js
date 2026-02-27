import "dotenv/config";
import express from "express";
import cors from "cors";
import checkoutRoutes from "./routes/checkout.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";

if (!process.env.MP_ACCESS_TOKEN) {
  console.error("[ERRO] MP_ACCESS_TOKEN não definido. Configure no App Runner.");
  process.exit(1);
}

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json({ limit: "10kb" }));

app.use((req, res, next) => {
  console.log("[API]", req.method, req.originalUrl);
  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/checkout", checkoutRoutes);
app.use("/webhook", webhookRoutes);

app.use((req, res) => {
  console.log("[API] 404 - Rota não encontrada:", req.method, req.originalUrl);
  res.status(404).json({ error: "NOT_FOUND" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`[FEMAF Backend] Rodando na porta ${port}`);
});
