// Middleware para rutas no encontradas (404).
const notFound = (req, res, next) => {
    res.status(404).json({
      error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    });
  };
  
  module.exports = notFound;
  