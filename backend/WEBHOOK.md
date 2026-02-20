# Configuração de Webhook - Notificações de Pagamento

O webhook recebe notificações em tempo real do Mercado Pago quando há eventos de pagamento (criado, atualizado).

## Duas formas de configurar

### 1. Painel do Mercado Pago (recomendado)

1. Acesse [Suas integrações](https://www.mercadopago.com.br/developers/panel/app)
2. Selecione sua aplicação
3. Menu **Webhooks** > **Configurar notificações**
4. Em **Modo produtivo**, informe a URL (HTTPS): `https://extensao.femaf.com.br/webhook/mercadopago`
5. Selecione o evento **Pagamentos**
6. Clique em **Salvar configuração**
7. Revele e copie a **chave secreta** → adicione no `.env` como `MP_WEBHOOK_SECRET`

> A URL configurada no painel tem prioridade sobre `notification_url` da preferência.

### 2. Via preferência (notification_url)

Quando `API_BASE_URL` está definido no `.env`, a `notification_url` é incluída automaticamente em cada preferência criada.

```env
API_BASE_URL=https://extensao.femaf.com.br
```

> `notification_url` exige **HTTPS**.

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `API_BASE_URL` | URL pública do backend (HTTPS) – ex: `https://extensao.femaf.com.br` |
| `MP_WEBHOOK_SECRET` | Chave secreta (Painel MP > Webhooks) – validação HMAC das notificações |

## Validação de assinatura

Quando `MP_WEBHOOK_SECRET` está configurado, o webhook valida o header `x-signature` para garantir que a notificação veio do Mercado Pago.

## Desenvolvimento local

O Mercado Pago não consegue acessar `localhost`. Para testar:

1. Use [ngrok](https://ngrok.com): `ngrok http 3000`
2. Configure no painel a URL gerada: `https://xxxx.ngrok.io/webhook/mercadopago` (em produção use `https://extensao.femaf.com.br/webhook/mercadopago`)
3. Ou use **Simular** no painel MP (não envia notificações reais de teste)

> Pagamentos com credenciais de teste **não** disparam webhooks reais. Use a simulação do painel.

## Resposta obrigatória

O endpoint deve responder **200** ou **201** em até **22 segundos**. Caso contrário, o Mercado Pago tenta reenviar a cada 15 minutos (até 8 tentativas).

## Formato da notificação

Exemplo de payload recebido:

```json
{
  "action": "payment.updated",
  "type": "payment",
  "data": { "id": "123456789" },
  "live_mode": false,
  "date_created": "2021-11-01T02:02:02Z"
}
```

Para obter os detalhes do pagamento, use: `GET /v1/payments/{id}` (já feito internamente no processamento).
