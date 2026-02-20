# Configuração Segura de Credenciais do Mercado Pago

Guia completo para configurar corretamente e de forma segura as credenciais do Mercado Pago em um backend Node.js.

---

## 1. Onde obter o ACCESS_TOKEN

1. Acesse: **https://www.mercadopago.com.br/developers/**
2. Faça login com sua conta Mercado Pago
3. Vá em **Suas integrações** (ou "Your integrations")
4. Crie ou selecione uma aplicação
5. Na seção **Credenciais**, você encontrará:
   - **Access Token (Produção)** – para cobranças reais
   - **Access Token (Teste)** – para desenvolvimento

> URL direta do painel: https://www.mercadopago.com.br/developers/panel/app

---

## 2. Diferença entre Token de Teste e Produção

| Aspecto | Token de Teste | Token de Produção |
|---------|----------------|-------------------|
| **Uso** | Desenvolvimento e homologação | Cobranças reais |
| **Valores** | Transações simuladas (sem dinheiro real) | Pagamentos reais |
| **Usuários** | Contas de teste configuradas no painel | Qualquer usuário Mercado Pago |
| **Prefixo** | `TEST-` | `APP_USR-` |
| **Onde gerar** | Disponível imediatamente | Requer aprovação da aplicação |

**Regra de ouro:** Use token de **teste** durante todo o desenvolvimento; troque para **produção** apenas no deploy final após testes.

---

## 3. Exemplo de Uso com dotenv

### Arquivo `env.example` (versionado no Git, sem valores sensíveis):

```env
# Mercado Pago - NUNCA preencher valores reais aqui
MP_ACCESS_TOKEN=
```

### Arquivo `.env` (NÃO versionar, criar localmente):

```env
# Desenvolvimento - Token de teste
MP_ACCESS_TOKEN=TEST-1234567890123456-012345-abcdef1234567890abcdef1234567890-123456789

# Produção (trocar quando for para live)
# MP_ACCESS_TOKEN=APP_USR-1234567890123456-012345-abcdef1234567890abcdef1234567890-123456789
```

### Código Node.js:

```javascript
import dotenv from "dotenv";

dotenv.config();

const accessToken = process.env.MP_ACCESS_TOKEN;

if (!accessToken?.trim()) {
  console.error("MP_ACCESS_TOKEN não configurado. Crie um arquivo .env");
  process.exit(1);
}

// Uso com SDK
import { MercadoPagoConfig } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: accessToken.trim(),
  options: { timeout: 10000 }
});
```

---

## 4. Boas Práticas para Não Versionar Segredos

- **Sempre** adicione `.env` ao `.gitignore`:
  ```
  .env
  .env.local
  .env.*.local
  ```

- **Use `env.example`** com chaves vazias como template para outros desenvolvedores

- **Nunca** faça commit de tokens no código:
  ```javascript
  // ERRADO ❌
  const token = "APP_USR-12345...";
  ```

- **Em produção** (Vercel, Railway, Heroku, etc.): configure as variáveis no painel do provedor, não use arquivo `.env` no repositório

- **Em CI/CD**: injete secrets como variáveis de ambiente secretas do pipeline

---

## 5. Como Validar se o Token Está Funcionando

### Opção 1 – Chamar a API diretamente

```javascript
async function validateMercadoPagoToken(accessToken) {
  try {
    const response = await fetch("https://api.mercadopago.com/users/me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (response.ok) {
      const user = await response.json();
      console.log("Token OK - Conta:", user.email);
      return true;
    }
    
    const err = await response.json();
    console.error("Token inválido:", err.message);
    return false;
  } catch (error) {
    console.error("Erro ao validar:", error.message);
    return false;
  }
}
```

### Opção 2 – Criar uma preferência de teste

Se o endpoint `POST /checkout/create` retornar um `init_point` válido, o token está funcionando.

---

## 6. Erros Comuns de Autenticação e Como Diagnosticar

| Erro | Causa provável | Solução |
|------|----------------|---------|
| **401 Unauthorized** | Token inválido ou expirado | Verificar token no painel e recopiar |
| **"Token não configurado"** | `.env` não carregado ou variável vazia | Verificar se `.env` existe e `dotenv.config()` é chamado antes do uso |
| **403 Forbidden** | Permissões insuficientes da aplicação | Conferir escopos no painel do Mercado Pago |
| **invalid_access_token** | Token mal copiado (espaços, truncado) | Copiar novamente, sem espaços extras no início/fim |
| **Timeout** | Rede ou API do MP instável | Verificar conexão; aumentar timeout se necessário |

### Formato típico de erro do Mercado Pago

```json
{
  "message": "Invalid access token",
  "error": "invalid_token",
  "status": 401
}
```

### Checklist de diagnóstico

1. [ ] O arquivo `.env` existe na raiz do projeto?
2. [ ] `dotenv.config()` é chamado antes de acessar `process.env`?
3. [ ] O nome da variável está correto? (ex: `MP_ACCESS_TOKEN`)
4. [ ] O token não tem espaços ou quebras de linha acidentais?
5. [ ] Está usando token de **teste** em desenvolvimento?
6. [ ] Em produção, a aplicação está aprovada e usando token de produção?
