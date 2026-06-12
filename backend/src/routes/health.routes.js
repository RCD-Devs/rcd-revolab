const { Router } = require('express');
const { checkHealth } = require('../controllers/health.controller');

const router = Router();

// GET /api/health
router.get('/', checkHealth);

module.exports = router;
