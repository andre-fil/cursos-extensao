/**
 * Middleware de timeout para requisições
 * Encerra requisições que excedem o tempo limite (evita recursos bloqueados)
 */

const DEFAULT_TIMEOUT_MS = 15000; // 15 segundos

export function requestTimeout(ms = DEFAULT_TIMEOUT_MS) {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({
          error: "GATEWAY_TIMEOUT",
          message: "Tempo limite da requisição excedido",
        });
      }
    }, ms);

    res.on("finish", () => clearTimeout(timer));
    res.on("close", () => clearTimeout(timer));
    next();
  };
}
