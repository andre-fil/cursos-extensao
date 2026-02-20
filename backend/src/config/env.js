/**
 * Configuração de variáveis de ambiente
 * Garante validação e valores padrão seguros
 */

import dotenv from "dotenv";

dotenv.config();

// Validação: ACCESS_TOKEN é obrigatório
const accessToken = process.env.MP_ACCESS_TOKEN;
if (!accessToken || accessToken.trim() === "") {
  console.error(
    "[ERRO] MP_ACCESS_TOKEN não configurado. Defina no arquivo .env"
  );
  console.error("Copie env.example para .env e preencha MP_ACCESS_TOKEN");
  process.exit(1);
}

// Base URL para redirecionamento (back_urls)
const baseUrl = process.env.BASE_URL || "http://localhost:5500";

// URL base do backend (para notification_url do webhook)
// Obrigatória em produção. Em desenvolvimento, use ngrok ou similar.
const apiBaseUrl = process.env.API_BASE_URL || "";

// Chave secreta do webhook (painel MP > Webhooks > Configurar notificações)
// Usada para validar assinatura x-signature das notificações
const webhookSecret = process.env.MP_WEBHOOK_SECRET || "";

// Porta do servidor
const port = parseInt(process.env.PORT || "3000", 10);

// Timeout para requisições ao Mercado Pago (em ms)
const mpTimeout = parseInt(process.env.MP_REQUEST_TIMEOUT || "10000", 10);

export const env = {
  /** Access Token do Mercado Pago (obrigatório) */
  MP_ACCESS_TOKEN: accessToken.trim(),
  /** URL base do frontend para redirecionamento */
  BASE_URL: baseUrl.replace(/\/$/, ""),
  /** URL base do backend (HTTPS) para notification_url - ex: https://api.seudominio.com */
  API_BASE_URL: apiBaseUrl.replace(/\/$/, ""),
  /** Chave secreta do webhook (validação HMAC) - opcional */
  MP_WEBHOOK_SECRET: webhookSecret.trim(),
  /** Porta do servidor Express */
  PORT: isNaN(port) ? 3000 : port,
  /** Timeout para API Mercado Pago (ms) */
  MP_REQUEST_TIMEOUT: mpTimeout > 0 ? Math.min(mpTimeout, 30000) : 10000,
};
