/**
 * FEMAF Backend - Servidor Express
 *
 * Integração com Mercado Pago Checkout Pro.
 * Estruturado para segurança, tolerância a falhas e produção inicial.
 */

import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import checkoutRoutes from "./routes/checkout.js";
import webhookRoutes from "./routes/webhook.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestTimeout } from "./middleware/requestTimeout.js";

const app = express();

// ============================================
// Middlewares
// ============================================

// CORS - permitir frontend (ajustar origins em produção)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Parser JSON com limite para evitar payloads excessivos
app.use(express.json({ limit: "10kb" }));

// Timeout seguro - encerra requisições que excedem 15s
app.use(requestTimeout(15000));

// ============================================
// Rotas
// ============================================

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Checkout - criação de preferência de pagamento
app.use("/checkout", checkoutRoutes);

// Webhook - preparado para notificações do Mercado Pago (não implementado)
app.use("/webhook", webhookRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: "NOT_FOUND", message: "Rota não encontrada" });
});

// ============================================
// Error Handler (deve ser o último middleware)
// ============================================

app.use(errorHandler);

// ============================================
// Inicialização
// ============================================

app.listen(env.PORT, () => {
  console.log(`[FEMAF Backend] Servidor rodando na porta ${env.PORT}`);
  console.log(`[FEMAF Backend] Checkout: POST http://localhost:${env.PORT}/checkout/create`);
  console.log(`[FEMAF Backend] Health:   GET  http://localhost:${env.PORT}/health`);
});
