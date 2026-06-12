// Middleware central de manejo de errores.
// Express lo reconoce como error handler porque recibe 4 parámetros.
const errorHandler = (err, req, res, next) => {
    console.error(err);
  
    const status = err.status || 500;
    res.status(status).json({
      error: err.message || 'Error interno del servidor',
    });
  };
  
  module.exports = errorHandler;
  