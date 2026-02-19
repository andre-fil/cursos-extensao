# FEMAF Backend - Mercado Pago Checkout Pro

Backend Node.js/Express para integração com Mercado Pago Checkout Pro. Focado em segurança, tolerância a falhas e prontidão para produção inicial.

## Requisitos

- Node.js 18+
- Conta Mercado Pago (Developer)

## Instalação

```bash
cd backend
npm install
```

## Configuração

1. Copie o arquivo de exemplo de variáveis de ambiente:
   ```bash
   copy env.example .env
   ```
   (No Linux/Mac: `cp env.example .env`)

2. Edite o `.env` e configure:
   - `MP_ACCESS_TOKEN`: Token de acesso do Mercado Pago (obrigatório)
   - `BASE_URL`: URL do frontend (ex: `http://localhost:5500` ou domínio em produção)
   - `PORT`: Porta do servidor (opcional, padrão: 3000)

3. Obtenha o Access Token em: https://www.mercadopago.com.br/developers/panel/app

## Executar

```bash
npm start
```

Para desenvolvimento com hot-reload:
```bash
npm run dev
```

## Endpoints

### POST /checkout/create

Cria uma preferência de pagamento no Mercado Pago.

**Request:**
```json
{
  "courseId": "EXT-001"
}
```

**Response (200):**
```json
{
  "init_point": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=..."
}
```

**Erros:**
- 400: courseId ausente ou inválido
- 404: Curso não encontrado no catálogo
- 500: Erro interno ou falha na API Mercado Pago
- 504: Timeout

### GET /health

Health check do servidor.

## Catálogo de Cursos

O catálogo interno está em `src/config/catalog.js`. Os preços são definidos exclusivamente no backend — o frontend envia apenas o `courseId`.

## Segurança

- Nenhum valor de preço ou título do frontend é aceito
- Access Token via variável de ambiente
- Timeout em requisições e na comunicação com Mercado Pago
- Tratamento de exceções com respostas HTTP claras

## Webhook

O código está preparado para implementação futura do webhook em `/webhook/mercadopago`. Atualmente retorna 501 Not Implemented.
