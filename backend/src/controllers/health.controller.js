// Controlador de ejemplo para verificar que la API responde.
const checkHealth = (req, res) => {
    res.json({
      status: 'ok',
      service: 'RevoLab API',
      timestamp: new Date().toISOString(),
    });
  };
  
  module.exports = { checkHealth };
  