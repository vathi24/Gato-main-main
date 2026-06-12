const path = require('path');

// ============================================================
// ideaMiddlewares.js
// Los middlewares son funciones que se ejecutan ANTES de que
// la solicitud llegue al controlador. Sirven para revisar,
// validar o transformar los datos que envía el usuario.
// En este caso, verificamos que el formulario venga completo.
// ============================================================

// Middleware: validar que todos los campos del formulario estén llenos
exports.validarCampos = (req, res, next) => {
    // Extraemos los campos del cuerpo de la solicitud (formulario)
    const { nombre, departamento, idea } = req.body;

    // Si algún campo está vacío o no fue enviado, rechazamos la solicitud
    if (!nombre || !departamento || !idea) {
        return res.status(400).sendFile(path.join(__dirname, '..', 'public', 'idea-validation-error.html'));
    }

    // Si todo está bien, llamamos a next() para pasar al controlador
    next();
};
