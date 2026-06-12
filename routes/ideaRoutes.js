// ============================================================
// ideaRoutes.js
// Aquí definimos las URLs (rutas) del servidor y decidimos
// qué funciones se ejecutan cuando alguien hace una petición.
// El orden importa: primero va el middleware (validación),
// y después el controlador (lógica principal).
// ============================================================

const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');
const ideaMiddlewares = require('../middleware/ideaMiddlewares');

// Ruta POST: primero valida los campos, luego registra la idea
// El middleware validarCampos se ejecuta antes que registrarIdea
// Si el middleware encuentra un error, no se ejecuta el controlador
router.post('/registrar-idea', ideaMiddlewares.validarCampos, ideaController.registrarIdea);

module.exports = router;