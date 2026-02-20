/**
 * Configuração do cliente Mercado Pago
 * Utiliza SDK oficial com timeout e tratamento de erros
 */

import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { env } from "./env.js";

const client = new MercadoPagoConfig({
  accessToken: env.MP_ACCESS_TOKEN,
  options: {
    timeout: env.MP_REQUEST_TIMEOUT,
  },
});

export const preferenceClient = new Preference(client);
export const paymentClient = new Payment(client);
