# Hospedagem do Backend FEMAF na AWS

Passo a passo detalhado para colocar o backend Node.js no ar na AWS e testar o fluxo com Mercado Pago.

---

## Pré-requisitos

- Conta AWS
- Código do backend no GitHub (pasta `backend` ou repositório só do backend)
- Variáveis que você vai precisar:
  - `MP_ACCESS_TOKEN` (Mercado Pago)
  - `MP_WEBHOOK_SECRET` (Painel MP > Webhooks)
  - `BASE_URL=https://extensao.femaf.com.br`
  - `API_BASE_URL` = URL que a AWS gerar (ex.: `https://xxxxx.us-east-1.awsapprunner.com`)

---

# Opção A: AWS App Runner (recomendado – mais simples)

App Runner faz build e deploy a partir do repositório, com HTTPS incluso.

## Passo 1: Acessar o App Runner

1. Entre no [Console AWS](https://console.aws.amazon.com/)
2. No campo de busca, digite **App Runner** e abra o serviço
3. Região: escolha uma (ex.: **us-east-1** – N. Virginia)
4. Clique em **Create service**

## Passo 2: Configurar origem (repositório)

1. Em **Source and deployment**:
   - **Repository type:** Source code repository
   - **Connect to GitHub:** clique em **Add new** e autorize a AWS (se ainda não conectou)
   - **Repository:** selecione o repositório do projeto (ex.: FEMAF)
   - **Branch:** `main` (ou a branch que você usa)
   - **Source directory:** se o backend está na pasta `backend` do repositório, informe **backend**. Se o repositório contém só o backend, deixe em branco.
   - **Deployment settings:** Automatic (deploy a cada push)
2. Em **Configure build**:
   - **Runtime:** Node.js 18
   - **Build command:** deixe em branco ou `npm install`
   - **Start command:** `npm start`
   - **Port:** `3000`
3. Avance com **Next**

## Passo 3: Configurar o serviço

1. **Service name:** `femaf-backend` (ou outro nome)
2. **CPU:** 0.25 vCPU
3. **Memory:** 0.5 GB (suficiente para teste)
4. **Environment variables** – clique em **Add environment variable** e adicione:

   | Key | Value |
   |-----|--------|
   | `MP_ACCESS_TOKEN` | (seu token do Mercado Pago) |
   | `BASE_URL` | `https://extensao.femaf.com.br` |
   | `API_BASE_URL` | Deixe em branco por enquanto; depois coloque a URL do App Runner |
   | `MP_WEBHOOK_SECRET` | (chave do webhook no painel MP) |
   | `PORT` | `3000` |
   | `MOODLE_BASE_URL` | `https://ead.femaf.com.br` |
   | `MOODLE_TOKEN` | (token do Web Service do Moodle) |
   | `MOODLE_ROLE_ID` | `5` (papel estudante) |
   | `MOODLE_TEST_PASSWORD` | (opcional; senha ao criar usuário no webhook se não vier no fluxo) |
   | `APP_DEPLOY_TAG` | (opcional; ex.: `20260319-1` — aparece em `GET /health` para confirmar deploy) |

5. Avance com **Next**

## Passo 4: Rede e health check

1. **Virtual router:** deixe padrão (público)
2. **Health check:** pode deixar `/health` e porta `3000`
3. Clique em **Create & deploy**

## Conferir se o deploy é o código certo

Após subir, abra no navegador ou Postman:

`GET https://SUA-URL-DO-APP-RUNNER/health`

A resposta inclui `version` (do `package.json`, ex.: `1.1.0`) e, se você definiu, `deployTag`.

- Se nos **logs** ainda aparecer texto antigo (ex.: “Moodle DESATIVADO” em rotas que já foram alteradas), o serviço pode estar com **imagem em cache** ou **branch/commit errado**. Aumente `APP_DEPLOY_TAG` e faça novo deploy, ou force rebuild no App Runner.

## Passo 5: Obter a URL

1. Aguarde o status **Running** (alguns minutos)
2. Na tela do serviço, copie a **Default domain** (ex.: `xxxxx.us-east-1.awsapprunner.com`)
3. A URL do backend será: `https://xxxxx.us-east-1.awsapprunner.com`

## Passo 6: Ajustar variáveis e webhook

1. No App Runner, abra o serviço > **Configuration** > **Edit**
2. Em **Environment variables**, edite `API_BASE_URL` e coloque: `https://SUA-DEFAULT-DOMAIN` (a URL que você copiou)
3. Salve e aguarde o novo deploy
4. No painel do Mercado Pago (Webhooks), use como URL de notificação:
   - `https://SUA-DEFAULT-DOMAIN/webhook/mercadopago`
5. No frontend (`js/curso.js`), defina:
   - `const API_BASE_URL = 'https://SUA-DEFAULT-DOMAIN';`

---

# Opção B: AWS Elastic Beanstalk

Bom se você quiser mais controle ou já usar Beanstalk.

## Passo 1: Preparar o projeto

Na pasta `backend`, crie o arquivo `.ebextensions/nodecommand.config` (crie a pasta `.ebextensions` se não existir):

```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
```

Garanta que no `package.json` exista:

```json
"scripts": {
  "start": "node src/index.js"
}
```

## Passo 2: Instalar EB CLI (opcional, para deploy via terminal)

```bash
pip install awsebcli
# ou
npm install -g aws-elasticbeanstalk
```

Configurar credenciais AWS:

```bash
aws configure
```

## Passo 3: Criar aplicação no console

1. Acesse **Elastic Beanstalk** no console AWS
2. **Create Application**
3. **Application name:** `femaf-backend`
4. **Platform:** Node.js
5. **Platform branch:** Node.js 18
6. **Application code:** Upload your code (você fará upload de um ZIP) ou Sample application (para testar)

## Passo 4: Fazer o deploy por upload

1. Na pasta `backend`, gere um ZIP **sem** `node_modules` e sem `.env`:
   - Inclua: `package.json`, `src/`, `env.example`, etc.
2. No Beanstalk: **Upload and deploy** > envie o ZIP
3. Aguarde o deploy

## Passo 5: Variáveis de ambiente no Beanstalk

1. No console: sua aplicação > **Configuration** > **Software** > **Edit**
2. Em **Environment properties**, adicione:
   - `MP_ACCESS_TOKEN`
   - `BASE_URL` = `https://extensao.femaf.com.br`
   - `API_BASE_URL` = URL do ambiente (ex.: `https://femaf-backend.us-east-1.elasticbeanstalk.com`)
   - `MP_WEBHOOK_SECRET`
3. Salve e aguarde o restart

## Passo 6: URL e porta

- A URL do ambiente aparece no topo do Elastic Beanstalk (ex.: `femaf-backend.us-east-1.elasticbeanstalk.com`)
- Beanstalk define `PORT` automaticamente; o app já usa `process.env.PORT`

---

# Opção C: EC2 (máquina virtual)

Para controle total, rodando Node.js numa instância Linux.

## Passo 1: Lançar instância

1. **EC2** > **Launch instance**
2. **Name:** femaf-backend
3. **AMI:** Amazon Linux 2023
4. **Instance type:** t2.micro (free tier)
5. **Key pair:** crie ou selecione um para SSH
6. **Security group:** crie um com:
   - SSH (22) – seu IP
   - HTTP (80) – 0.0.0.0/0
   - Custom TCP 3000 – 0.0.0.0/0 (ou use só 80 com proxy)
7. Launch

## Passo 2: Conectar e instalar Node.js

```bash
ssh -i sua-chave.pem ec2-user@IP-DA-INSTANCIA
```

Na instância:

```bash
sudo dnf update -y
sudo dnf install -y nodejs npm git
node -v   # deve ser 18+
```

Se a versão for antiga, use nvm:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

## Passo 3: Clonar e rodar o backend

```bash
cd ~
git clone https://github.com/SEU-USUARIO/SEU-REPO.git
cd SEU-REPO/backend
npm install
```

Crie o `.env`:

```bash
nano .env
```

Cole (ajuste os valores):

```
MP_ACCESS_TOKEN=seu_token
BASE_URL=https://extensao.femaf.com.br
API_BASE_URL=http://IP-DA-INSTANCIA:3000
MP_WEBHOOK_SECRET=sua_chave
PORT=3000
```

Salve (Ctrl+O, Enter, Ctrl+X).

Rodar em background (teste simples):

```bash
npm start
```

Para manter rodando após desconectar, use **pm2**:

```bash
npm install -g pm2
pm2 start src/index.js --name femaf-backend
pm2 save
pm2 startup
```

## Passo 4: HTTPS e domínio (opcional)

- Para HTTPS e um domínio próprio, use um **Application Load Balancer** + certificado ACM e aponte o domínio (ex.: `api.extensao.femaf.com.br`) para o ALB.
- Para só testar, usar `http://IP-PUBLICO:3000` já funciona (webhook do Mercado Pago exige HTTPS; nesse caso use ngrok ou coloque atrás de ALB/HTTPS).

---

# Depois do deploy (qualquer opção)

## 1. Testar o backend

```bash
curl https://SUA-URL-AWS/health
```

Resposta esperada: `{"status":"ok","timestamp":"..."}`

```bash
curl -X POST https://SUA-URL-AWS/checkout/create \
  -H "Content-Type: application/json" \
  -d '{"courseId":"EXT-001"}'
```

Resposta esperada: `{"init_point":"https://www.mercadopago.com.br/..."}`

## 2. Frontend

Em `js/curso.js`:

```javascript
const API_BASE_URL = 'https://SUA-URL-AWS';
```

## 3. Webhook no Mercado Pago

- **Suas integrações** > Webhooks > URL de notificação:
  - `https://SUA-URL-AWS/webhook/mercadopago`
- Evento: **Pagamentos**

## 4. CORS

O backend já usa `cors` com `origin: "*"`. Se quiser restringir:

- No `.env` da AWS: `CORS_ORIGIN=https://extensao.femaf.com.br`
- O código já usa `process.env.CORS_ORIGIN || "*"`.

---

# Resumo rápido – App Runner

1. App Runner > Create service  
2. Repositório GitHub > branch `main`  
3. Runtime Node.js 18, Start: `npm start`, Port: `3000`  
4. Variáveis: `MP_ACCESS_TOKEN`, `BASE_URL`, `MP_WEBHOOK_SECRET`, `PORT=3000`  
5. Deploy > copiar Default domain  
6. Atualizar `API_BASE_URL` no App Runner e no frontend  
7. Configurar URL do webhook no painel do Mercado Pago  

Com isso o backend fica hospedado na AWS e serve para testar o fluxo completo (checkout + webhook).
