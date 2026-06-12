require('dotenv').config();
const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

const app = express();

// Middlewares base
app.use(cors());
app.use(express.json());

// Rutas de la API (todas cuelgan de /api)
app.use('/api', routes);

// Manejo de 404 y errores (siempre al final)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
