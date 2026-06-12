const { Router } = require('express');
const healthRoutes = require('./health.routes');

const router = Router();

router.use('/health', healthRoutes);

// A medida que crezca el proyecto se montan aquí las demás rutas:
// router.use('/usuarios', require('./usuarios.routes'));
// router.use('/cursos', require('./cursos.routes'));

module.exports = router;
