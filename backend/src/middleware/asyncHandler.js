/**
 * Wrapper para rotas assíncronas
 * Captura erros de Promises e repassa para o error handler do Express
 * Evita necessidade de try/catch em cada rota
 */

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
