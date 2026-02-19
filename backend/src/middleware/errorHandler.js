/**
 * Middleware global de tratamento de erros
 * Retorna respostas HTTP consistentes e evita vazamento de informações sensíveis
 */

/**
 * Handler de erros para Express
 * @param {Error} err - Erro capturado
 * @param {object} req - Request
 * @param {object} res - Response
 * @param {function} next - Next middleware
 */
export function errorHandler(err, req, res, next) {
  // Log interno (em produção, usar logger estruturado)
  console.error("[Error]", err.message);
  if (err.stack && process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  // Erros da API Mercado Pago (podem vir em err.cause)
  const status = err.status ?? err.cause?.status ?? err.response?.status;
  if (status === 400 || err.name === "BadRequestError") {
    return res.status(400).json({
      error: "BAD_REQUEST",
      message: err.message || "Requisição inválida",
    });
  }

  if (status === 401 || err.name === "UnauthorizedError") {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Credenciais inválidas",
    });
  }

  if (status === 404) {
    return res.status(404).json({
      error: "NOT_FOUND",
      message: err.message || "Recurso não encontrado",
    });
  }

  // Timeout ou falha de rede
  if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
    return res.status(504).json({
      error: "GATEWAY_TIMEOUT",
      message: "Tempo limite excedido na comunicação com o gateway de pagamento",
    });
  }

  // Erro genérico - não expor detalhes internos em produção
  const isProduction = process.env.NODE_ENV === "production";
  const message = isProduction
    ? "Erro interno do servidor. Tente novamente mais tarde."
    : err.message;

  return res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message,
  });
}
