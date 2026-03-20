import "dotenv/config";
import express from "express";
import cors from "cors";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import checkoutRoutes from "./routes/checkout.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import moodleRoutes from "./routes/moodle.routes.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, "../package.json"), "utf8"));
const deployTag = process.env.APP_DEPLOY_TAG || null;

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
// Mercado Pago costuma enviar webhook como application/x-www-form-urlencoded (não JSON)
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use((req, res, next) => {
  console.log("[API]", req.method, req.originalUrl);
  next();
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: pkg.version,
    deployTag,
    moodle: {
      baseUrlSet: Boolean(process.env.MOODLE_BASE_URL?.trim()),
      tokenSet: Boolean(process.env.MOODLE_TOKEN?.trim()),
      roleId: parseInt(process.env.MOODLE_ROLE_ID || "5", 10),
    },
  });
});

app.use("/checkout", checkoutRoutes);
app.use("/webhook", webhookRoutes);
app.use("/moodle", moodleRoutes);

app.use((req, res) => {
  console.log("[API] 404 - Rota não encontrada:", req.method, req.originalUrl);
  res.status(404).json({ error: "NOT_FOUND" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(
    `[FEMAF Backend] v${pkg.version}${deployTag ? " deploy=" + deployTag : ""} | porta ${port} | Moodle: ${process.env.MOODLE_BASE_URL ? "URL ok" : "sem MOODLE_BASE_URL"} | token: ${process.env.MOODLE_TOKEN ? "ok" : "faltando"}`
  );
});
